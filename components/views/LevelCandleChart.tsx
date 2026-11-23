"use client";

import { KeyboardEvent, PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { clsx } from "clsx";
import { BTC_WEEKLY_SNAPSHOT, BTC_WEEKLY_SNAPSHOT_AT } from "@/data/btcWeeklySnapshot";

/*
 * 바이낸스 BTC/USDT 주봉 캔들 위에 띵까당 게시물의 가격 레벨·목표 구간을 겹친 차트.
 * - 캔들: 브라우저에서 바이낸스 공개 시세 API를 불러오고, 실패하면 저장된 스냅샷을 쓴다.
 * - 레벨·구간: 게시물 수치(2026-11-23 기준)를 정리자가 직접 그린 것. 원작자 차트 이미지가 아니다.
 * - 200주 이평은 같은 주봉 종가로 계산한 곡선(11/15이 속한 주 ≈ 67,983, 원작자 값 67,960).
 * - 마지막 캔들 오른쪽에 미래 구간을 비워 두고, 구간 이름은 구간 안에, 레벨 이름은 가격 축 옆에 쓴다.
 *   좁은 화면에서는 번호 배지만 차트에 두고 이름·값은 아래 범례에 둔다.
 * 색: 상승 빨강 / 하락 파랑(국내 관례), 원작자 목표 = 금색, CVDD = 하늘색, 참고 레벨 = 회색.
 */

type Candle = { t: number; o: number; h: number; l: number; c: number }; // t = 주 시작 (ms, UTC 월요일 00:00)

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MA_LEN = 200;
const FETCH_LIMIT = 320;
const COMPACT_BELOW = 640;
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
    no: number;
    from: number;
    hi: number;
    lo: number;
    /** 구간 안에서 이름을 쓸 가격 위치 (다른 선·구간과 덜 겹치는 곳) */
    labelAt: number;
    color: string;
    fill: number;
    edge: number;
    name: string;
    range: string;
    note: string;
    muted?: boolean;
};

const ZONES: Zone[] = [
    { key: "base", no: 1, from: kst("2026-11-15"), hi: 53_000, lo: 49_000, labelAt: 51_000, color: COLOR.gold, fill: 0.3, edge: 0, name: "기본 시나리오", range: "53~49K", note: "11/15 계획 수정부터" },
    { key: "floor", no: 2, from: kst("2026-11-21"), hi: 49_000, lo: 47_000, labelAt: 48_350, color: COLOR.gold, fill: 0.16, edge: 0, name: "마지노선", range: "49~47K", note: "11/21부터" },
    { key: "cvdd", no: 3, from: kst("2026-11-15"), hi: 58_900, lo: 49_100, labelAt: 54_800, color: COLOR.cyan, fill: 0.06, edge: 0.9, name: "CVDD 밴드", range: "58.9~49.1K", note: "11/15 차트 값으로 고정" },
    { key: "z1102", no: 4, from: kst("2026-11-02"), hi: 71_738, lo: 63_471, labelAt: 70_400, color: COLOR.gold, fill: 0.05, edge: 0.35, name: "11/02 목표(이전)", range: "71.7~63.5K", note: "11/14에 하향", muted: true },
];

type Level = { key: string; no: number; from: number | null; p: number; name: string; value: string; note: string };

const LEVELS: Level[] = [
    { key: "junlow", no: 7, from: kst("2026-06-29"), p: 57_737, name: "6월 저점", value: "57,737", note: "11/15 차트" },
    { key: "fib382", no: 8, from: null, p: 56_625, name: "피보나치 0.382", value: "56,625", note: "11/15 차트" },
    { key: "m236", no: 9, from: kst("2026-11-15"), p: 47_800, name: "−23.6% 측정", value: "≈47.8K", note: "11/15 차트" },
    { key: "fib5", no: 10, from: null, p: 44_204, name: "피보나치 0.5", value: "44,204", note: "11/15 차트 · 다음 지지" },
];

const MA_NO = 5;
const MA70_NO = 6;

/** 피보나치 타임존: 11/16 주 0.65 진입 → 0.786 ≈ 2027년 5월 전후 */
const TW_FROM = kst("2026-11-16");
const TW_TO = kst("2027-05-15");

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
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function niceStep(span: number, target: number) {
    const raw = span / target;
    const steps = [1000, 2000, 2500, 5000, 10_000, 20_000, 25_000, 50_000];
    return steps.find((s) => s >= raw) ?? 50_000;
}

/** 라벨 세로 위치를 최소 간격만큼 밀어낸다 (입력은 위→아래 정렬). */
function spread(ys: number[], gap: number, min: number, max: number) {
    const out = ys.map((v) => clamp(v, min, max));
    for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + gap);
    for (let i = out.length - 1; i >= 0; i--) out[i] = Math.min(out[i], i === out.length - 1 ? max : out[i + 1] - gap);
    return out;
}

/** 배경 위에서도 읽히도록 글자 둘레에 표면색 테두리를 두른다. */
const HALO = { stroke: COLOR.surface, strokeWidth: 4, strokeLinejoin: "round" as const, paintOrder: "stroke" };

function NumBadge({ x, y, no, color }: { x: number; y: number; no: number; color: string }) {
    return (
        <g>
            <circle cx={x} cy={y} r={8} fill={COLOR.surface} stroke={color} strokeWidth={1.5} />
            <text x={x} y={y} dy="0.35em" textAnchor="middle" className="fill-slate-100 font-mono text-[9px] font-bold">
                {no}
            </text>
        </g>
    );
}

/* ---------------------------- 컴포넌트 ---------------------------- */

type Source = { kind: "loading" | "live" | "snapshot"; at: number };

type LineLabel = { key: string; no: number; p: number; text: string; color: string; thick?: boolean };

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
    const compact = (width ?? 1000) < COMPACT_BELOW;
    const height = width === null ? 480 : compact ? 420 : Math.round(clamp(width * 0.42, 460, 680));

    const model = useMemo(() => {
        if (width === null) return null;
        const axisW = compact ? 46 : 66;
        const pad = { top: 38, bottom: 28, left: 4 };
        const plotLeft = pad.left;
        const plotRight = width - axisW;
        const plotW = plotRight - plotLeft;
        const plotH = height - pad.top - pad.bottom;
        const futureW = compact ? Math.round(plotW * 0.3) : Math.round(clamp(plotW * 0.36, 340, 640));
        const candleW = plotW - futureW;
        const xEnd = plotLeft + candleW;

        const startIdx = Math.max(0, candles.length - n);
        const shown = candles.slice(startIdx);
        const slotW = candleW / n;
        const t0 = shown[0].t;
        const xRaw = (t: number) => plotLeft + ((t - t0) / WEEK_MS) * slotW;
        const xOfTime = (t: number) => clamp(xRaw(t), plotLeft, plotRight);
        const cx = (i: number) => plotLeft + (i + 0.5) * slotW;
        const tRight = t0 + (plotW / slotW) * WEEK_MS;

        // 200주 이평 (주봉 종가 단순평균)
        const ma: (number | null)[] = shown.map((_, i) => {
            const end = startIdx + i;
            if (end + 1 < MA_LEN) return null;
            let sum = 0;
            for (let j = end - MA_LEN + 1; j <= end; j++) sum += candles[j].c;
            return sum / MA_LEN;
        });
        const lastMa = [...ma].reverse().find((m): m is number => m !== null) ?? null;

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
        for (const l of LEVELS) lo = Math.min(lo, l.p);
        const padP = (hi - lo) * 0.05;
        const pMin = lo - padP;
        const pMax = hi + padP;
        const y = (p: number) => pad.top + ((pMax - p) / (pMax - pMin)) * plotH;

        const step = niceStep(pMax - pMin, compact ? 5 : 8);
        const ticks: number[] = [];
        for (let p = Math.ceil(pMin / step) * step; p <= pMax; p += step) ticks.push(p);

        // 월 눈금 (미래 구간 포함)
        const months: { x: number; text: string; future: boolean }[] = [];
        {
            const d0 = new Date(t0);
            let yy = d0.getUTCFullYear();
            let mm = d0.getUTCMonth() + 1;
            let lastX = -Infinity;
            for (let guard = 0; guard < 60; guard++) {
                if (mm > 11) {
                    mm = 0;
                    yy += 1;
                }
                const t = Date.UTC(yy, mm, 1);
                if (t > tRight) break;
                const x = xRaw(t);
                if (x > plotLeft + 12 && x < plotRight - 12 && x - lastX >= (compact ? 34 : 46)) {
                    months.push({ x, text: mm === 0 ? `${String(yy).slice(2)}년 1월` : `${mm + 1}월`, future: x > xEnd });
                    lastX = x;
                }
                mm += 1;
            }
        }

        // 레벨·곡선 라벨 (가격 축 옆 한 줄)
        const lineLabels: LineLabel[] = LEVELS.map((l) => ({
            key: l.key,
            no: l.no,
            p: l.p,
            text: `${l.name} ${l.value}`,
            color: COLOR.ref,
        }));
        if (lastMa !== null) {
            lineLabels.push({ key: "ma", no: MA_NO, p: lastMa, text: `200주 이평 ${fmtK(lastMa)}`, color: COLOR.ma, thick: true });
            lineLabels.push({ key: "ma70", no: MA70_NO, p: lastMa * 0.7, text: `200주 이평 −30% ${fmtK(lastMa * 0.7)}`, color: COLOR.ref });
        }
        lineLabels.sort((a, b) => b.p - a.p);
        const gap = compact ? 18 : 20;
        const lineLabelY = spread(
            lineLabels.map((l) => y(l.p) - (compact ? 0 : 7)),
            gap,
            pad.top + 10,
            pad.top + plotH - 8
        );

        // 타임존 구간
        const tw = {
            x0: xOfTime(TW_FROM),
            x1: xOfTime(TW_TO),
            endVisible: xRaw(TW_TO) <= plotRight,
        };

        return { pad, plotLeft, plotRight, plotW, plotH, xEnd, slotW, shown, ma, lastMa, y, ticks, months, lineLabels, lineLabelY, xOfTime, cx, tw, axisW };
    }, [width, candles, n, compact, height]);

    const onPointer = (e: PointerEvent<SVGSVGElement>) => {
        if (!model) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const i = Math.floor((x - model.plotLeft) / model.slotW);
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

    /* ---------------------------- 범례 ---------------------------- */
    const legend: { no: number; swatch: "zone" | "line" | "curve"; color: string; opacity?: number; name: string; value: string; note: string }[] = [
        ...ZONES.map((z) => ({ no: z.no, swatch: "zone" as const, color: z.color, opacity: z.muted ? 0.35 : z.key === "cvdd" ? 0.6 : 0.85, name: z.name, value: z.range, note: z.note })),
        {
            no: MA_NO,
            swatch: "curve" as const,
            color: COLOR.ma,
            name: "200주 이평",
            value: model?.lastMa ? fmtK(model.lastMa) : "—",
            note: "바이낸스 주봉 종가로 계산, 최신 주 · 11/15 주 67,983",
        },
        {
            no: MA70_NO,
            swatch: "curve" as const,
            color: COLOR.ref,
            name: "200주 이평 −30%",
            value: model?.lastMa ? fmtK(model.lastMa * 0.7) : "—",
            note: "이평 × 0.7 · 원작자 11/15 값 ≈47.6K",
        },
        ...LEVELS.map((l) => ({ no: l.no, swatch: "line" as const, color: COLOR.ref, name: l.name, value: l.value, note: l.note })),
    ];

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
                                "rounded px-2.5 py-1 font-mono text-xs transition-colors",
                                n === r.weeks ? "bg-protoss-accent-blue/15 text-protoss-accent-blue" : "text-slate-400 hover:text-white"
                            )}
                        >
                            {r.label}
                        </button>
                    ))}
                </div>
                <div className="font-mono text-[11px] text-slate-500 sm:text-xs" aria-live="polite">
                    {source.kind === "loading" && "바이낸스 주봉 불러오는 중…"}
                    {source.kind === "live" && (
                        <>
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 align-middle" aria-hidden="true" />
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
                        <defs>
                            <linearGradient id="tw-fade" x1="0" x2="1" y1="0" y2="0">
                                <stop offset="0" stopColor={COLOR.gold} stopOpacity={0.07} />
                                <stop offset="0.8" stopColor={COLOR.gold} stopOpacity={0.07} />
                                <stop offset="1" stopColor={COLOR.gold} stopOpacity={model.tw.endVisible ? 0.02 : 0.07} />
                            </linearGradient>
                        </defs>

                        {/* 미래 구간 바탕 */}
                        <rect x={model.xEnd} y={model.pad.top} width={model.plotRight - model.xEnd} height={model.plotH} fill="#ffffff" fillOpacity={0.015} />

                        {/* 그리드 + 가격 축(오른쪽) */}
                        {model.ticks.map((p) => (
                            <g key={p}>
                                <line x1={model.plotLeft} x2={model.plotRight} y1={model.y(p)} y2={model.y(p)} stroke={COLOR.grid} strokeWidth={1} shapeRendering="crispEdges" />
                                <text
                                    x={model.plotRight + 8}
                                    y={model.y(p)}
                                    dy="0.32em"
                                    className={clsx("fill-slate-500 font-mono tabular-nums", compact ? "text-[10px]" : "text-[11px]")}
                                >
                                    {`${p / 1000}K`}
                                </text>
                            </g>
                        ))}
                        <line x1={model.plotRight} x2={model.plotRight} y1={model.pad.top} y2={model.pad.top + model.plotH} stroke="#334155" strokeWidth={1} shapeRendering="crispEdges" />

                        {/* 피보나치 타임존 구간 */}
                        <rect x={model.tw.x0} y={model.pad.top} width={Math.max(0, model.tw.x1 - model.tw.x0)} height={model.plotH} fill="url(#tw-fade)" />
                        <line x1={model.tw.x0} x2={model.tw.x0} y1={model.pad.top - 6} y2={model.pad.top + model.plotH} stroke={COLOR.gold} strokeOpacity={0.45} strokeWidth={1} shapeRendering="crispEdges" />
                        {model.tw.endVisible && (
                            <line x1={model.tw.x1} x2={model.tw.x1} y1={model.pad.top - 6} y2={model.pad.top + model.plotH} stroke={COLOR.gold} strokeOpacity={0.45} strokeWidth={1} shapeRendering="crispEdges" />
                        )}
                        {compact ? (
                            <text x={model.plotRight - 2} y={model.pad.top - 12} textAnchor="end" className="fill-slate-400 text-[10px]">
                                타임존 0.65 → 0.786 (27년 5월 전후{model.tw.endVisible ? "" : " →"})
                            </text>
                        ) : model.tw.endVisible && model.tw.x1 - model.tw.x0 > 360 ? (
                            <>
                                <text x={model.tw.x0 + 6} y={model.pad.top - 12} className="fill-slate-300 text-[12px]">
                                    피보나치 타임존 0.65 (11/16 주)
                                </text>
                                <text x={model.tw.x1 - 6} y={model.pad.top - 12} textAnchor="end" className="fill-slate-300 text-[12px]">
                                    0.786 · 2027년 5월 전후
                                </text>
                            </>
                        ) : (
                            <text x={model.plotRight - 4} y={model.pad.top - 12} textAnchor="end" className="fill-slate-300 text-[12px]">
                                피보나치 타임존 0.65 (11/16 주) → 0.786 (2027년 5월 전후{model.tw.endVisible ? "" : " →"})
                            </text>
                        )}

                        {/* 목표·CVDD 구간 */}
                        {ZONES.map((z) => {
                            const x1 = model.xOfTime(z.from);
                            const top = model.y(z.hi);
                            const bottom = model.y(z.lo);
                            return (
                                <g key={z.key}>
                                    <rect x={x1} y={top} width={model.plotRight - x1} height={bottom - top} fill={z.color} fillOpacity={z.fill} />
                                    {z.edge > 0 &&
                                        [top, bottom].map((yy) => (
                                            <line
                                                key={yy}
                                                x1={x1}
                                                x2={model.plotRight}
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
                        {LEVELS.map((l) => (
                            <line
                                key={l.key}
                                x1={l.from === null ? model.plotLeft : model.xOfTime(l.from)}
                                x2={model.plotRight}
                                y1={model.y(l.p)}
                                y2={model.y(l.p)}
                                stroke={COLOR.ref}
                                strokeOpacity={0.75}
                                strokeWidth={1}
                                shapeRendering="crispEdges"
                            />
                        ))}

                        {/* 200주 이평 / −30% 곡선 (마지막 값은 오른쪽 끝까지 연장) */}
                        {model.lastMa !== null &&
                            [1, 0.7].map((mult) => {
                                const pts: string[] = [];
                                model.ma.forEach((m, i) => {
                                    if (m !== null) pts.push(`${model.cx(i).toFixed(1)},${model.y(m * mult).toFixed(1)}`);
                                });
                                const yLast = model.y((model.lastMa as number) * mult);
                                return (
                                    <g key={mult}>
                                        <polyline
                                            points={pts.join(" ")}
                                            fill="none"
                                            stroke={mult === 1 ? COLOR.ma : COLOR.ref}
                                            strokeOpacity={mult === 1 ? 0.95 : 0.75}
                                            strokeWidth={mult === 1 ? 2 : 1.25}
                                            strokeLinejoin="round"
                                        />
                                        <line
                                            x1={model.cx(model.shown.length - 1)}
                                            x2={model.plotRight}
                                            y1={yLast}
                                            y2={yLast}
                                            stroke={mult === 1 ? COLOR.ma : COLOR.ref}
                                            strokeOpacity={0.4}
                                            strokeWidth={1}
                                        />
                                    </g>
                                );
                            })}

                        {/* 캔들 */}
                        {model.shown.map((k, i) => {
                            const up = k.c >= k.o;
                            const color = up ? COLOR.up : COLOR.down;
                            const x = model.cx(i);
                            const bw = clamp(model.slotW * 0.62, 1, 22);
                            const yo = model.y(k.o);
                            const yc = model.y(k.c);
                            return (
                                <g key={k.t} opacity={hover === null || hover === i ? 1 : 0.5}>
                                    <line x1={x} x2={x} y1={model.y(k.h)} y2={model.y(k.l)} stroke={color} strokeWidth={1} />
                                    <rect x={x - bw / 2} y={Math.min(yo, yc)} width={bw} height={Math.max(1, Math.abs(yo - yc))} fill={color} />
                                </g>
                            );
                        })}

                        {/* 구간 이름 (구간 안, 미래 구간 왼쪽) */}
                        {ZONES.map((z) => {
                            const x = Math.max(model.xEnd + (compact ? 12 : 14), model.xOfTime(z.from) + 10);
                            const yy = model.y(z.labelAt);
                            if (compact) return <NumBadge key={`b-${z.key}`} x={x} y={yy} no={z.no} color={z.color} />;
                            return (
                                <text key={`t-${z.key}`} x={x} y={yy} dy="0.35em" {...HALO} className={clsx("text-[13px]", z.muted ? "fill-slate-400" : "fill-white")}>
                                    <tspan className="font-bold">{z.name}</tspan>
                                    <tspan dx={6} className={clsx("font-mono", z.muted ? "fill-slate-400" : "fill-slate-200")}>
                                        {z.range}
                                    </tspan>
                                </text>
                            );
                        })}

                        {/* 레벨 이름 (가격 축 옆) */}
                        {model.lineLabels.map((l, i) => {
                            const yTrue = model.y(l.p);
                            const yLab = model.lineLabelY[i];
                            if (compact) {
                                const bx = model.plotRight - 12;
                                return (
                                    <g key={`ll-${l.key}`}>
                                        {Math.abs(yLab - yTrue) > 2 && <line x1={bx} x2={bx} y1={yTrue} y2={yLab} stroke={l.color} strokeOpacity={0.6} strokeWidth={1} />}
                                        <NumBadge x={bx} y={yLab} no={l.no} color={l.color} />
                                    </g>
                                );
                            }
                            // 라벨은 자기 선 바로 위에 오른쪽 정렬. 겹침 때문에 밀려났을 때만 연결선을 긋는다.
                            const lx = model.plotRight - 5;
                            const moved = Math.abs(yLab + 7 - yTrue) > 3;
                            return (
                                <g key={`ll-${l.key}`}>
                                    {moved && (
                                        <polyline
                                            points={`${lx},${yTrue} ${lx},${yLab} ${lx - 4},${yLab}`}
                                            fill="none"
                                            stroke={l.color}
                                            strokeOpacity={0.7}
                                            strokeWidth={1}
                                        />
                                    )}
                                    <text x={lx - 8} y={yLab} dy="0.35em" textAnchor="end" {...HALO} className="fill-slate-100 text-[12.5px]">
                                        {l.text}
                                    </text>
                                </g>
                            );
                        })}

                        {/* 현재가 태그 */}
                        {(() => {
                            const last = model.shown[model.shown.length - 1];
                            const yy = model.y(last.c);
                            const color = last.c >= last.o ? COLOR.up : COLOR.down;
                            return (
                                <g>
                                    <line x1={model.cx(model.shown.length - 1)} x2={model.plotRight} y1={yy} y2={yy} stroke={color} strokeOpacity={0.55} strokeWidth={1} />
                                    <rect x={model.plotRight + 1} y={yy - 9} width={model.axisW - 3} height={18} rx={3} fill={color} />
                                    <text x={model.plotRight + model.axisW / 2} y={yy} dy="0.35em" textAnchor="middle" className="fill-slate-950 font-mono text-[10.5px] font-bold">
                                        {compact ? fmtK(last.c) : fmt(last.c)}
                                    </text>
                                </g>
                            );
                        })()}

                        {/* 월 눈금 */}
                        {model.months.map((m) => (
                            <text
                                key={m.x}
                                x={m.x}
                                y={height - 9}
                                textAnchor="middle"
                                className={clsx("font-mono", compact ? "text-[10px]" : "text-[11px]", m.future ? "fill-slate-600" : "fill-slate-500")}
                            >
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
                        className="pointer-events-none absolute top-10 z-10 w-44 rounded-md border border-protoss-border bg-protoss-card/95 p-2.5 font-mono text-xs leading-relaxed text-slate-300 shadow-lg"
                        style={
                            model.cx(hover) > (width ?? 0) / 2
                                ? { left: Math.max(4, model.cx(hover) - 188) }
                                : { left: Math.min((width ?? 0) - 180, model.cx(hover) + 10) }
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

            {/* 범례 */}
            <ul className="mt-3 grid gap-x-6 gap-y-2 border-t border-protoss-border/60 px-1 pt-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5" aria-label="차트 범례">
                {legend.map((g) => (
                    <li key={g.no} className="flex items-start gap-2.5 text-sm">
                        {compact && (
                            <span
                                className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full border-[1.5px] font-mono text-[10px] font-bold text-slate-100"
                                style={{ borderColor: g.color }}
                            >
                                {g.no}
                            </span>
                        )}
                        <span className="mt-1.5 flex h-3 w-5 flex-none items-center" aria-hidden="true">
                            {g.swatch === "zone" ? (
                                <span className="h-3 w-5 rounded-sm" style={{ background: g.color, opacity: g.opacity }} />
                            ) : (
                                <span className="w-5 rounded-full" style={{ background: g.color, height: g.swatch === "curve" && g.no === MA_NO ? 3 : 2 }} />
                            )}
                        </span>
                        <span className="min-w-0 break-keep leading-snug">
                            <span className="text-slate-200">{g.name}</span> <span className="font-mono text-slate-100">{g.value}</span>
                            <span className="block text-xs text-slate-500">{g.note}</span>
                        </span>
                    </li>
                ))}
            </ul>

            <figcaption className="mt-3 space-y-1 break-keep border-t border-protoss-border/60 px-1 pt-2 text-xs leading-relaxed text-slate-500">
                <p>
                    <span className="font-mono text-slate-400">그림 1 · BTC 주봉 + 가격 근거 레벨 (USD)</span> — 캔들은 바이낸스 BTC/USDT 주봉(월요일
                    09:00 KST 시작, 빨강 상승·파랑 하락)입니다. 구간·선은 게시물 수치(2026-11-23 기준)를 정리자가 겹쳐 그린 것이며 원작자 차트
                    이미지가 아닙니다. 마지막 캔들 오른쪽은 앞으로의 기간이고, 금색 음영은 피보나치 타임존 저점 형성 구간입니다.
                </p>
                <p>
                    200주 이평은 같은 주봉 종가로 계산했습니다(11/15이 속한 주 67,983 — 원작자 값 67,960). 이평이 오르면 −30% 선도 따라 올라갑니다.
                    캔들에 마우스를 올리거나 탭하면 주별 시세가 보입니다.
                </p>
            </figcaption>

            {/* 표 보기 */}
            {model && (
                <details className="mt-2 px-1 text-xs text-slate-400">
                    <summary className="cursor-pointer select-none font-mono text-slate-500 hover:text-slate-300">표로 보기 (표시 중인 {model.shown.length}주)</summary>
                    <table className="mt-2 w-full max-w-2xl font-mono tabular-nums">
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
