import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';
import bcrypt from 'bcrypt';
import OpenAI from 'openai';
import {
    createUser,
    findUserByEmail,
    findUserById,
    getUserCredits,
    updateUserCredits,
    createDesign,
    getUserDesigns,
    getDesignById,
    updateDesign,
    deleteDesign,
} from './db.js';
import { createProduct, getAllProducts, getProductById } from './models/product.js';
import { requireAuth, requireCredits, requireAdmin } from './middleware/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Session store
const SQLiteStore = connectSqlite3(session);

// Middleware
app.use(cors({
    origin: 'http://localhost:5174',
    credentials: true,
}));
app.use(express.json());

// Session configuration
app.use(
    session({
        store: new SQLiteStore({ db: 'sessions.db', dir: './' }),
        secret: process.env.SESSION_SECRET || 'gella-secret-key-change-in-production',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: 'lax',
        },
    })
);

// Initialize OpenAI (optional)
let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// Health check
app.get('/', (req, res) => {
    res.send('GELLA Backend is running');
});

// ===== AUTH ROUTES =====

// Signup
app.post('/api/auth/signup', async (req, res) => {
    const { username, email, password } = req.body;

    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        // Check if user exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create user
        const userId = await createUser(username, email, passwordHash);

        // Create session
        req.session.userId = userId;

        const user = await findUserById(userId);
        res.status(201).json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                credits: user.credits,
            },
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Create session
        req.session.userId = user.id;

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                credits: user.credits,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
    });
});

// Get current user
app.get('/api/auth/me', requireAuth, (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            credits: req.user.credits,
            role: req.user.role,
        },
    });
});

// ===== CREDITS ROUTES =====

// Get credits
app.get('/api/credits', requireAuth, (req, res) => {
    res.json({ credits: req.user.credits });
});

// Add credits (for simulation/upgrade)
app.post('/api/credits/add', requireAuth, (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    const newCredits = req.user.credits + amount;
    await updateUserCredits(req.user.id, newCredits);

    res.json({ credits: newCredits });
});

// ===== DESIGN ROUTES =====

// Generate design (protected, requires credits)
app.post('/api/generate', requireAuth, requireCredits(1), async (req, res) => {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!openai) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        // Generate image
        const imageResult = await openai.images.generate({
            model: 'dall-e-3',
            prompt: prompt,
            size: '1024x1024',
            n: 1,
        });

        const imageUrl = imageResult.data[0].url;
        const explanation = 'Generated design based on your prompt.';

        // Save to database
        const designId = await createDesign(req.user.id, prompt, imageUrl, explanation);

        // Deduct 1 credit
        const newCredits = req.user.credits - 1;
        await updateUserCredits(req.user.id, newCredits);

        res.json({
            id: designId,
            type: 'image',
            content: prompt,
            image: imageUrl,
            explanation,
            creditsRemaining: newCredits,
        });
    } catch (error) {
        console.error('Generation error:', error);
        res.status(500).json({ error: 'Failed to generate design' });
    }
});

// Get all user designs
app.get('/api/designs', requireAuth, async (req, res) => {
    const designs = await getUserDesigns(req.user.id);
    res.json(designs);
});

// Update design (regenerate with new prompt)
app.put('/api/designs/:id', requireAuth, requireCredits(1), async (req, res) => {
    const { id } = req.params;
    const { prompt } = req.body;

    const design = await getDesignById(id);
    if (!design || design.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Design not found' });
    }

    if (!openai) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        const imageResult = await openai.images.generate({
            model: 'dall-e-3',
            prompt,
            size: '1024x1024',
            n: 1,
        });

        const imageUrl = imageResult.data[0].url;
        const explanation = 'Design updated with new prompt.';

        await updateDesign(id, prompt, imageUrl, explanation);

        // Deduct 1 credit
        const newCredits = req.user.credits - 1;
        await updateUserCredits(req.user.id, newCredits);

        res.json({
            id,
            prompt,
            image: imageUrl,
            explanation,
            creditsRemaining: newCredits,
        });
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Failed to update design' });
    }
});

// Delete design
app.delete('/api/designs/:id', requireAuth, async (req, res) => {
    const { id } = req.params;

    const design = await getDesignById(id);
    if (!design || design.user_id !== req.user.id) {
        return res.status(404).json({ error: 'Design not found' });
    }

    await deleteDesign(id);
    res.json({ success: true });
});

// ===== MARKETPLACE ROUTES =====

app.get('/api/marketplace/products', async (req, res) => {
    const products = await getAllProducts();
    res.json(products);
});

app.get('/api/marketplace/products/:id', async (req, res) => {
    const product = await getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

// Create product (admin only)
app.post('/api/marketplace/products', requireAuth, requireAdmin, async (req, res) => {
    const { title, description, price, imageUrl } = req.body;
    const productId = await createProduct({
        title,
        description,
        price,
        imageUrl,
        authorId: req.user.id,
    });
    res.status(201).json({ id: productId });
});

app.listen(port, () => {
    console.log(`✓ Server running on port ${port}`);
    console.log(`✓ Auth endpoints ready`);
    console.log(`✓ Database initialized`);
});
