import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Marketplace() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://gella.cloudindustrie.com/api/marketplace/products')
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-8 text-white">Loading marketplace...</div>;

    return (
        <div className="p-8 text-white">
            <h1 className="text-2xl font-semibold mb-6">Marketplace</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                    <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10"
                    >
                        <div className="h-40 bg-[#071126] rounded mb-2" />
                        <h2 className="font-medium">{p.title}</h2>
                        <p className="text-sm text-gray-400">${p.price}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
