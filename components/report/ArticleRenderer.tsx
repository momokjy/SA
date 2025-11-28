"use client";

import { Article } from "@/data/types";
import TaxCalculator from "../widgets/TaxCalculator";
import CoffeeSlider from "../widgets/CoffeeSlider";
import RWAVisualizer from "../widgets/RWAVisualizer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArticleRenderer({ article }: { article: Article }) {
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-12 animate-in fade-in duration-500">
            {/* Navigation */}
            <Link
                href="/"
                className="inline-flex items-center text-slate-500 hover:text-protoss-accent-blue mb-8 transition-colors font-mono text-sm"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                BACK TO TERMINAL
            </Link>

            {/* Header */}
            <header className="mb-12 border-b border-protoss-border pb-8">
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-protoss-accent-blue/10 text-protoss-accent-blue text-xs font-mono border border-protoss-accent-blue/20 rounded">
                        {article.id}
                    </span>
                    <span className="text-slate-500 text-xs font-mono uppercase">
            // {article.category}
                    </span>
                </div>
                <h1 className="text-3xl md:text-5xl font-bold font-serif text-white leading-tight mb-6 tracking-tight">
                    {article.title}
                </h1>
                <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                        <span key={tag} className="text-xs text-slate-400 font-mono bg-protoss-card px-2 py-1 rounded border border-protoss-border">
                            #{tag}
                        </span>
                    ))}
                </div>
            </header>

            {/* Article Image */}
            {article.imageUrl && (
                <div className="mb-12 rounded-xl overflow-hidden border border-protoss-border shadow-2xl">
                    <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-auto object-cover max-h-[500px]"
                    />
                </div>
            )}

            {/* Core Thesis Callout */}
            <div className="mb-16 p-8 md:p-10 bg-protoss-card border-l-4 border-protoss-accent-gold rounded-r-xl relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-8xl font-serif text-protoss-accent-gold leading-none">"</span>
                </div>
                <h3 className="text-protoss-accent-gold font-mono text-sm font-bold mb-4 uppercase tracking-widest">
                    Core Thesis
                </h3>
                <p className="text-xl md:text-2xl text-slate-200 font-serif italic leading-relaxed relative z-10">
                    {article.coreThesis}
                </p>
            </div>

            {/* Main Content */}
            <article
                className="prose prose-invert prose-lg max-w-none 
        prose-headings:font-serif prose-headings:text-protoss-accent-blue prose-headings:font-bold prose-headings:tracking-tight
        prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b prose-h2:border-slate-800 prose-h2:pb-4
        prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6 prose-h3:text-white
        prose-p:text-slate-300 prose-p:leading-loose prose-p:font-serif prose-p:text-xl prose-p:mb-8 prose-p:break-keep
        prose-strong:text-white prose-strong:font-bold prose-strong:bg-protoss-accent-blue/10 prose-strong:px-1 prose-strong:rounded
        prose-ul:text-slate-300 prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-8 prose-ul:space-y-3
        prose-ol:text-slate-300 prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-8 prose-ol:space-y-3
        prose-li:marker:text-protoss-accent-blue prose-li:leading-relaxed prose-li:break-keep prose-li:text-lg
        prose-blockquote:border-l-4 prose-blockquote:border-protoss-accent-gold prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-400 prose-blockquote:bg-slate-800/30 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r
        prose-code:text-protoss-accent-blue prose-code:font-mono prose-code:bg-protoss-card prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-protoss-border
        "
                dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Dynamic Widgets */}
            <div className="mt-12">
                {article.id === "TAX-001" && <TaxCalculator />}
                {article.id === "LIFE-001" && <CoffeeSlider />}
                {article.id === "STRAT-001" && <RWAVisualizer />}
            </div>
        </div>
    );
}
