"use client";

import { useState } from "react";

export default function CoffeeSlider() {
    const [value, setValue] = useState(50);

    const getStatus = (val: number) => {
        if (val < 30) return { text: "BITTER / LIQUIDATION", color: "text-red-500" };
        if (val > 70) return { text: "SOUR / MISSED OPP", color: "text-yellow-500" };
        return { text: "SWEET SPOT / PROFIT", color: "text-protoss-accent-gold" };
    };

    const status = getStatus(value);

    return (
        <div className="my-8 p-6 bg-protoss-card border border-protoss-border rounded-xl max-w-md mx-auto text-center">
            <h3 className="font-mono text-protoss-accent-blue mb-6">VARIABLE CONTROL: GRIND SIZE</h3>

            <input
                type="range"
                min="0"
                max="100"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full h-2 bg-protoss-bg rounded-lg appearance-none cursor-pointer accent-protoss-accent-blue"
            />

            <div className="flex justify-between text-xs font-mono text-slate-500 mt-2">
                <span>FINE (High Lev)</span>
                <span>COARSE (Low Lev)</span>
            </div>

            <div className={`mt-6 font-bold font-mono text-lg ${status.color}`}>
                {status.text}
            </div>
        </div>
    );
}
