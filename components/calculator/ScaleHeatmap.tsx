"use client";

import { useMemo, useState } from "react";
import { clsx } from "clsx";
import type { CalcInput, HeatMetric } from "@/lib/btcReentry";
import { heatGrid } from "@/lib/btcReentry";
import { Currency, fmtMoney, fmtPct } from "./format";

// 국내 관례: 빨강 = 증가·유리, 파랑 = 감소·불리. 중앙(0)은 무채색.
const POS_RGB = "230,103,103";
const NEG_RGB = "57,135,229";

const ROES = [-0.5, -0.3, -0.2, -0.1, -0.05, 0, 0.05, 0.1, 0.2, 0.3, 0.5];
const MOVE_SETS: Record<string, number[]> = {
    "5": [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
    "10": [-10, -7.5, -5, -3, -1, 0, 1, 3, 5, 7.5, 10],
    "20": [-20, -15, -10, -5, -2, 0, 2, 5, 10, 15, 20],
    "40": [-40, -30, -20, -10, -5, 0, 5, 10, 20, 30, 40],
};

function withCurrent(list: number[], current: number): { values: number[]; currentIndex: number } {
    const eps = 1e-6;
    let values = list;
    if (!list.some((v) => Math.abs(v - current) < eps)) values = [...list, current].sort((a, b) => a - b);
    return { values, currentIndex: values.findIndex((v) => Math.abs(v - current) < eps) };
}

function cellBg(v: number | null, maxAbs: number): string | undefined {
    if (v === null) return undefined;
    if (Math.abs(v) < 0.0005) return "rgba(148,163,184,0.08)";
    const a = Math.min(1, Math.abs(v) / maxAbs);
    return `rgba(${v > 0 ? POS_RGB : NEG_RGB},${(0.1 + 0.5 * a).toFixed(3)})`;
}

export default function ScaleHeatmap({
    base,
    currentRoe,
    currentMove,
    currency,
}: {
    base: CalcInput;
    currentRoe: number;
    currentMove: number;
    currency: Currency;
}) {
    const [metric, setMetric] = useState<HeatMetric>("qty");
    const [range, setRange] = useState<keyof typeof MOVE_SETS>("20");

    const rows = useMemo(() => withCurrent(ROES, currentRoe), [currentRoe]);
    const cols = useMemo(
        () => withCurrent(MOVE_SETS[range].map((m) => m / 100), currentMove),
        [range, currentMove]
    );
    const grid = useMemo(() => heatGrid(base, rows.values, cols.values, metric), [base, rows, cols, metric]);
    const maxAbs = useMemo(() => {
        const vals = grid.flat().map((c) => (c.value === null ? 0 : Math.abs(c.value)));
        return Math.max(0.02, ...vals);
    }, [grid]);

    const isFlatAcrossRows = useMemo(() => {
        if (metric !== "qty" || grid.length < 2) return false;
        return cols.values.every((_, j) => {
            const col = grid.map((row) => row[j].value).filter((v): v is number => v !== null);
            return col.length > 1 && Math.max(...col) - Math.min(...col) < 1e-9;
        });
    }, [grid, cols, metric]);

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
                <div role="radiogroup" aria-label="표시 지표" className="flex rounded-md border border-protoss-border bg-protoss-bg p-0.5">
                    {(
                        [
                            ["qty", "BTC 수량 변화"],
                            ["value", "보유 대비 평가금"],
                        ] as const
                    ).map(([k, label]) => (
                        <button
                            key={k}
                            type="button"
                            role="radio"
                            aria-checked={metric === k}
                            onClick={() => setMetric(k)}
                            className={clsx(
                                "whitespace-nowrap rounded px-2.5 py-1 font-mono text-[11px] transition-colors",
                                metric === k ? "bg-protoss-accent-blue/15 text-protoss-accent-blue" : "text-slate-400 hover:text-white"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div role="radiogroup" aria-label="가격 변동 범위" className="flex rounded-md border border-protoss-border bg-protoss-bg p-0.5">
                    {Object.keys(MOVE_SETS).map((k) => (
                        <button
                            key={k}
                            type="button"
                            role="radio"
                            aria-checked={range === k}
                            onClick={() => setRange(k)}
                            className={clsx(
                                "whitespace-nowrap rounded px-2.5 py-1 font-mono text-[11px] transition-colors",
                                range === k ? "bg-protoss-accent-blue/15 text-protoss-accent-blue" : "text-slate-400 hover:text-white"
                            )}
                        >
                            ±{k}%
                        </button>
                    ))}
                </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-protoss-border">
                <table className="w-full min-w-[720px] border-collapse font-mono text-[11px] tabular-nums">
                    <thead>
                        <tr>
                            <th className="sticky left-0 z-10 bg-protoss-card px-2 py-2 text-left font-normal text-slate-500">
                                ROE ↓ / 변동 →
                            </th>
                            {cols.values.map((m, j) => (
                                <th
                                    key={m}
                                    scope="col"
                                    className={clsx(
                                        "px-1 py-2 text-center font-normal",
                                        j === cols.currentIndex ? "text-protoss-accent-blue" : "text-slate-500"
                                    )}
                                >
                                    {fmtPct(m, Math.abs(m * 100) % 1 ? 1 : 0)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {grid.map((row, i) => (
                            <tr key={rows.values[i]}>
                                <th
                                    scope="row"
                                    className={clsx(
                                        "sticky left-0 z-10 bg-protoss-card px-2 py-1 text-left font-normal",
                                        i === rows.currentIndex ? "text-protoss-accent-blue" : "text-slate-500"
                                    )}
                                >
                                    {fmtPct(rows.values[i], Math.abs(rows.values[i] * 100) % 1 ? 1 : 0)}
                                    {i === rows.currentIndex && <span className="ml-1 text-[10px]">현재</span>}
                                </th>
                                {row.map((cell, j) => {
                                    const current = i === rows.currentIndex && j === cols.currentIndex;
                                    const tip = cell.value === null
                                        ? `ROE ${fmtPct(cell.roe, 1)}: 정리 시점에 이미 청산`
                                        : `ROE ${fmtPct(cell.roe, 1)} (정리가 ${fmtMoney(cell.exitPrice, currency)}) → 변동 ${fmtPct(cell.move, 1)} (재진입가 ${fmtMoney(cell.reentryPrice, currency)}): ${metric === "qty" ? "BTC 수량" : "보유 대비 평가금"} ${fmtPct(cell.value, 2)}`;
                                    return (
                                        <td
                                            key={cell.move}
                                            title={tip}
                                            aria-label={tip}
                                            style={{ background: cellBg(cell.value, maxAbs) }}
                                            className={clsx(
                                                "border border-protoss-card px-1 py-1.5 text-center transition-[filter] hover:brightness-125",
                                                cell.value === null ? "text-slate-600" : "text-slate-100",
                                                current && "outline outline-2 -outline-offset-2 outline-protoss-accent-blue font-bold"
                                            )}
                                        >
                                            {cell.value === null ? "청산" : fmtPct(cell.value, 1)}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                    <span>감소·불리</span>
                    <span
                        className="h-2 w-28 rounded-full"
                        style={{
                            background: `linear-gradient(90deg, rgba(${NEG_RGB},0.6), rgba(148,163,184,0.15), rgba(${POS_RGB},0.6))`,
                        }}
                        aria-hidden
                    />
                    <span>증가·유리</span>
                </div>
                <span>행: 정리 시점 ROE · 열: 정리가 대비 재진입가 변동 · 값: {metric === "qty" ? "BTC 수량 변화" : "보유 대비 평가금 ÷ 초기 원금"} · 테두리: 현재 입력값</span>
            </div>
            {isFlatAcrossRows && (
                <p className="mt-3 rounded-md border border-protoss-border bg-protoss-bg/60 p-3 text-xs leading-relaxed text-slate-400">
                    레버리지 1배·세금 0% 조건에서는 모든 행이 같습니다. 현물은 손익률과 관계없이{" "}
                    <strong className="text-slate-200">정리가 대비 재진입가 변동</strong>만이 BTC 수량 변화를 결정합니다
                    (수량 비율 ≈ 정리가 ÷ 재진입가 − 수수료). 레버리지나 세금을 넣으면 행마다 달라집니다.
                </p>
            )}
        </div>
    );
}
