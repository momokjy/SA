"use client";

import { useState } from "react";
import { ArrowRight, RefreshCw } from "lucide-react";

export default function RWAVisualizer() {
    const [step, setStep] = useState(0);
    const steps = [
        { title: "Initial Capital", desc: "100M KRW (USDC)", leverage: "1x" },
        { title: "Buy Bonds", desc: "Buy 100M ONDO (5% APY)", leverage: "1x" },
        { title: "Collateralize", desc: "Deposit ONDO -> Borrow 80M USDC", leverage: "1.8x" },
        { title: "Loop Buy", desc: "Buy 80M ONDO with borrowed funds", leverage: "1.8x" },
        { title: "Repeat x5", desc: "Total Exposure: 500M KRW", leverage: "5x" },
    ];

    return (
        <div className="my-8 p-6 bg-protoss-card border border-protoss-border rounded-xl max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-mono text-protoss-accent-blue">RECURSIVE LEVERAGE ENGINE</h3>
                <button
                    onClick={() => setStep(0)}
                    className="p-2 hover:bg-protoss-bg rounded-full text-slate-500 hover:text-white transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                {steps.map((s, i) => (
                    <div
                        key={i}
                        className={`flex items-center gap-4 transition-all duration-500 ${i <= step ? "opacity-100 translate-x-0" : "opacity-20 translate-x-4"
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs border ${i <= step ? "border-protoss-accent-blue bg-protoss-accent-blue/20 text-protoss-accent-blue" : "border-slate-700 text-slate-700"
                            }`}>
                            {i + 1}
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-bold text-white">{s.title}</div>
                            <div className="text-xs text-slate-500">{s.desc}</div>
                        </div>
                        {i <= step && (
                            <div className="text-xs font-mono text-protoss-accent-gold">{s.leverage}</div>
                        )}
                    </div>
                ))}
            </div>

            <button
                onClick={() => setStep((prev) => Math.min(prev + 1, steps.length - 1))}
                disabled={step >= steps.length - 1}
                className="mt-6 w-full py-3 bg-protoss-accent-blue/10 border border-protoss-accent-blue text-protoss-accent-blue font-mono text-sm rounded hover:bg-protoss-accent-blue hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {step >= steps.length - 1 ? "MAX LEVERAGE REACHED" : "EXECUTE NEXT LOOP"}
            </button>
        </div>
    );
}
