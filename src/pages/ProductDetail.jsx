import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`https://gella.cloudindustrie.com/api/marketplace/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    if (loading) return <div className="p-8 text-white">Loading product...</div>;
    if (!product) return <div className="p-8 text-white">Produit introuvable.</div>;

    return (
        <div className="p-8 text-white max-w-3xl mx-auto">
            <h1 className="text-3xl font-semibold mb-4">{product.title}</h1>
            <div className="h-64 bg-[#071126] rounded mb-4" />
            <p className="mb-4">{product.description}</p>
            <p className="text-xl font-bold">${product.price}</p>
            <button className="mt-4 px-6 py-2 rounded bg-gradient-to-r from-green-400 to-blue-400 text-black font-semibold">
                Acheter
            </button>
        </div>
    );
}
