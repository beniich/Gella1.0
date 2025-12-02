import React from 'react';

export default function Preview() {
    return (
        <div className="min-h-screen flex bg-[#0b0f1a] text-white font-sans">
            {/* Sidebar */}
            <aside className="w-72 h-screen fixed left-0 top-0 p-6 bg-[#111827] border-r border-white/10">
                <div className="mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-r from-green-300 to-blue-400" />
                    <div className="text-lg font-semibold">Gella</div>
                </div>

                <nav className="flex flex-col gap-2">
                    {['Dashboard', 'Studio', 'Marketplace', 'Profile', 'Settings'].map((item) => (
                        <div key={item} className="flex items-center gap-3 p-3 rounded-md hover:bg-white/5 cursor-pointer">
                            <span className="w-5 h-5 bg-white/20 rounded" />
                            <span>{item}</span>
                        </div>
                    ))}
                </nav>

                <div className="mt-auto pt-6">
                    <button className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-blue-400 font-semibold text-black">Upgrade</button>
                    <div className="mt-4 text-sm text-gray-400">v0.1 • Beta</div>
                </div>
            </aside>

            {/* Main */}
            <main className="ml-72 p-8 w-full">
                <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

                <section className="grid grid-cols-3 gap-6">
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">Stats widget</div>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">Recent generations</div>
                    <div className="p-6 rounded-xl bg-white/5 border border-white/10">Marketplace highlights</div>
                </section>

                <div className="mt-10">
                    <form className="flex gap-3">
                        <input
                            placeholder="Describe your image..."
                            className="flex-1 p-3 rounded-md bg-black/40 border border-white/10"
                        />
                        <button type="button" className="px-4 py-2 rounded-md bg-gradient-to-r from-green-400 to-blue-400 font-semibold text-black">
                            Generate
                        </button>
                    </form>
                </div>

                <div className="mt-10 grid grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                            <div style={{ height: 140 }} className="rounded-md mb-2 bg-[#071126]" />
                            <div className="flex justify-between items-center text-sm">
                                <span>Prompt summary</span>
                                <div className="flex gap-2">
                                    <button className="text-sm hover:underline">Retry</button>
                                    <button className="text-sm hover:underline">Edit</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
