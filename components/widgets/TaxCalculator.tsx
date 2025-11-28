"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

export default function TaxCalculator() {
    const [profit, setProfit] = useState<number | "">("");

    const profitNum = Number(profit) || 0;
    const deduction = 2500000;
    const taxable = Math.max(0, profitNum - deduction);
    const tax = taxable * 0.22;

    return (
        <div className="my-8 p-6 bg-protoss-card border border-protoss-border rounded-xl max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-4 text-protoss-accent-blue font-mono font-bold">
                <Calculator className="w-5 h-5" />
                <span>TAX SIMULATOR 2025</span>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-mono text-slate-500 mb-1">TOTAL PROFIT (KRW)</label>
                    <input
                        type="number"
                        value={profit}
                        onChange={(e) => setProfit(Number(e.target.value))}
                        className="w-full bg-protoss-bg border border-protoss-border rounded p-2 text-white font-mono focus:border-protoss-accent-blue outline-none"
                        placeholder="e.g. 10000000"
                    />
                </div>

                <div className="space-y-2 pt-4 border-t border-protoss-border font-mono text-sm">
                    <div className="flex justify-between text-slate-400">
                        <span>Basic Deduction</span>
                        <span>- 2,500,000 KRW</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                        <span>Taxable Amount</span>
                        <span>{taxable.toLocaleString()} KRW</span>
                    </div>
                    <div className="flex justify-between text-protoss-accent-gold font-bold text-lg pt-2">
                        <span>FINAL TAX (22%)</span>
                        <span>{tax.toLocaleString()} KRW</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
