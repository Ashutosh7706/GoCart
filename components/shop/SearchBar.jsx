"use client";

import { Search } from "lucide-react";

export default function SearchBar({

    value,

    onChange,

}) {

    return (

        <div className="bg-white border rounded-xl p-4 shadow-sm">

            <div className="relative">

                <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-green-500"
                />

            </div>

        </div>
    
    );

}