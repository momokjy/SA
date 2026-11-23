import { ReactNode } from "react";
import { clsx } from "clsx";

/*
 * 띵까당 BTC 하방 관점 페이지의 근거 카드용 미니 도식 (R/R 지표, 피보나치 타임존).
 * 게시물에 나온 수치를 다시 그린 것이며 원작자 차트 이미지가 아니다.
 * 텍스트는 수치/설명 잉크(slate)로, 색은 마크에만 쓴다.
 */

/* ------------------------------------------------------------------ */
/* 카드 안 미니 도식 (수평 수직선)                                          */
/* ------------------------------------------------------------------ */

const pct = (v: number) => `${v}%`;

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
