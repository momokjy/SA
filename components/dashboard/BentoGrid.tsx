"use client";

import Link from "next/link";
import { ArrowUpRight, TrendingUp, Activity, Lock, ShieldCheck, Zap } from "lucide-react";
import { archives } from "@/data";
import { Article } from "@/data/types";
import { clsx } from "clsx";

// Helper to get articles by volume
const getVol = (vol: number) => archives.filter((a) => a.volume === vol);

interface BentoGridProps {
    filter?: string;
}

export default function BentoGrid({ filter }: BentoGridProps) {
    const filterMap: Record<string, number> = {
        macro: 1,
        infra: 2,
        strategy: 3,
        life: 4,
        tech: 5,
    };

    const activeVol = filter ? filterMap[filter] : null;
    const showVol = (vol: number) => !activeVol || activeVol === vol;

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
            {/* Header / Welcome */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-mono text-white tracking-tight">
                    태리아빠의 <span className="text-protoss-accent-blue">지식창고</span>
                </h1>
                <p className="text-slate-400 font-mono text-sm mt-2">
                    Institutional-Grade Research Terminal // Vol. 1-5 Loaded
                </p>
            </div>

            {/* Volume 1: Macro */}
            {showVol(1) && (
                <VolumeSection
                    title="VOLUME 1: MACRO & LIQUIDITY"
                    icon={TrendingUp}
                    color="blue"
                    articles={getVol(1)}
                />
            )}

            {/* Volume 2: Payment (Infra) */}
            {showVol(2) && (
                <VolumeSection
                    title="VOLUME 2: PAYMENT INFRA"
                    icon={Zap}
                    color="blue"
                    articles={getVol(2)}
                />
            )}

            {/* Volume 3: Strategy */}
            {showVol(3) && (
                <VolumeSection
                    title="VOLUME 3: STRATEGY"
                    icon={Activity}
                    color="gold"
                    articles={getVol(3)}
                />
            )}

            {/* Volume 4: Tax/Life */}
            {showVol(4) && (
                <VolumeSection
                    title="VOLUME 4: TAX & LIFE"
                    icon={Lock}
                    color="green"
                    articles={getVol(4)}
                />
            )}

            {/* Volume 5: Tech */}
            {showVol(5) && (
                <VolumeSection
                    title="VOLUME 5: DEEP TECH"
                    icon={ShieldCheck}
                    color="purple"
                    articles={getVol(5)}
                />
            )}
        </div>
    );
}

function VolumeSection({
    title,
    icon: Icon,
    color,
    articles,
}: {
    title: string;
    icon: any;
    color: "blue" | "gold" | "purple" | "green";
    articles: Article[];
}) {
    const colorClasses = {
        blue: "text-protoss-accent-blue",
        gold: "text-protoss-accent-gold",
        purple: "text-purple-400",
        green: "text-green-400",
    };

    return (
        <section>
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-2">
                <Icon className={clsx("w-6 h-6", colorClasses[color])} />
                <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                    {title}
                </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} color={color} />
                ))}
            </div>
        </section>
    );
}

function ArticleCard({
    article,
    color = "blue"
}: {
    article: Article;
    color?: "blue" | "gold" | "purple" | "green";
}) {
    const borderClasses = {
        blue: "hover:border-protoss-accent-blue/50",
        gold: "hover:border-protoss-accent-gold/50",
        purple: "hover:border-purple-500/50",
        green: "hover:border-green-500/50",
    };

    const textClasses = {
        blue: "text-protoss-accent-blue",
        gold: "text-protoss-accent-gold",
        purple: "text-purple-400",
        green: "text-green-400",
    };

    return (
        <Link
            href={`/report/${article.id}`}
            className={clsx(
                "block bg-protoss-card border border-protoss-border rounded-xl p-5 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg",
                borderClasses[color]
            )}
        >
            <div className="flex justify-between items-start mb-3">
                <span className={clsx("text-xs font-mono px-2 py-1 rounded bg-slate-800/50 border border-slate-700", textClasses[color])}>
                    {article.id}
                </span>
                <ArrowUpRight className={clsx(
                    "w-4 h-4 opacity-0 -translate-x-2 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0",
                    textClasses[color]
                )} />
            </div>

            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-protoss-text transition-colors">
                {article.title}
            </h3>

            <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">
                {article.coreThesis}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
                {article.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] text-slate-500">#{tag}</span>
                ))}
            </div>
        </Link>
    );
}
