"use client";

import { KeyboardEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { BTC_WEEKLY_SNAPSHOT, BTC_WEEKLY_SNAPSHOT_AT } from "@/data/btcWeeklySnapshot";

/*
 * 바이낸스 BTC/USDT 주봉 캔들 위에 띵까당 게시물의 가격 레벨·목표 구간을 겹친 차트.
 * - 캔들: 브라우저에서 바이낸스 공개 시세 API를 불러오고, 실패하면 저장된 스냅샷을 쓴다.
 * - 레벨·구간: 게시물 수치(2026-11-23 기준)를 정리자가 직접 그린 것. 원작자 차트 이미지가 아니다.
 * - 200주 이평은 같은 주봉 종가로 계산한 곡선(11/15이 속한 주 ≈ 67,983, 원작자 값 67,960).
 * 색: 상승 빨강 / 하락 파랑(국내 관례), 원작자 목표 = 금색, CVDD = 하늘색, 참고 레벨 = 회색.
 */

type Candle = { t: number; o: number; h: number; l: number; c: number }; // t = 주 시작 (ms, UTC 월요일 00:00)

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MA_LEN = 200;
const FETCH_LIMIT = 320;
const kst = (iso: string) => Date.parse(`${iso}T00:00:00+09:00`);

const COLOR = {
    up: "#F87171",
    down: "#60A5FA",
    gold: "#FFD700",
    cyan: "#00F0FF",
    ma: "#E2E8F0",
    ref: "#94A3B8",
    grid: "#1E293B",
    surface: "#0B0F19",
};

const RANGES = [
    { weeks: 13, label: "3개월" },
    { weeks: 26, label: "6개월" },
    { weeks: 52, label: "1년" },
    { weeks: 104, label: "2년" },
] as const;

/* ---------------------------- 겹쳐 그릴 것 ---------------------------- */

type Zone = {
    key: string;
    from: number;
    hi: number;
    lo: number;
    color: string;
    fill: number;
    edge: number;
    long: string;
    short: string;
    muted?: boolean;
};

const ZONES: Zone[] = [
    { key: "z1102", from: kst("2026-11-02"), hi: 71_738, lo: 63_471, color: COLOR.gold, fill: 0.05, edge: 0.35, long: "11/02 목표(이전) 71.7~63.5K", short: "11/02 이전", muted: true },
    { key: "cvdd", from: kst("2026-11-15"), hi: 58_900, lo: 49_100, color: COLOR.cyan, fill: 0.06, edge: 0.9, long: "CVDD 밴드 58.9~49.1K", short: "CVDD" },
    { key: "base", from: kst("2026-11-15"), hi: 53_000, lo: 49_000, color: COLOR.gold, fill: 0.3, edge: 0, long: "기본 시나리오 53~49K", short: "기본 53~49K" },
    { key: "floor", from: kst("2026-11-21"), hi: 49_000, lo: 47_000, color: COLOR.gold, fill: 0.16, edge: 0, long: "마지노선 49~47K", short: "마지노선" },
];

type Level = { key: string; from: number | null; p: number; long: string; short: string };

const LEVELS: Level[] = [
    { key: "junlow", from: kst("2026-06-29"), p: 57_737, long: "6월 저점 57,737", short: "6월 저점" },
    { key: "fib382", from: null, p: 56_625, long: "피보나치 0.382 56,625", short: "피보 0.382" },
    { key: "m236", from: kst("2026-11-15"), p: 47_800, long: "−23.6% 측정 ≈47.8K", short: "−23.6%" },
    { key: "fib5", from: null, p: 44_204, long: "피보나치 0.5 44,204", short: "피보 0.5" },
];

/** 피보나치 타임존: 11/16 주 0.65 진입 → 0.786 ≈ 2027년 5월 전후 */
const TIME_WINDOW_FROM = kst("2026-11-16");

/* ---------------------------- 데이터 ---------------------------- */

const SNAPSHOT: Candle[] = BTC_WEEKLY_SNAPSHOT.map(([s, o, h, l, c]) => ({ t: s * 1000, o, h, l, c }));

async function fetchWeekly(signal: AbortSignal): Promise<Candle[]> {
    const hosts = ["https://data-api.binance.vision", "https://api.binance.com"];
    let lastErr: unknown = new Error("no host");
    for (const host of hosts) {
        try {
            const res = await fetch(`${host}/api/v3/klines?symbol=BTCUSDT&interval=1w&limit=${FETCH_LIMIT}`, { signal, cache: "no-store" });
            if (!res.ok) throw new Error(String(res.status));
            const json: unknown = await res.json();
            if (!Array.isArray(json) || json.length < MA_LEN + RANGES[RANGES.length - 1].weeks) throw new Error("bad payload");
            const out: Candle[] = json.map((r: unknown[]) => ({
                t: Number(r[0]),
                o: Number(r[1]),
                h: Number(r[2]),
                l: Number(r[3]),
                c: Number(r[4]),
            }));
            if (out.some((k) => !Number.isFinite(k.t) || !(k.h > 0) || !(k.l > 0) || !(k.o > 0) || !(k.c > 0))) throw new Error("bad candle");
            return out;
        } catch (e) {
            if (signal.aborted) throw e;
            lastErr = e;
        }
    }
    throw lastErr;
}

/* ---------------------------- 유틸 ---------------------------- */

const fmt = (n: number) => Math.round(n).toLocaleString("en-US");
const fmtK = (n: number) => `${(n / 1000).toFixed(1)}K`;
const mmdd = (t: number) => {
    const d = new Date(t);
    return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}`;
};
const ymd = (t: number) => new Date(t).toISOString().slice(0, 10);

function niceStep(span: number, target = 6) {
    const raw = span / target;
    const steps = [1000, 2000, 2500, 5000, 10_000, 20_000, 25_000, 50_000];
    return steps.find((s) => s >= raw) ?? 50_000;
}

/** 라벨 세로 위치를 최소 간격만큼 밀어낸다 (입력은 위→아래 정렬). */
function spread(ys: number[], gap: number, min: number, max: number) {
    const out = ys.map((v) => Math.min(Math.max(v, min), max));
    for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + gap);
    for (let i = out.length - 1; i >= 0; i--) out[i] = Math.min(out[i], i === out.length - 1 ? max : out[i + 1] - gap);
    return out;
}

/* ---------------------------- 컴포넌트 ---------------------------- */

type Source = { kind: "loading" | "live" | "snapshot"; at: number };

export default function LevelCandleChart() {
    const wrapRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number | null>(null);
    const [candles, setCandles] = useState<Candle[]>(SNAPSHOT);
    const [source, setSource] = useState<Source>({ kind: "loading", at: Date.parse(BTC_WEEKLY_SNAPSHOT_AT) });
    const [weeks, setWeeks] = useState<number | null>(null);
    const [hover, setHover] = useState<number | null>(null);

    // 너비 측정
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const ro = new ResizeObserver((entries) => {
            const w = Math.floor(entries[0].contentRect.width);
            if (w > 0) setWidth(w);
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // 좁은 화면은 3개월, 넓은 화면은 6개월로 시작 (사용자가 고르면 그대로)
    useEffect(() => {
        if (width !== null && weeks === null) setWeeks(width < 480 ? 13 : 26);
    }, [width, weeks]);

    // 실시간 주봉
    useEffect(() => {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        fetchWeekly(ctrl.signal)
            .then((data) => {
                setCandles(data);
                setSource({ kind: "live", at: Date.now() });
            })
            .catch(() => setSource({ kind: "snapshot", at: Date.parse(BTC_WEEKLY_SNAPSHOT_AT) }))
            .finally(() => clearTimeout(timer));
        return () => {
            clearTimeout(timer);
            ctrl.abort();
        };
    }, []);

    const n = weeks ?? 26;
    const narrow = (width ?? 800) < 560;
    const height = narrow ? 380 : 440;

    const model = useMemo(() => {
        if (width === null) return null;
        const pad = { top: 30, bottom: 24, left: narrow ? 36 : 44, right: 4 };
        const labelW = narrow ? 92 : 172;
        const plotH = height - pad.top - pad.bottom;
        const candleAreaW = Math.max(60, width - pad.left - pad.right - labelW);
        const xEnd = pad.left + candleAreaW;
        const xRight = width - pad.right;

        const startIdx = Math.max(0, candles.length - n);
        const shown = candles.slice(startIdx);
        const slotW = candleAreaW / n;
        const t0 = shown[0].t;
        const xOfTime = (t: number) => Math.min(xEnd, Math.max(pad.left, pad.left + ((t - t0) / WEEK_MS) * slotW));
        const cx = (i: number) => pad.left + (i + 0.5) * slotW;

        // 200주 이평 (주봉 종가 단순평균)
        const ma: (number | null)[] = shown.map((_, i) => {
            const end = startIdx + i;
            if (end + 1 < MA_LEN) return null;
            let sum = 0;
            for (let j = end - MA_LEN + 1; j <= end; j++) sum += candles[j].c;
            return sum / MA_LEN;
        });

        // 가격 범위
        let lo = Infinity;
        let hi = -Infinity;
        for (const k of shown) {
            lo = Math.min(lo, k.l);
            hi = Math.max(hi, k.h);
        }
        for (const m of ma) if (m !== null) {
            lo = Math.min(lo, m * 0.7);
            hi = Math.max(hi, m);
        }
        for (const z of ZONES) {
            lo = Math.min(lo, z.lo);
            hi = Math.max(hi, z.hi);
        }
        for (const l of LEVELS) {
            lo = Math.min(lo, l.p);
            hi = Math.max(hi, l.p);
        }
        const padP = (hi - lo) * 0.04;
        const pMin = lo - padP;
        const pMax = hi + padP;
        const y = (p: number) => pad.top + ((pMax - p) / (pMax - pMin)) * plotH;

        const step = niceStep(pMax - pMin);
        const ticks: number[] = [];
        for (let p = Math.ceil(pMin / step) * step; p <= pMax; p += step) ticks.push(p);

        // 월 눈금
        const months: { x: number; text: string }[] = [];
        let lastX = -Infinity;
        shown.forEach((k, i) => {
            const d = new Date(k.t);
            const prev = i > 0 ? new Date(shown[i - 1].t) : null;
            if (prev && prev.getUTCMonth() === d.getUTCMonth()) return;
            if (i === 0) return;
            const x = cx(i);
            if (x - lastX < (narrow ? 34 : 40)) return;
            lastX = x;
            const m = d.getUTCMonth() + 1;
            months.push({ x, text: m === 1 ? `${String(d.getUTCFullYear()).slice(2)}년 1월` : `${m}월` });
        });

        // 오른쪽 라벨
        const lastMa = [...ma].reverse().find((m) => m !== null) ?? null;
        type Lab = { key: string; p: number; text: string; color: string; kind: "zone" | "line" | "curve"; muted?: boolean };
        const labs: Lab[] = [
            ...ZONES.map((z) => ({ key: z.key, p: (z.hi + z.lo) / 2, text: narrow ? z.short : z.long, color: z.color, kind: "zone" as const, muted: z.muted })),
            ...LEVELS.map((l) => ({ key: l.key, p: l.p, text: narrow ? l.short : l.long, color: COLOR.ref, kind: "line" as const })),
        ];
        if (lastMa !== null) {
            labs.push({ key: "ma", p: lastMa, text: narrow ? "200주 이평" : `200주 이평 ${fmtK(lastMa)}`, color: COLOR.ma, kind: "curve" });
            labs.push({ key: "ma70", p: lastMa * 0.7, text: narrow ? "200주 −30%" : `200주 이평 −30% ${fmtK(lastMa * 0.7)}`, color: COLOR.ref, kind: "curve" });
        }
        labs.sort((a, b) => b.p - a.p);
        const labY = spread(
            labs.map((l) => y(l.p)),
            narrow ? 15 : 17,
            pad.top + 8,
            pad.top + plotH - 6
        );

        return { pad, plotH, xEnd, xRight, slotW, shown, startIdx, ma, y, ticks, months, labs, labY, xOfTime, cx, labelW };
    }, [width, candles, n, narrow, height]);

    const onPointer = (e: PointerEvent<SVGSVGElement>) => {
        if (!model) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const i = Math.floor((x - model.pad.left) / model.slotW);
        setHover(i >= 0 && i < model.shown.length ? i : null);
    };

    const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!model) return;
        const last = model.shown.length - 1;
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            setHover((h) => Math.max(0, (h ?? last + 1) - 1));
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            setHover((h) => Math.min(last, (h ?? last - 1) + 1));
        } else if (e.key === "Escape") {
            setHover(null);
        }
    };

    const hov = model && hover !== null ? model.shown[hover] : null;
    const hovMa = model && hover !== null ? model.ma[hover] : null;
    const lastCandle = candles[candles.length - 1];

    return (
        <figure id="fig-levels" className="-mx-4 scroll-mt-6 border-y border-protoss-border bg-protoss-bg/60 px-2 py-3 sm:mx-0 sm:rounded-lg sm:border sm:p-4">
            {/* 기간 선택 + 데이터 상태 */}
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 px-1">
                <div role="radiogroup" aria-label="표시 기간" className="flex gap-1 rounded-md border border-protoss-border bg-protoss-bg p-0.5">
                    {RANGES.map((r) => (
                        <button
                            key={r.weeks}
                            type="button"
                            role="radio"
                            aria-checked={n === r.weeks}
                            onClick={() => {
                                setWeeks(r.weeks);
                                setHover(null);
                            }}
                            className={clsx(
                                "rounded px-2 py-1 font-mono text-[11px] transition-colors",
                                n === r.weeks ? "bg-protoss-accent-blue/15 text-protoss-accent-blue" : "text-slate-400 hover:text-white"
                            )}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
                <div className="font-mono text-[10px] text-slate-500 sm:text-[11px]" aria-live="polite">
                    {source.kind === "loading" && "바이낸스 주봉 불러오는 중…"}
                    {source.kind === "live" && (
                        <>
                            <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" aria-hidden="true" />
                            바이낸스 BTC/USDT 주봉 · 실시간
                        </>
                    )}
                    {source.kind === "snapshot" && `실시간 불러오기 실패 · ${ymd(source.at)} 스냅샷 표시`}
                </div>
            </div>

            {/* 차트 */}
            <div
                ref={wrapRef}
                className="relative outline-none focus-visible:ring-1 focus-visible:ring-protoss-accent-blue/60"
                style={{ height }}
                tabIndex={0}
                onKeyDown={onKey}
                onBlur={() => setHover(null)}
                aria-label="BTC 주봉 캔들과 가격 레벨 차트. 좌우 화살표로 주별 시세를 볼 수 있습니다."
            >
                {model && (
                    <svg
                        width={width ?? 0}
                        height={height}
                        className="block touch-pan-y select-none"
                        onPointerMove={onPointer}
                        onPointerDown={onPointer}
                        onPointerLeave={(e) => e.pointerType === "mouse" && setHover(null)}
                        role="img"
                        aria-label={`바이낸스 BTC/USDT 주봉 ${model.shown.length}주와 원작자 목표 구간(53~49K, 49~47K), CVDD 밴드(58.9~49.1K), 참고 레벨`}
                    >
                        {/* 그리드 + 가격 축 */}
                        {model.ticks.map((p) => (
                            <g key={p}>
                                <line x1={model.pad.left} x2={model.xRight} y1={model.y(p)} y2={model.y(p)} stroke={COLOR.grid} strokeWidth={1} shapeRendering="crispEdges" />
                                <text x={model.pad.left - 6} y={model.y(p)} dy="0.32em" textAnchor="end" className="fill-slate-500 font-mono text-[10px] tabular-nums">
                                    {p >= 1000 ? `${p / 1000}K` : p}
                                </text>
                            </g>
                        ))}

                        {/* 피보나치 타임존 구간 */}
                        <rect
                            x={model.xOfTime(TIME_WINDOW_FROM)}
                            y={model.pad.top}
                            width={model.xRight - model.xOfTime(TIME_WINDOW_FROM)}
                            height={model.plotH}
                            fill={COLOR.gold}
                            fillOpacity={0.045}
                        />
                        <text
                            x={model.xRight - 4}
                            y={model.pad.top - 10}
                            textAnchor="end"
                            className="fill-slate-400 text-[10px]"
                        >
                            {narrow ? "타임존 → 2027.5 전후" : "피보 타임존 0.65 → 0.786 (2027년 5월 전후)"}
                        </text>
                        <line
                            x1={model.xOfTime(TIME_WINDOW_FROM)}
                            x2={model.xOfTime(TIME_WINDOW_FROM)}
                            y1={model.pad.top}
                            y2={model.pad.top + model.plotH}
                            stroke={COLOR.gold}
                            strokeOpacity={0.35}
                            strokeWidth={1}
                            shapeRendering="crispEdges"
                        />

                        {/* 목표·CVDD 구간 */}
                        {ZONES.map((z) => {
                            const x1 = model.xOfTime(z.from);
                            const top = model.y(z.hi);
                            const bottom = model.y(z.lo);
                            return (
                                <g key={z.key}>
                                    <rect x={x1} y={top} width={model.xRight - x1} height={bottom - top} fill={z.color} fillOpacity={z.fill} />
                                    {z.edge > 0 &&
                                        [top, bottom].map((yy) => (
                                            <line
                                                key={yy}
                                                x1={x1}
                                                x2={model.xRight}
                                                y1={yy}
                                                y2={yy}
                                                stroke={z.color}
                                                strokeOpacity={z.edge}
                                                strokeWidth={z.key === "cvdd" ? 1.5 : 1}
                                            />
                                        ))}
                                </g>
                            );
                        })}

                        {/* 참고 레벨 */}
                        {LEVELS.map((l) => {
                            const x1 = l.from === null ? model.pad.left : model.xOfTime(l.from);
                            return (
                                <line
                                    key={l.key}
                                    x1={x1}
                                    x2={model.xRight}
                                    y1={model.y(l.p)}
                                    y2={model.y(l.p)}
                                    stroke={COLOR.ref}
                                    strokeOpacity={0.8}
                                    strokeWidth={1}
                                    shapeRendering="crispEdges"
                                />
                            );
                        })}

                        {/* 200주 이평 / −30% 곡선 */}
                        {[1, 0.7].map((mult) => {
                            const pts = model.ma
                                .map((m, i) => (m === null ? null : `${model.cx(i).toFixed(1)},${model.y(m * mult).toFixed(1)}`))
                                .filter(Boolean);
                            const lastM = [...model.ma].reverse().find((m) => m !== null);
                            if (lastM === undefined || lastM === null) return null;
                            pts.push(`${model.xEnd.toFixed(1)},${model.y(lastM * mult).toFixed(1)}`);
                            return (
                                <polyline
                                    key={mult}
                                    points={pts.join(" ")}
                                    fill="none"
                                    stroke={mult === 1 ? COLOR.ma : COLOR.ref}
                                    strokeOpacity={mult === 1 ? 0.9 : 0.7}
                                    strokeWidth={mult === 1 ? 2 : 1.25}
                                    strokeLinejoin="round"
                                />
                            );
                        })}

                        {/* 캔들 */}
                        {model.shown.map((k, i) => {
                            const up = k.c >= k.o;
                            const color = up ? COLOR.up : COLOR.down;
                            const x = model.cx(i);
                            const bw = Math.max(1, Math.min(14, model.slotW * 0.64));
                            const yo = model.y(k.o);
                            const yc = model.y(k.c);
                            return (
                                <g key={k.t} opacity={hover === null || hover === i ? 1 : 0.55}>
                                    <line x1={x} x2={x} y1={model.y(k.h)} y2={model.y(k.l)} stroke={color} strokeWidth={1} />
                                    <rect x={x - bw / 2} y={Math.min(yo, yc)} width={bw} height={Math.max(1, Math.abs(yo - yc))} fill={color} />
                                </g>
                            );
                        })}

                        {/* 현재가 */}
                        {(() => {
                            const last = model.shown[model.shown.length - 1];
                            const yy = model.y(last.c);
                            return (
                                <g>
                                    <line x1={model.cx(model.shown.length - 1)} x2={model.xEnd + 4} y1={yy} y2={yy} stroke={last.c >= last.o ? COLOR.up : COLOR.down} strokeOpacity={0.6} strokeWidth={1} />
                                </g>
                            );
                        })()}

                        {/* 오른쪽 라벨 */}
                        {model.labs.map((l, i) => {
                            const yTrue = model.y(l.p);
                            const yLab = model.labY[i];
                            const x0 = model.xEnd + 6;
                            return (
                                <g key={l.key}>
                                    {Math.abs(yTrue - yLab) > 1 && (
                                        <line x1={model.xEnd} x2={x0} y1={yTrue} y2={yLab} stroke={COLOR.ref} strokeOpacity={0.6} strokeWidth={1} />
                                    )}
                                    <rect x={x0} y={yLab - 7} width={model.xRight - x0} height={14} rx={2} fill={COLOR.surface} fillOpacity={0.82} />
                                    {l.kind === "zone" ? (
                                        <rect x={x0 + 2} y={yLab - 3.5} width={7} height={7} rx={1.5} fill={l.color} fillOpacity={l.muted ? 0.35 : 0.85} />
                                    ) : (
                                        <line x1={x0 + 1} x2={x0 + 10} y1={yLab} y2={yLab} stroke={l.color} strokeWidth={l.key === "ma" ? 2 : 1.25} />
                                    )}
                                    <text
                                        x={x0 + 14}
                                        y={yLab}
                                        dy="0.33em"
                                        className={clsx("text-[10px] sm:text-[11px]", l.muted ? "fill-slate-500" : "fill-slate-200")}
                                    >
                                        {l.text}
                                    </text>
                                </g>
                            );
                        })}

                        {/* 월 눈금 */}
                        {model.months.map((m) => (
                            <text key={m.x} x={m.x} y={height - 8} textAnchor="middle" className="fill-slate-500 font-mono text-[10px]">
                                {m.text}
                            </text>
                        ))}

                        {/* 호버 십자선 */}
                        {hover !== null && (
                            <line
                                x1={model.cx(hover)}
                                x2={model.cx(hover)}
                                y1={model.pad.top}
                                y2={model.pad.top + model.plotH}
                                stroke="#64748B"
                                strokeWidth={1}
                                shapeRendering="crispEdges"
                                pointerEvents="none"
                            />
                        )}
                    </svg>
                )}

                {/* 툴팁 */}
                {model && hov && hover !== null && (
                    <div
                        className="pointer-events-none absolute top-8 z-10 w-40 rounded-md border border-protoss-border bg-protoss-card/95 p-2 font-mono text-[11px] leading-relaxed text-slate-300 shadow-lg"
                        style={
                            model.cx(hover) > (width ?? 0) / 2
                                ? { left: Math.max(4, model.cx(hover) - 168) }
                                : { left: Math.min((width ?? 0) - 164, model.cx(hover) + 8) }
                        }
                    >
                        <div className="mb-1 text-slate-400">
                            {ymd(hov.t)} 주{hov.t === lastCandle.t && <span className="ml-1 text-amber-300">진행 중</span>}
                        </div>
                        <div className="flex justify-between"><span className="text-slate-500">시가</span>{fmt(hov.o)}</div>
                        <div className="flex justify-between"><span className="text-slate-500">고가</span>{fmt(hov.h)}</div>
                        <div className="flex justify-between"><span className="text-slate-500">저가</span>{fmt(hov.l)}</div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">종가</span>
                            <span className={hov.c >= hov.o ? "text-rose-400" : "text-blue-400"}>
                                {fmt(hov.c)} ({hov.c >= hov.o ? "+" : ""}
                                {(((hov.c - hov.o) / hov.o) * 100).toFixed(1)}%)
                            </span>
                        </div>
                        {hovMa !== null && (
                            <div className="mt-1 flex justify-between border-t border-protoss-border pt-1">
                                <span className="text-slate-500">200주 이평</span>
                                {fmt(hovMa)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <figcaption className="mt-3 space-y-1 break-keep border-t border-protoss-border/60 px-1 pt-2 text-[11px] leading-relaxed text-slate-500">
                <p>
                    <span className="font-mono text-slate-400">그림 1 · BTC 주봉 + 가격 근거 레벨 (USD)</span> — 캔들은 바이낸스 BTC/USDT 주봉(월요일
                    09:00 KST 시작, 빨강 상승·파랑 하락)입니다. 금색 구간·하늘색 밴드·회색 선은 게시물 수치(2026-11-23 기준)를 정리자가 겹쳐
                    그린 것이며, 원작자 차트 이미지가 아닙니다.
                </p>
                <p>
                    흰 곡선은 같은 주봉 종가로 계산한 200주 이평이고 회색 곡선은 그 −30%입니다(11/15이 속한 주 계산값 67,983 — 원작자 값
                    67,960). 이평이 오르면 −30% 선도 따라 올라갑니다. CVDD 밴드는 11/15 값을 고정해 그렸습니다. 캔들에 마우스를 올리거나
                    탭하면 주별 시세가 보입니다.
                </p>
            </figcaption>

            {/* 표 보기 */}
            {model && (
                <details className="mt-2 px-1 text-[11px] text-slate-400">
                    <summary className="cursor-pointer select-none font-mono text-slate-500 hover:text-slate-300">표로 보기 (표시 중인 {model.shown.length}주)</summary>
                    <table className="mt-2 w-full font-mono tabular-nums">
                        <thead>
                            <tr className="border-b border-protoss-border text-left text-slate-500">
                                <th scope="col" className="py-1 pr-2 font-normal">주 시작</th>
                                <th scope="col" className="py-1 pr-2 text-right font-normal">시가</th>
                                <th scope="col" className="py-1 pr-2 text-right font-normal">고가</th>
                                <th scope="col" className="py-1 pr-2 text-right font-normal">저가</th>
                                <th scope="col" className="py-1 text-right font-normal">종가</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...model.shown].reverse().map((k) => (
                                <tr key={k.t} className="border-b border-protoss-border/40">
                                    <td className="py-1 pr-2 text-slate-500">{mmdd(k.t)}</td>
                                    <td className="py-1 pr-2 text-right">{fmt(k.o)}</td>
                                    <td className="py-1 pr-2 text-right">{fmt(k.h)}</td>
                                    <td className="py-1 pr-2 text-right">{fmt(k.l)}</td>
                                    <td className={clsx("py-1 text-right", k.c >= k.o ? "text-rose-400" : "text-blue-400")}>{fmt(k.c)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </details>
            )}
        </figure>
    );
}
