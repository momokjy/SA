import { CSSProperties, ReactNode } from "react";
import { clsx } from "clsx";

/*
 * 띵까당 BTC 하방 관점 페이지용 도식.
 * 게시물에 나온 수치를 같은 축척으로 다시 그린 것이며 원작자 차트 이미지가 아니다.
 * 색 역할: 금색 = 원작자 목표 구간, 파랑 = CVDD, 회색 = 참고 레벨 (모든 마크는 직접 라벨).
 * 텍스트는 수치/설명 잉크(slate)로, 색은 마크에만 쓴다.
 */

/* ------------------------------------------------------------------ */
/* 그림 1 · 가격 근거 레벨 지도                                             */
/* ------------------------------------------------------------------ */

const P_MAX = 74_000;
const P_MIN = 42_000;
const H = 480; // plot height (px) — SVG viewBox 높이와 1:1
const yOf = (p: number) => ((P_MAX - p) / (P_MAX - P_MIN)) * H;

// 가로 배치 (plot 영역 너비 대비 %)
const LANE_TARGET = { x: 0, w: 25 };
const LANE_CVDD = { x: 27, w: 19 };
const LINES_END = LANE_CVDD.x + LANE_CVDD.w; // 46
const LABEL_X = 52;

const TICKS = [45_000, 50_000, 55_000, 60_000, 65_000, 70_000];

type ZoneTone = "old" | "main" | "floor" | "cvdd";

const ZONES: { lane: typeof LANE_TARGET; hi: number; lo: number; lines: string[]; tone: ZoneTone }[] = [
    { lane: LANE_TARGET, hi: 71_738, lo: 63_471, lines: ["11/02", "71.7K", "~63.5K", "(이전)"], tone: "old" },
    { lane: LANE_TARGET, hi: 53_000, lo: 49_000, lines: ["11/15", "53~49K"], tone: "main" },
    { lane: LANE_TARGET, hi: 49_000, lo: 47_000, lines: ["11/21", "49~47K"], tone: "floor" },
    { lane: LANE_CVDD, hi: 58_900, lo: 49_100, lines: ["CVDD", "58.9K", "~49.1K"], tone: "cvdd" },
];

const ZONE_FILL: Record<ZoneTone, { fill: string; opacity: number; text: string }> = {
    old: { fill: "#FFD700", opacity: 0.08, text: "text-slate-400" },
    main: { fill: "#FFD700", opacity: 0.32, text: "text-white" },
    floor: { fill: "#FFD700", opacity: 0.18, text: "text-slate-100" },
    cvdd: { fill: "#00F0FF", opacity: 0.14, text: "text-slate-100" },
};

const LEVELS: { p: number; value: string; name: string }[] = [
    { p: 67_960, value: "≈67,960", name: "200주 이평" },
    { p: 57_737, value: "57,737", name: "6월 저점" },
    { p: 56_625, value: "56,625", name: "피보나치 0.382" },
    { p: 47_800, value: "≈47,800", name: "−23.6% 측정" },
    { p: 47_600, value: "≈47,600", name: "200주 이평 −30%" },
    { p: 44_204, value: "44,204", name: "피보나치 0.5" },
];

/** 라벨이 겹치지 않도록 세로 위치를 최소 간격만큼 밀어낸다 (위→아래 정렬 입력). */
function spreadLabels(ys: number[], gap: number, min: number, max: number): number[] {
    const out = ys.map((v) => Math.max(min, v));
    for (let i = 1; i < out.length; i++) out[i] = Math.max(out[i], out[i - 1] + gap);
    for (let i = out.length - 1; i >= 0; i--) {
        const limit = i === out.length - 1 ? max : out[i + 1] - gap;
        out[i] = Math.min(out[i], limit);
    }
    return out;
}

const pct = (v: number) => `${v}%`;

export function PriceLevelMap() {
    const levelYs = LEVELS.map((l) => yOf(l.p));
    const labelYs = spreadLabels(levelYs, 28, 14, H - 14);

    return (
        <figure id="fig-levels" className="scroll-mt-6 rounded-lg border border-protoss-border bg-protoss-bg/60 p-3 sm:p-5">
            {/* 레인 헤더 */}
            <div className="flex font-mono text-[10px] text-slate-500 sm:text-[11px]">
                <div className="w-8 flex-none sm:w-9" />
                <div className="relative h-8 flex-1">
                    <span className="absolute bottom-1 leading-tight" style={{ left: pct(LANE_TARGET.x), width: pct(LANE_TARGET.w) }}>
                        <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-protoss-accent-gold/60 align-middle" aria-hidden="true" />
                        원작자 목표
                    </span>
                    <span className="absolute bottom-1 leading-tight" style={{ left: pct(LANE_CVDD.x), width: pct(LANE_CVDD.w) }}>
                        <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-protoss-accent-blue/60 align-middle" aria-hidden="true" />
                        CVDD
                    </span>
                    <span className="absolute bottom-1 leading-tight" style={{ left: pct(LABEL_X) }}>
                        <span className="mr-1 inline-block h-px w-3 bg-slate-400 align-middle" aria-hidden="true" />
                        참고 레벨
                    </span>
                </div>
            </div>

            <div className="flex">
                {/* 가격 축 */}
                <div className="relative w-8 flex-none sm:w-9" style={{ height: H }} aria-hidden="true">
                    {TICKS.map((t) => (
                        <span
                            key={t}
                            className="absolute right-1 -translate-y-1/2 font-mono text-[10px] tabular-nums text-slate-500 sm:right-1.5"
                            style={{ top: yOf(t) }}
                        >
                            {t / 1000}K
                        </span>
                    ))}
                </div>

                {/* 플롯 */}
                <div className="relative flex-1" style={{ height: H }}>
                    <svg
                        className="absolute inset-0 h-full w-full overflow-visible"
                        viewBox={`0 0 100 ${H}`}
                        preserveAspectRatio="none"
                        aria-hidden="true"
                    >
                        {/* 그리드 (실선 헤어라인) */}
                        {TICKS.map((t) => (
                            <line
                                key={t}
                                x1={0}
                                x2={LINES_END}
                                y1={yOf(t)}
                                y2={yOf(t)}
                                stroke="#1E293B"
                                strokeWidth={1}
                                vectorEffect="non-scaling-stroke"
                            />
                        ))}

                        {/* 구간 (인접 구간 사이 2px 간격) */}
                        {ZONES.map((z) => {
                            const top = yOf(z.hi) + 1;
                            const bottom = yOf(z.lo) - 1;
                            const tone = ZONE_FILL[z.tone];
                            return (
                                <g key={`${z.tone}-${z.hi}`}>
                                    <rect
                                        x={z.lane.x}
                                        y={top}
                                        width={z.lane.w}
                                        height={bottom - top}
                                        fill={tone.fill}
                                        fillOpacity={tone.opacity}
                                    />
                                    {(z.tone === "old" || z.tone === "cvdd") &&
                                        [top, bottom].map((yy) => (
                                            <line
                                                key={yy}
                                                x1={z.lane.x}
                                                x2={z.lane.x + z.lane.w}
                                                y1={yy}
                                                y2={yy}
                                                stroke={tone.fill}
                                                strokeOpacity={z.tone === "cvdd" ? 0.8 : 0.4}
                                                strokeWidth={z.tone === "cvdd" ? 2 : 1}
                                                vectorEffect="non-scaling-stroke"
                                            />
                                        ))}
                                </g>
                            );
                        })}

                        {/* 참고 레벨 선 + 라벨 연결선 */}
                        {LEVELS.map((l, i) => (
                            <g key={l.p}>
                                <line
                                    x1={0}
                                    x2={LINES_END}
                                    y1={levelYs[i]}
                                    y2={levelYs[i]}
                                    stroke="#94A3B8"
                                    strokeOpacity={0.85}
                                    strokeWidth={1}
                                    vectorEffect="non-scaling-stroke"
                                />
                                <polyline
                                    points={`${LINES_END},${levelYs[i]} ${LABEL_X - 1.5},${labelYs[i]}`}
                                    fill="none"
                                    stroke="#64748B"
                                    strokeWidth={1}
                                    vectorEffect="non-scaling-stroke"
                                />
                            </g>
                        ))}
                    </svg>

                    {/* 구간 안 라벨 — 들어갈 높이가 될 때만 줄 수만큼 표시 */}
                    {ZONES.map((z) => {
                        const top = yOf(z.hi) + 1;
                        const height = yOf(z.lo) - 1 - top;
                        const maxLines = Math.max(1, Math.floor((height - 4) / 12));
                        return (
                            <div
                                key={`label-${z.tone}-${z.hi}`}
                                className={clsx(
                                    "absolute flex flex-col items-center justify-center overflow-hidden text-center font-mono text-[10px] leading-3",
                                    ZONE_FILL[z.tone].text
                                )}
                                style={{ left: pct(z.lane.x), width: pct(z.lane.w), top, height }}
                            >
                                {z.lines.slice(0, maxLines).map((line, i) => (
                                    <span key={line} className={clsx("whitespace-nowrap", i === 0 && "font-bold")}>
                                        {line}
                                    </span>
                                ))}
                            </div>
                        );
                    })}

                    {/* 참고 레벨 라벨 */}
                    {LEVELS.map((l, i) => (
                        <div
                            key={`label-${l.p}`}
                            className="absolute flex -translate-y-1/2 flex-col whitespace-nowrap text-[10px] leading-tight sm:flex-row sm:items-baseline sm:gap-1.5 sm:text-xs"
                            style={{ left: pct(LABEL_X), top: labelYs[i] } as CSSProperties}
                        >
                            <span className="font-mono tabular-nums text-slate-100">{l.value}</span>
                            <span className="text-slate-400">{l.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            <figcaption className="mt-3 break-keep border-t border-protoss-border/60 pt-2 text-[11px] leading-relaxed text-slate-500">
                <span className="font-mono text-slate-400">그림 1 · 가격 근거 레벨 지도 (USD)</span> — 게시물에 나온 수치를 같은 축척으로
                다시 그린 도식이며 원작자 차트 이미지가 아닙니다. 11/02 구간은 이후 하향된 이전 목표입니다.
            </figcaption>
        </figure>
    );
}

/* ------------------------------------------------------------------ */
/* 카드 안 미니 도식 (수평 수직선)                                          */
/* ------------------------------------------------------------------ */

type Anchor = "center" | "left" | "right";
const anchorCls: Record<Anchor, string> = {
    center: "-translate-x-1/2 text-center",
    left: "text-left",
    right: "-translate-x-full text-right",
};

function MiniLabel({ at, anchor = "center", className, children }: { at: number; anchor?: Anchor; className?: string; children: ReactNode }) {
    return (
        <span className={clsx("absolute whitespace-nowrap text-[10px] leading-tight sm:text-[11px]", anchorCls[anchor], className)} style={{ left: pct(at) }}>
            {children}
        </span>
    );
}

function MiniFigure({ label, caption, children }: { label: string; caption: string; children: ReactNode }) {
    return (
        <figure className="mt-3 rounded-md border border-protoss-border/60 bg-protoss-card/60 px-3 pb-2 pt-3">
            <div className="relative h-[4.75rem]" role="img" aria-label={label}>
                {children}
            </div>
            <figcaption className="mt-1 break-keep text-[10px] leading-snug text-slate-500">{caption}</figcaption>
        </figure>
    );
}

/** 4Y Realized Price R/R: 85~100 구간, 90 기준·93.5 현재·98.57 목표선 */
export function RiskRewardFigure() {
    const lo = 85;
    const hi = 100;
    const at = (v: number) => ((v - lo) / (hi - lo)) * 100;
    return (
        <MiniFigure
            label="R/R 지표: 11/14 기준 93.5, 과거 가속 기준 90, 목표선 98.57"
            caption="도식 · 축 85~100. 음영 = R/R 90 이상(원작자: 과거 이 구간에서 가속화)."
        >
            {/* 현재값 라벨 (위) */}
            <MiniLabel at={at(93.5)} className="top-0 text-slate-200">
                <span className="font-mono">11/14 · 93.5</span>
            </MiniLabel>
            {/* 트랙 */}
            <div className="absolute inset-x-0 top-[1.75rem] h-px bg-slate-600" />
            <div className="absolute top-[1.5rem] h-2.5 rounded-sm bg-slate-400/20" style={{ left: pct(at(90)), right: 0 }} />
            {/* 90 기준 */}
            <div className="absolute top-[1.25rem] h-4 w-px bg-slate-400" style={{ left: pct(at(90)) }} />
            {/* 목표선 */}
            <div className="absolute top-[1.125rem] h-[1.25rem] w-0.5 rounded-full bg-protoss-accent-gold" style={{ left: pct(at(98.57)) }} />
            {/* 현재값 마커 */}
            <div
                className="absolute top-[1.75rem] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-protoss-accent-blue ring-2 ring-protoss-card"
                style={{ left: pct(at(93.5)) }}
            />
            {/* 아래 라벨 */}
            <MiniLabel at={at(90)} className="top-[2.75rem] text-slate-400">
                가속 기준 <span className="font-mono text-slate-200">90</span>
            </MiniLabel>
            <MiniLabel at={100} anchor="right" className="top-[2.75rem] text-slate-400">
                목표선 <span className="font-mono text-slate-200">98.57</span>
            </MiniLabel>
        </MiniFigure>
    );
}

/** 피보나치 타임존: 0.6~0.8 비율 축, 0.618~0.786 저점 구간, 11/16 주 0.65 진입 */
export function FibTimeFigure() {
    const lo = 0.6;
    const hi = 0.8;
    const at = (v: number) => ((v - lo) / (hi - lo)) * 100;
    return (
        <MiniFigure
            label="피보나치 타임존: 저점 형성 구간 0.618~0.786, 11/16 주 0.65 진입, 0.786은 2027년 5월 전후"
            caption="도식 · 왼쪽→오른쪽 시간 흐름(타임존 비율 0.6~0.8). 음영 = 원작자가 본 저점 형성 구간."
        >
            <MiniLabel at={at(0.65)} className="top-0 text-slate-200">
                <span className="font-mono">11/16 주 · 0.65</span>
            </MiniLabel>
            <div className="absolute inset-x-0 top-[1.75rem] h-px bg-slate-600" />
            <div
                className="absolute top-[1.5rem] h-2.5 rounded-sm bg-protoss-accent-gold/25"
                style={{ left: pct(at(0.618)), width: pct(at(0.786) - at(0.618)) }}
            />
            <div className="absolute top-[1.25rem] h-4 w-px bg-slate-400" style={{ left: pct(at(0.618)) }} />
            <div className="absolute top-[1.25rem] h-4 w-px bg-slate-400" style={{ left: pct(at(0.786)) }} />
            <div
                className="absolute top-[1.75rem] h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-protoss-accent-blue ring-2 ring-protoss-card"
                style={{ left: pct(at(0.65)) }}
            />
            <MiniLabel at={at(0.618)} anchor="left" className="top-[2.75rem] text-slate-400">
                <span className="font-mono text-slate-200">0.618</span>
            </MiniLabel>
            <MiniLabel at={at(0.786)} anchor="right" className="top-[2.75rem] text-slate-400">
                <span className="block font-mono text-slate-200">0.786</span>
                <span className="block">2027년 5월 전후</span>
            </MiniLabel>
        </MiniFigure>
    );
}
