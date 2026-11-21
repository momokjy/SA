"use client";

import { useMemo, useState } from "react";
import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { CalcResult } from "@/lib/btcReentry";
import { valuesAt } from "@/lib/btcReentry";
import { Currency, fmtCompact, fmtMoney, fmtPct, fmtSignedMoney } from "./format";

// 다크 카드 표면(#121726) 기준 검증된 2색 (validate_palette: 전 항목 PASS)
export const SERIES = {
    hold: { color: "#3987e5", label: "보유 유지" },
    switch: { color: "#c98500", label: "정리 후 재진입" },
} as const;

const INK_SECONDARY = "#94a3b8";
const INK_MUTED = "#64748b";
const GRID = "#1E293B";
const AXIS = "#334155";
const SURFACE = "#121726";

interface Point {
    price: number;
    hold: number;
    switch: number;
}

function niceStep(range: number, count: number): number {
    const rough = range / Math.max(1, count);
    const mag = 10 ** Math.floor(Math.log10(rough));
    const norm = rough / mag;
    const step = norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10;
    return step * mag;
}

function niceDomain(lo: number, hi: number, count: number): { domain: [number, number]; ticks: number[] } {
    if (!(hi > lo)) hi = lo + Math.max(1, Math.abs(lo) * 0.1);
    const step = niceStep(hi - lo, count);
    const start = Math.floor(lo / step) * step;
    const end = Math.ceil(hi / step) * step;
    const ticks: number[] = [];
    for (let v = start; v <= end + step * 1e-6; v += step) ticks.push(Number(v.toPrecision(12)));
    return { domain: [start, end], ticks };
}

/** 차트 가로축 범위: 진입가·정리가·재진입가(+교차 가격)를 포함 */
function priceRange(r: CalcResult): { lo: number; hi: number } {
    const { entryPrice: P0, exitPrice: P1, reentryPrice: P2 } = r.input;
    let lo = Math.min(P0, P1, P2) * 0.85;
    let hi = Math.max(P0, P1, P2) * 1.15;
    const cross = r.crossover?.price;
    if (cross && cross > P2 * 0.4 && cross < P2 * 2.5) {
        lo = Math.min(lo, cross * 0.95);
        hi = Math.max(hi, cross * 1.05);
    }
    return { lo, hi };
}

function buildData(r: CalcResult, lo: number, hi: number): Point[] {
    const { entryPrice: P0, reentryPrice: P2 } = r.input;
    const cross = r.crossover?.price;
    const prices = new Set<number>();
    const N = 160;
    for (let i = 0; i <= N; i++) prices.add(lo + ((hi - lo) * i) / N);
    const keys = [P0, P2, cross, r.originalLiq, r.mergedLiq];
    for (const k of keys) {
        if (k && k > lo && k < hi) {
            prices.add(k);
            prices.add(k * (1 - 1e-6));
            prices.add(k * (1 + 1e-6));
        }
    }
    return Array.from(prices)
        .filter((p) => p > 0)
        .sort((a, b) => a - b)
        .map((price) => ({ price, ...valuesAt(r, price) }));
}

function ChartTooltip({
    active,
    payload,
    currency,
    reentryPrice,
}: {
    active?: boolean;
    payload?: { payload: Point }[];
    currency: Currency;
    reentryPrice: number;
}) {
    if (!active || !payload?.length) return null;
    const p = payload[0].payload;
    const diff = p.switch - p.hold;
    return (
        <div className="rounded-lg border border-protoss-border bg-[#0B0F19]/95 px-3 py-2 font-mono text-xs shadow-xl">
            <div className="mb-1.5 text-slate-400">
                BTC {fmtMoney(p.price, currency)}{" "}
                <span className="text-slate-500">(재진입가 대비 {fmtPct(p.price / reentryPrice - 1, 1)})</span>
            </div>
            {(["switch", "hold"] as const).map((k) => (
                <div key={k} className="flex items-center gap-2 py-0.5">
                    <span className="inline-block h-0.5 w-3 rounded" style={{ background: SERIES[k].color }} />
                    <span className="font-bold text-white tabular-nums">{fmtMoney(p[k], currency)}</span>
                    <span className="text-slate-500">{SERIES[k].label}</span>
                </div>
            ))}
            <div className="mt-1.5 border-t border-protoss-border pt-1.5 text-slate-300">
                차이 <span className="font-bold tabular-nums">{fmtSignedMoney(diff, currency)}</span>
            </div>
        </div>
    );
}

export default function ValueChart({ r, currency }: { r: CalcResult; currency: Currency }) {
    const [showTable, setShowTable] = useState(false);
    const P2 = r.input.reentryPrice;
    const x = useMemo(() => {
        const { lo, hi } = priceRange(r);
        return niceDomain(lo, hi, 6);
    }, [r]);
    const data = useMemo(() => buildData(r, x.domain[0], x.domain[1]), [r, x]);
    const y = useMemo(() => {
        const vals = data.flatMap((d) => [d.hold, d.switch]).concat(r.marginBefore);
        const max = Math.max(...vals);
        const min = Math.min(...vals);
        const lower = min < max * 0.4 ? 0 : min * 0.95;
        return niceDomain(lower, max * 1.04, 5);
    }, [data, r.marginBefore]);

    // 오른쪽 끝 직접 라벨: 두 선이 충분히 떨어져 있을 때만 (겹치면 범례·툴팁이 담당)
    const last = data[data.length - 1];
    const yRange = y.domain[1] - y.domain[0];
    const showEndLabels = last && Math.abs(last.hold - last.switch) / yRange > 0.08;

    const endLabel = (key: "hold" | "switch") =>
        function EndLabel(props: { x?: number; y?: number; index?: number }) {
            if (!showEndLabels || props.index !== data.length - 1 || props.x === undefined || props.y === undefined)
                return <g />;
            return (
                <g>
                    <line x1={props.x + 6} x2={props.x + 14} y1={props.y} y2={props.y} stroke={SERIES[key].color} strokeWidth={2} />
                    <text x={props.x + 18} y={props.y} dy="0.35em" fill={INK_SECONDARY} fontSize={11} fontFamily="var(--font-jetbrains-mono), monospace">
                        {key === "hold" ? "보유" : "재진입"}
                    </text>
                </g>
            );
        };

    const crossInView = r.crossover && r.crossover.price > x.domain[0] && r.crossover.price < x.domain[1];

    const tablePrices = useMemo(() => {
        const steps = [-0.3, -0.2, -0.1, -0.05, 0, 0.05, 0.1, 0.2, 0.3];
        const ps = steps.map((s) => P2 * (1 + s));
        if (r.crossover) ps.push(r.crossover.price);
        return ps.filter((p) => p > 0).sort((a, b) => a - b);
    }, [P2, r.crossover]);

    return (
        <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-slate-300" aria-label="범례">
                    {(["switch", "hold"] as const).map((k) => (
                        <span key={k} className="flex items-center gap-2">
                            <span className="inline-block h-0.5 w-4 rounded" style={{ background: SERIES[k].color }} />
                            {SERIES[k].label}
                        </span>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={() => setShowTable((v) => !v)}
                    className="rounded border border-protoss-border px-2.5 py-1 font-mono text-[11px] text-slate-400 transition-colors hover:border-protoss-accent-blue/60 hover:text-protoss-accent-blue"
                    aria-pressed={showTable}
                >
                    {showTable ? "차트로 보기" : "표로 보기"}
                </button>
            </div>

            {showTable ? (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[460px] font-mono text-xs tabular-nums">
                        <thead>
                            <tr className="border-b border-protoss-border text-left text-slate-500">
                                <th className="py-2 pr-3 font-normal">이후 BTC 가격</th>
                                <th className="py-2 pr-3 text-right font-normal">보유 유지</th>
                                <th className="py-2 pr-3 text-right font-normal">정리 후 재진입</th>
                                <th className="py-2 text-right font-normal">차이</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tablePrices.map((p) => {
                                const v = valuesAt(r, p);
                                const isCross = r.crossover && p === r.crossover.price;
                                return (
                                    <tr key={p} className="border-b border-protoss-border/60 text-slate-300">
                                        <td className="py-1.5 pr-3">
                                            {fmtMoney(p, currency)}{" "}
                                            <span className="text-slate-500">
                                                {isCross ? "역전" : fmtPct(p / P2 - 1, 0)}
                                            </span>
                                        </td>
                                        <td className="py-1.5 pr-3 text-right">{fmtMoney(v.hold, currency)}</td>
                                        <td className="py-1.5 pr-3 text-right">{fmtMoney(v.switch, currency)}</td>
                                        <td className="py-1.5 text-right text-white">{fmtSignedMoney(v.switch - v.hold, currency)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 22, right: showEndLabels ? 64 : 16, bottom: 4, left: 4 }}>
                            <CartesianGrid stroke={GRID} vertical={false} />
                            <XAxis
                                dataKey="price"
                                type="number"
                                domain={x.domain}
                                ticks={x.ticks}
                                allowDataOverflow
                                tickFormatter={(v: number) => fmtCompact(v, currency)}
                                stroke={AXIS}
                                tick={{ fill: INK_MUTED, fontSize: 11, fontFamily: "var(--font-jetbrains-mono)" }}
                                tickLine={false}
                            />
                            <YAxis
                                domain={y.domain}
                                ticks={y.ticks}
                                allowDataOverflow
                                tickFormatter={(v: number) => fmtCompact(v, currency)}
                                stroke={AXIS}
                                tick={{ fill: INK_MUTED, fontSize: 11, fontFamily: "var(--font-jetbrains-mono)" }}
                                tickLine={false}
                                axisLine={false}
                                width={currency === "KRW" ? 60 : 52}
                            />
                            <Tooltip
                                cursor={{ stroke: "#475569", strokeWidth: 1 }}
                                isAnimationActive={false}
                                content={<ChartTooltip currency={currency} reentryPrice={P2} />}
                            />
                            <ReferenceLine
                                y={r.marginBefore}
                                stroke={AXIS}
                                label={{ value: "초기 원금", position: "insideTopLeft", fill: INK_MUTED, fontSize: 10 }}
                            />
                            <ReferenceLine
                                x={P2}
                                stroke="#475569"
                                label={{ value: "재진입가", position: "top", fill: INK_SECONDARY, fontSize: 10 }}
                            />
                            {crossInView && (
                                <ReferenceLine
                                    x={r.crossover!.price}
                                    stroke="#475569"
                                    label={{ value: "역전", position: "insideTopRight", fill: INK_SECONDARY, fontSize: 10 }}
                                />
                            )}
                            <Line
                                type="linear"
                                dataKey="hold"
                                name={SERIES.hold.label}
                                stroke={SERIES.hold.color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, stroke: SURFACE, strokeWidth: 2 }}
                                isAnimationActive={false}
                                label={endLabel("hold")}
                            />
                            <Line
                                type="linear"
                                dataKey="switch"
                                name={SERIES.switch.label}
                                stroke={SERIES.switch.color}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, stroke: SURFACE, strokeWidth: 2 }}
                                isAnimationActive={false}
                                label={endLabel("switch")}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
