import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminProductCreate() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('https://gella.cloudindustrie.com/api/marketplace/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    title,
                    description,
                    price: parseFloat(price),
                    imageUrl,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create product');
            }

            navigate('/marketplace');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'admin') {
        return (
            <div className="p-8 text-white text-center">
                <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="p-8 text-white max-w-2xl mx-auto">
            <h1 className="text-3xl font-semibold mb-6">Create New Product</h1>

            {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-blue-500 outline-none h-32"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Image URL</label>
                    <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full p-3 rounded bg-white/5 border border-white/10 focus:border-blue-500 outline-none"
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded bg-gradient-to-r from-green-400 to-blue-400 text-black font-semibold disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Product'}
                </button>
            </form>
        </div>
    );
}
