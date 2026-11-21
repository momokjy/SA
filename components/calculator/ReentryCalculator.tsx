"use client";

import { ReactNode, useMemo, useState } from "react";
import { clsx } from "clsx";
import { AlertTriangle, ArrowRight, Bitcoin, Info, RefreshCw, RotateCcw } from "lucide-react";
import { CalcResult, Direction, calculate, priceFromRoe, roeFromPrice } from "@/lib/btcReentry";
import NumberField from "./NumberField";
import ValueChart from "./ValueChart";
import ScaleHeatmap from "./ScaleHeatmap";
import { SaveBar, SavedList, autoName } from "./SavedScenarios";
import { useSavedScenarios } from "./scenarioStore";
import { CURRENCY_BASE, DEFAULTS, State, reentryLeverageOf, reentryPriceOf, toInput } from "./state";
import {
    Currency,
    currencyUnit,
    fmtBtc,
    fmtLev,
    fmtMoney,
    fmtPct,
    fmtSignedMoney,
    koreanUnit,
} from "./format";

/* ------------------------------------------------------------------ */
/* 상태 & 기본값                                                         */
/* ------------------------------------------------------------------ */

const PRESETS: {
    label: string;
    direction: Direction;
    leverage: number;
    exitMul: number;
    movePct: number;
}[] = [
    { label: "현물 손절 → 저점 재매수", direction: "long", leverage: 1, exitMul: 0.9, movePct: -5 },
    { label: "현물 익절 → 눌림 재매수", direction: "long", leverage: 1, exitMul: 1.2, movePct: -3 },
    { label: "3배 롱 손절 → 추가 하락 후 재진입", direction: "long", leverage: 3, exitMul: 0.95, movePct: -3 },
    { label: "10배 롱 손절 → 반등 추격", direction: "long", leverage: 10, exitMul: 0.97, movePct: 2 },
    { label: "2배 숏 익절 → 반등 후 재진입", direction: "short", leverage: 2, exitMul: 0.9, movePct: 3 },
];

const LEVERAGE_CHIPS = [1, 2, 3, 5, 10, 20];

async function fetchBtcPrice(currency: Currency): Promise<number> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 6000);
    try {
        if (currency === "KRW") {
            const res = await fetch("https://api.upbit.com/v1/ticker?markets=KRW-BTC", { signal: ctrl.signal, cache: "no-store" });
            if (!res.ok) throw new Error(String(res.status));
            const json = await res.json();
            const p = Number(json?.[0]?.trade_price);
            if (!(p > 0)) throw new Error("bad payload");
            return p;
        }
        const res = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT", { signal: ctrl.signal, cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();
        const p = Number(json?.price);
        if (!(p > 0)) throw new Error("bad payload");
        return p;
    } finally {
        clearTimeout(timer);
    }
}

/* ------------------------------------------------------------------ */
/* 작은 UI 조각                                                          */
/* ------------------------------------------------------------------ */

/** 국내 관례: 상승·증가 = 빨강, 하락·감소 = 파랑 (부호도 함께 표기) */
const tone = (v: number, eps = 1e-9) => (v > eps ? "text-rose-400" : v < -eps ? "text-blue-400" : "text-slate-300");

function Panel({ step, title, children, aside }: { step?: string; title: string; children: ReactNode; aside?: ReactNode }) {
    return (
        <section className="rounded-xl border border-protoss-border bg-protoss-card p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2">
                <h2 className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                    {step && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-protoss-accent-blue/50 text-[11px] text-protoss-accent-blue">
                            {step}
                        </span>
                    )}
                    {title}
                </h2>
                {aside}
            </div>
            <div className="space-y-4">{children}</div>
        </section>
    );
}

function Field({ label, htmlFor, children, aside }: { label: string; htmlFor?: string; children: ReactNode; aside?: ReactNode }) {
    return (
        <div>
            <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <label htmlFor={htmlFor} className="font-mono text-xs text-slate-400">
                    {label}
                </label>
                {aside}
            </div>
            {children}
        </div>
    );
}

function Segmented<T extends string>({
    value,
    options,
    onChange,
    ariaLabel,
}: {
    value: T;
    options: { value: T; label: string; active?: string }[];
    onChange: (v: T) => void;
    ariaLabel: string;
}) {
    return (
        <div role="radiogroup" aria-label={ariaLabel} className="grid auto-cols-fr grid-flow-col gap-1 rounded-md border border-protoss-border bg-protoss-bg p-1">
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    role="radio"
                    aria-checked={value === o.value}
                    onClick={() => onChange(o.value)}
                    className={clsx(
                        "rounded py-1.5 font-mono text-xs transition-colors",
                        value === o.value
                            ? o.active ?? "bg-protoss-accent-blue/15 text-protoss-accent-blue"
                            : "text-slate-400 hover:text-white"
                    )}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function Chips({ values, current, onPick, format }: { values: number[]; current: number; onPick: (v: number) => void; format: (v: number) => string }) {
    return (
        <div className="mt-2 flex flex-wrap gap-1.5">
            {values.map((v) => (
                <button
                    key={v}
                    type="button"
                    onClick={() => onPick(v)}
                    className={clsx(
                        "rounded border px-2 py-0.5 font-mono text-[11px] transition-colors",
                        Math.abs(current - v) < 1e-9
                            ? "border-protoss-accent-blue/60 bg-protoss-accent-blue/10 text-protoss-accent-blue"
                            : "border-protoss-border text-slate-500 hover:border-slate-500 hover:text-slate-300"
                    )}
                >
                    {format(v)}
                </button>
            ))}
        </div>
    );
}

function Slider({ id, value, min, max, step, onChange, ariaLabel }: { id?: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; ariaLabel: string }) {
    return (
        <input
            id={id}
            type="range"
            min={min}
            max={max}
            step={step}
            value={Math.min(max, Math.max(min, value))}
            aria-label={ariaLabel}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer accent-protoss-accent-blue"
        />
    );
}

function Row({ label, value, sub, strong }: { label: ReactNode; value: ReactNode; sub?: ReactNode; strong?: boolean }) {
    return (
        <div className="flex items-baseline justify-between gap-3 py-1.5">
            <span className="text-xs text-slate-400">{label}</span>
            <span className={clsx("text-right font-mono text-sm tabular-nums", strong ? "font-bold text-white" : "text-slate-200")}>
                {value}
                {sub && <span className="ml-1.5 text-[11px] font-normal text-slate-500">{sub}</span>}
            </span>
        </div>
    );
}

function StatTile({ label, value, delta, deltaTone, note }: { label: string; value: string; delta?: string; deltaTone?: string; note?: string }) {
    return (
        <div className="rounded-lg border border-protoss-border bg-protoss-bg/60 p-3.5">
            <div className="text-[11px] text-slate-500">{label}</div>
            <div className="mt-1 break-all font-mono text-base font-semibold text-white">{value}</div>
            {delta && <div className={clsx("mt-0.5 font-mono text-xs", deltaTone)}>{delta}</div>}
            {note && <div className="mt-1 text-[11px] leading-snug text-slate-500">{note}</div>}
        </div>
    );
}

function Warning({ children }: { children: ReactNode }) {
    return (
        <div className="flex gap-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-amber-400" aria-label="경고" />
            <div>{children}</div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* 메인                                                                 */
/* ------------------------------------------------------------------ */

export default function ReentryCalculator() {
    const [s, setS] = useState<State>(DEFAULTS);
    const [priceStatus, setPriceStatus] = useState<{ kind: "idle" | "loading" | "ok" | "error"; msg?: string }>({ kind: "idle" });
    const upd = (patch: Partial<State>) => setS((prev) => ({ ...prev, ...patch }));

    const unit = currencyUnit(s.currency);
    const priceDecimals = s.currency === "KRW" ? 0 : 2;
    const reLev = reentryLeverageOf(s);
    const reentryPrice = reentryPriceOf(s);

    const input = useMemo(() => toInput(s), [s]);
    const result = useMemo(() => calculate(input), [input]);
    const saved = useSavedScenarios();

    const roe = s.entryPrice > 0 && s.leverage > 0 ? roeFromPrice(input, s.exitPrice) : 0;

    const switchCurrency = (c: Currency) => {
        if (c === s.currency) return;
        const base = CURRENCY_BASE[c];
        const ratio = s.entryPrice > 0 ? s.exitPrice / s.entryPrice : 1;
        upd({ currency: c, entryPrice: base.entryPrice, margin: base.margin, exitPrice: base.entryPrice * ratio });
        setPriceStatus({ kind: "idle" });
    };

    const applyPreset = (p: (typeof PRESETS)[number]) =>
        upd({
            direction: p.direction,
            leverage: p.leverage,
            sameLeverage: true,
            exitPrice: s.entryPrice * p.exitMul,
            movePct: p.movePct,
            closePct: 100,
            reentryPct: 100,
        });

    const loadLivePrice = async () => {
        setPriceStatus({ kind: "loading" });
        try {
            const p = await fetchBtcPrice(s.currency);
            upd({ exitPrice: p });
            setPriceStatus({
                kind: "ok",
                msg: `${s.currency === "KRW" ? "업비트" : "바이낸스"} 현재가 반영 (${new Date().toLocaleTimeString("ko-KR")})`,
            });
        } catch {
            setPriceStatus({ kind: "error", msg: "현재가를 불러오지 못했습니다. 직접 입력해 주세요." });
        }
    };

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
            {/* 헤더 */}
            <header className="space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                    <Bitcoin className="h-4 w-4 text-protoss-accent-gold" />
                    TOOLS // BTC RE-ENTRY SIMULATOR
                </div>
                <h1 className="font-mono text-2xl font-bold tracking-tight text-white md:text-3xl">
                    비트코인 <span className="text-protoss-accent-blue">재진입 계산기</span>
                </h1>
                <p className="max-w-3xl text-sm leading-relaxed text-slate-400">
                    지금 손실 또는 이익 상태의 포지션을 정리하고, 가격이 움직인 뒤 다시 들어가면 포지션 규모(BTC 수량·명목 규모·증거금)가
                    얼마나 달라지는지, 그리고 그냥 들고 있었을 때와 비교해 무엇이 유리한지 계산합니다.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                    <span className="self-center font-mono text-[11px] text-slate-500">예시:</span>
                    {PRESETS.map((p) => (
                        <button
                            key={p.label}
                            type="button"
                            onClick={() => applyPreset(p)}
                            className="rounded-full border border-protoss-border px-3 py-1 text-xs text-slate-400 transition-colors hover:border-protoss-accent-gold/60 hover:text-protoss-accent-gold"
                        >
                            {p.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            setS(DEFAULTS);
                            setPriceStatus({ kind: "idle" });
                        }}
                        className="inline-flex items-center gap-1 rounded-full border border-protoss-border px-3 py-1 text-xs text-slate-500 transition-colors hover:text-white"
                    >
                        <RotateCcw className="h-3 w-3" /> 초기화
                    </button>
                </div>
            </header>

            <SaveBar
                defaultName={autoName(s, result.ok ? result.roeAtExit : roe)}
                disabled={!result.ok}
                storageOk={saved.storageOk}
                savedCount={saved.items.length}
                onSave={(name) => saved.add(name, s)}
            />

            <div className="grid gap-6 lg:grid-cols-[minmax(320px,400px)_1fr]">
                {/* ---------------- 입력 ---------------- */}
                <div className="space-y-4">
                    <Panel step="1" title="현재 포지션">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="통화">
                                <Segmented
                                    ariaLabel="통화"
                                    value={s.currency}
                                    onChange={switchCurrency}
                                    options={[
                                        { value: "KRW", label: "KRW" },
                                        { value: "USDT", label: "USDT" },
                                    ]}
                                />
                            </Field>
                            <Field label="방향">
                                <Segmented
                                    ariaLabel="포지션 방향"
                                    value={s.direction}
                                    onChange={(v) => upd({ direction: v })}
                                    options={[
                                        { value: "long", label: "롱", active: "bg-rose-500/15 text-rose-300" },
                                        { value: "short", label: "숏", active: "bg-blue-500/15 text-blue-300" },
                                    ]}
                                />
                            </Field>
                        </div>

                        <Field
                            label="레버리지"
                            htmlFor="lev"
                            aside={<span className="font-mono text-[11px] text-slate-500">{s.leverage === 1 && s.direction === "long" ? "현물과 동일" : "격리 마진"}</span>}
                        >
                            <NumberField id="lev" value={s.leverage} decimals={1} suffix="x" onChange={(v) => upd({ leverage: v })} />
                            <Chips values={LEVERAGE_CHIPS} current={s.leverage} onPick={(v) => upd({ leverage: v })} format={(v) => `${v}x`} />
                        </Field>

                        <Field label="평균 진입가" htmlFor="entry">
                            <NumberField
                                id="entry"
                                value={s.entryPrice}
                                decimals={priceDecimals}
                                suffix={unit}
                                onChange={(v) => upd({ entryPrice: v })}
                                hint={s.currency === "KRW" ? koreanUnit(s.entryPrice) : undefined}
                            />
                        </Field>

                        <Field label={s.leverage === 1 && s.direction === "long" ? "투입 원금" : "투입 원금 (증거금)"} htmlFor="margin">
                            <NumberField
                                id="margin"
                                value={s.margin}
                                decimals={priceDecimals}
                                suffix={unit}
                                onChange={(v) => upd({ margin: v })}
                                hint={s.currency === "KRW" ? koreanUnit(s.margin) : undefined}
                            />
                        </Field>

                        <div className="grid grid-cols-[1fr_auto] gap-3">
                            <Field
                                label="현재가 (= 정리 가격)"
                                htmlFor="exit"
                                aside={
                                    <button
                                        type="button"
                                        onClick={loadLivePrice}
                                        disabled={priceStatus.kind === "loading"}
                                        className="inline-flex items-center gap-1 font-mono text-[11px] text-protoss-accent-blue/80 hover:text-protoss-accent-blue disabled:opacity-50"
                                    >
                                        <RefreshCw className={clsx("h-3 w-3", priceStatus.kind === "loading" && "animate-spin")} />
                                        실시간
                                    </button>
                                }
                            >
                                <NumberField id="exit" value={s.exitPrice} decimals={priceDecimals} suffix={unit} onChange={(v) => upd({ exitPrice: v })} />
                            </Field>
                            <Field label="현재 수익률" htmlFor="roe">
                                <NumberField
                                    id="roe"
                                    className="w-28"
                                    value={roe * 100}
                                    decimals={2}
                                    suffix="%"
                                    allowNegative
                                    onChange={(v) => upd({ exitPrice: priceFromRoe(input, v / 100) })}
                                />
                            </Field>
                        </div>
                        {priceStatus.msg && (
                            <p className={clsx("-mt-2 font-mono text-[11px]", priceStatus.kind === "error" ? "text-amber-300" : "text-slate-500")}>{priceStatus.msg}</p>
                        )}
                        <p className="-mt-1 text-[11px] leading-relaxed text-slate-500">
                            수익률은 증거금 대비(ROE, 레버리지 반영·수수료 제외). 둘 중 하나를 입력하면 다른 하나가 자동 계산됩니다.
                        </p>
                    </Panel>

                    <Panel step="2" title="정리">
                        <Field label="정리 비율" htmlFor="close" aside={<span className="font-mono text-sm text-white">{s.closePct}%</span>}>
                            <Slider id="close" ariaLabel="정리 비율" value={s.closePct} min={0} max={100} step={1} onChange={(v) => upd({ closePct: v })} />
                            <Chips values={[25, 50, 75, 100]} current={s.closePct} onPick={(v) => upd({ closePct: v })} format={(v) => `${v}%`} />
                        </Field>
                    </Panel>

                    <Panel step="3" title="가격 변동 후 재진입">
                        <Field
                            label="정리가 대비 가격 변동"
                            htmlFor="move"
                            aside={<span className={clsx("font-mono text-sm", tone(s.movePct))}>{fmtPct(s.movePct / 100, 2)}</span>}
                        >
                            <Slider id="move" ariaLabel="정리가 대비 가격 변동" value={s.movePct} min={-30} max={30} step={0.1} onChange={(v) => upd({ movePct: v })} />
                        </Field>
                        <div className="grid grid-cols-[1fr_auto] gap-3">
                            <Field label="재진입가" htmlFor="reentry">
                                <NumberField
                                    id="reentry"
                                    value={reentryPrice}
                                    decimals={priceDecimals}
                                    suffix={unit}
                                    onChange={(v) => s.exitPrice > 0 && upd({ movePct: (v / s.exitPrice - 1) * 100 })}
                                />
                            </Field>
                            <Field label="변동률" htmlFor="movepct">
                                <NumberField id="movepct" className="w-28" value={s.movePct} decimals={2} suffix="%" allowNegative onChange={(v) => upd({ movePct: v })} />
                            </Field>
                        </div>

                        <Field
                            label="재진입 금액 (확보 현금 대비)"
                            htmlFor="rein"
                            aside={<span className="font-mono text-sm text-white">{s.reentryPct}%</span>}
                        >
                            <Slider id="rein" ariaLabel="재진입 금액 비율" value={s.reentryPct} min={0} max={100} step={1} onChange={(v) => upd({ reentryPct: v })} />
                            <Chips values={[25, 50, 75, 100]} current={s.reentryPct} onPick={(v) => upd({ reentryPct: v })} format={(v) => `${v}%`} />
                        </Field>

                        <Field
                            label="재진입 레버리지"
                            htmlFor="relev"
                            aside={
                                <label className="flex cursor-pointer items-center gap-1.5 font-mono text-[11px] text-slate-400">
                                    <input
                                        type="checkbox"
                                        checked={s.sameLeverage}
                                        onChange={(e) => upd({ sameLeverage: e.target.checked, reentryLeverage: s.leverage })}
                                        className="accent-protoss-accent-blue"
                                    />
                                    기존과 동일
                                </label>
                            }
                        >
                            {s.sameLeverage ? (
                                <div className="rounded-md border border-protoss-border bg-protoss-bg/50 px-3 py-2 font-mono text-sm text-slate-400">{s.leverage}x</div>
                            ) : (
                                <>
                                    <NumberField id="relev" value={s.reentryLeverage} decimals={1} suffix="x" onChange={(v) => upd({ reentryLeverage: v })} />
                                    <Chips values={LEVERAGE_CHIPS} current={s.reentryLeverage} onPick={(v) => upd({ reentryLeverage: v })} format={(v) => `${v}x`} />
                                </>
                            )}
                        </Field>
                    </Panel>

                    <Panel step="4" title="비용 · 리스크 설정">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="수수료 (편도)" htmlFor="fee">
                                <NumberField id="fee" value={s.feePct} decimals={4} suffix="%" onChange={(v) => upd({ feePct: v })} />
                            </Field>
                            <Field label="슬리피지 (편도)" htmlFor="slip">
                                <NumberField id="slip" value={s.slippagePct} decimals={4} suffix="%" onChange={(v) => upd({ slippagePct: v })} />
                            </Field>
                            <Field label="실현이익 세율" htmlFor="tax">
                                <NumberField id="tax" value={s.taxPct} decimals={2} suffix="%" onChange={(v) => upd({ taxPct: v })} />
                            </Field>
                            <Field label="유지증거금률" htmlFor="mmr">
                                <NumberField id="mmr" value={s.mmrPct} decimals={3} suffix="%" onChange={(v) => upd({ mmrPct: v })} />
                            </Field>
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-500">
                            수수료·슬리피지는 정리와 재진입 각각에 적용됩니다. 세금은 이번 정리의 실현이익에만 단순 비율로 적용하며(기본공제 미반영),
                            국내 가상자산 과세(22%) 시행 여부는 별도로 확인하세요. 유지증거금률은 레버리지 포지션의 청산가 계산에만 쓰입니다.
                        </p>
                    </Panel>
                </div>

                {/* ---------------- 결과 ---------------- */}
                <div className="min-w-0 space-y-6">
                    {result.ok ? (
                        <Results r={result} s={s} reLev={reLev} />
                    ) : (
                        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-6">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="mt-0.5 h-5 w-5 flex-none text-amber-400" aria-label="경고" />
                                <div className="space-y-1">
                                    <p className="font-bold text-amber-200">{result.reason === "liquidated" ? "이미 청산된 포지션" : "입력값을 확인해 주세요"}</p>
                                    <p className="text-sm text-amber-100/80">{result.message}</p>
                                    {result.reason === "liquidated" && (
                                        <p className="font-mono text-xs text-amber-100/70">청산가 ≈ {fmtMoney(result.liqPrice, s.currency)}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <SavedList
                items={saved.items}
                onRemove={saved.remove}
                onClear={saved.clear}
                onLoad={(item) => {
                    setS({ ...item.state });
                    setPriceStatus({ kind: "ok", msg: `저장한 계산 "${item.name}" 불러옴` });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
            />
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* 결과 영역                                                             */
/* ------------------------------------------------------------------ */

function Results({ r, s, reLev }: { r: CalcResult; s: State; reLev: number }) {
    const c = s.currency;
    const P0 = r.input.entryPrice;
    const P1 = r.input.exitPrice;
    const P2 = r.input.reentryPrice;
    const isSpot = s.leverage === 1 && reLev === 1 && s.direction === "long";
    const dirLabel = s.direction === "long" ? "롱" : "숏";
    const posLabel = isSpot ? "현물" : `${dirLabel} ${s.leverage}x`;
    const moveWord = r.moveAfterExit > 0 ? "오른" : r.moveAfterExit < 0 ? "내린" : "변동 없는";
    const diffPct = r.diffVsHold / r.marginBefore;
    const liqDistance = r.mergedLiq ? Math.abs(r.mergedLiq / P2 - 1) : null;

    return (
        <>
            {/* 요약 */}
            <section className="rounded-xl border border-protoss-accent-blue/30 bg-gradient-to-br from-protoss-card to-[#0f1a2b] p-5 shadow-[0_0_30px_rgba(0,240,255,0.05)] sm:p-6">
                <p className="text-sm leading-relaxed text-slate-300">
                    <strong className="text-white">{posLabel}</strong> 포지션을 수익률{" "}
                    <span className={clsx("font-mono", tone(r.roeAtExit))}>{fmtPct(r.roeAtExit)}</span>에서{" "}
                    {s.closePct}% 정리하고, 가격이 <span className={clsx("font-mono", tone(r.moveAfterExit))}>{fmtPct(r.moveAfterExit)}</span>{" "}
                    {moveWord} <span className="font-mono text-white">{fmtMoney(P2, c)}</span>에 확보 현금의 {s.reentryPct}%로 재진입하면
                </p>
                <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
                    <div>
                        <div className="text-xs text-slate-500">BTC 보유 수량 변화</div>
                        <div className={clsx("text-5xl font-semibold tracking-tight", tone(r.qtyChange, 5e-7))}>{fmtPct(r.qtyChange)}</div>
                    </div>
                    <div className="pb-1 font-mono text-sm text-slate-400">
                        {fmtBtc(r.qtyBefore)} <ArrowRight className="mx-1 inline h-3.5 w-3.5" /> <span className="text-white">{fmtBtc(r.qtyAfter)}</span>
                    </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">
                    재진입 직후 총 평가금은 그냥 보유했을 때보다{" "}
                    <span className={clsx("font-mono font-bold", tone(r.diffVsHold, 1e-6))}>{fmtSignedMoney(r.diffVsHold, c)}</span>{" "}
                    <span className="text-slate-500">(원금 대비 {fmtPct(diffPct)})</span>{" "}
                    {r.diffVsHold >= 0 ? "많습니다." : "적습니다."}
                    {r.crossover ? (
                        <>
                            {" "}
                            이후 가격이 <span className="font-mono text-white">{fmtMoney(r.crossover.price, c)}</span>
                            <span className="text-slate-500"> (재진입가 대비 {fmtPct(r.crossover.price / P2 - 1, 1)})</span>보다{" "}
                            {r.crossover.betterAbove === "hold" ? "위로 가면 보유 유지가, 아래에서는 재진입이" : "위로 가면 재진입이, 아래에서는 보유 유지가"} 유리합니다.
                        </>
                    ) : (
                        !r.holdLiquidated && <> 청산 구간을 제외하면 이후 가격이 어디로 가든 이 우열은 바뀌지 않습니다.</>
                    )}
                </p>
            </section>

            {(r.holdLiquidated || r.remainingLiquidated || (liqDistance !== null && liqDistance < 0.05) || r.cashOut <= 0) && (
                <div className="space-y-2">
                    {r.holdLiquidated && (
                        <Warning>
                            그냥 보유했다면 가격이 {fmtMoney(P2, c)}에 도달하기 전 청산가 {fmtMoney(r.originalLiq ?? 0, c)}에서 강제 청산되어
                            증거금 전액을 잃습니다. 이 경우 정리 후 재진입이 손실을 제한한 셈입니다.
                        </Warning>
                    )}
                    {r.remainingLiquidated && <Warning>정리하지 않고 남겨둔 {100 - s.closePct}% 포지션이 재진입가 도달 전에 청산됩니다.</Warning>}
                    {liqDistance !== null && liqDistance < 0.05 && (
                        <Warning>
                            재진입 후 청산가 {fmtMoney(r.mergedLiq ?? 0, c)}가 재진입가와 {fmtPct(liqDistance, 2).replace("+", "")}밖에 떨어져 있지 않습니다.
                        </Warning>
                    )}
                    {r.cashOut <= 0 && <Warning>정리로 확보되는 현금이 없어 재진입할 수 없습니다.</Warning>}
                </div>
            )}

            {/* 규모 지표 */}
            <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile
                    label="포지션 명목 규모"
                    value={fmtMoney(r.notionalAfter, c)}
                    delta={`진입 당시 대비 ${fmtPct(r.notionalAfter / r.notionalBefore - 1)}`}
                    deltaTone={tone(r.notionalAfter / r.notionalBefore - 1, 5e-7)}
                    note={`진입 당시 ${fmtMoney(r.notionalBefore, c)}`}
                />
                <StatTile
                    label={isSpot ? "투입 금액 (원가)" : "증거금"}
                    value={fmtMoney(r.marginAfter, c)}
                    delta={`원금 대비 ${fmtPct(r.marginChange)}`}
                    deltaTone={tone(r.marginChange, 5e-7)}
                    note={r.freeCash > 0 ? `대기 현금 ${fmtMoney(r.freeCash, c)} 별도` : `원금 ${fmtMoney(r.marginBefore, c)}`}
                />
                <StatTile
                    label="보유 유지 대비 평가금"
                    value={fmtSignedMoney(r.diffVsHold, c)}
                    delta={`원금 대비 ${fmtPct(diffPct)}`}
                    deltaTone={tone(r.diffVsHold, 1e-6)}
                    note={`재진입 시점 ${fmtMoney(P2, c)} 기준`}
                />
                <StatTile
                    label="거래 비용 합계"
                    value={fmtMoney(r.totalCost, c)}
                    delta={`원금 대비 ${fmtPct(-r.totalCost / r.marginBefore)}`}
                    deltaTone="text-slate-400"
                    note="수수료 + 슬리피지 + 세금"
                />
            </section>

            {/* 단계별 흐름 */}
            <section className="grid gap-3 md:grid-cols-3">
                <div className="rounded-xl border border-protoss-border bg-protoss-card p-4">
                    <h3 className="mb-2 font-mono text-xs font-bold text-protoss-accent-blue">① 정리 @ {fmtMoney(P1, c)}</h3>
                    <div className="divide-y divide-protoss-border/60">
                        <Row label="정리 수량" value={fmtBtc(r.closeQty)} />
                        {s.slippagePct > 0 && <Row label="체결가 (슬리피지)" value={fmtMoney(r.exitExecPrice, c)} />}
                        <Row label="실현손익" value={<span className={tone(r.grossPnl)}>{fmtSignedMoney(r.grossPnl, c)}</span>} />
                        <Row label="수수료" value={fmtSignedMoney(-r.exitFee, c)} />
                        {s.taxPct > 0 && <Row label="세금" value={fmtSignedMoney(-r.tax, c)} />}
                        <Row label="확보 현금" value={fmtMoney(r.cashOut, c)} strong />
                    </div>
                </div>
                <div className="rounded-xl border border-protoss-border bg-protoss-card p-4">
                    <h3 className="mb-2 font-mono text-xs font-bold text-protoss-accent-blue">② 가격 변동</h3>
                    <div className="divide-y divide-protoss-border/60">
                        <Row label="정리가" value={fmtMoney(P1, c)} />
                        <Row label="재진입가" value={fmtMoney(P2, c)} />
                        <Row label="변동률" value={<span className={tone(r.moveAfterExit)}>{fmtPct(r.moveAfterExit)}</span>} />
                        <Row label="진입가 대비" value={<span className={tone(P2 / P0 - 1)}>{fmtPct(P2 / P0 - 1)}</span>} />
                        {r.remaining && (
                            <Row
                                label={`남은 ${100 - s.closePct}% 평가손익`}
                                value={
                                    <span className={tone(r.dir * r.remaining.qty * (P2 - P0))}>
                                        {fmtSignedMoney(r.dir * r.remaining.qty * (P2 - P0), c)}
                                    </span>
                                }
                            />
                        )}
                    </div>
                </div>
                <div className="rounded-xl border border-protoss-border bg-protoss-card p-4">
                    <h3 className="mb-2 font-mono text-xs font-bold text-protoss-accent-blue">③ 재진입 @ {fmtMoney(P2, c)}</h3>
                    <div className="divide-y divide-protoss-border/60">
                        <Row label="투입 금액" value={fmtMoney(r.budget, c)} sub={`${s.reentryPct}%`} />
                        {!isSpot && <Row label="증거금" value={fmtMoney(r.newMargin, c)} sub={`× ${reLev}`} />}
                        <Row label="명목 규모" value={fmtMoney(r.newNotional, c)} />
                        <Row label="수수료" value={fmtSignedMoney(-r.entryFee, c)} />
                        <Row label="신규 매수 수량" value={fmtBtc(r.newQty)} strong />
                    </div>
                </div>
            </section>

            {/* 비교 표 */}
            <Panel title="보유 유지 vs 정리 후 재진입" aside={<span className="hidden font-mono text-[11px] text-slate-500 sm:inline">@ {fmtMoney(P2, c)}</span>}>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[480px] font-mono text-xs tabular-nums">
                        <thead>
                            <tr className="border-b border-protoss-border text-left text-slate-500">
                                <th className="py-2 pr-3 font-normal">항목</th>
                                <th className="py-2 pr-3 text-right font-normal">
                                    <span className="mr-1.5 inline-block h-0.5 w-3 rounded align-middle" style={{ background: "#3987e5" }} />
                                    보유 유지
                                </th>
                                <th className="py-2 pr-3 text-right font-normal">
                                    <span className="mr-1.5 inline-block h-0.5 w-3 rounded align-middle" style={{ background: "#c98500" }} />
                                    정리 후 재진입
                                </th>
                                <th className="py-2 text-right font-normal">변화</th>
                            </tr>
                        </thead>
                        <tbody className="text-slate-300">
                            <CompareRow
                                label="BTC 수량"
                                hold={r.holdLiquidated ? "청산" : fmtBtc(r.qtyBefore)}
                                sw={fmtBtc(r.qtyAfter)}
                                delta={r.holdLiquidated ? "—" : fmtPct(r.qtyChange)}
                                deltaTone={r.holdLiquidated ? undefined : tone(r.qtyChange, 5e-7)}
                            />
                            <CompareRow
                                label="평균 진입가"
                                hold={fmtMoney(P0, c)}
                                sw={r.merged ? fmtMoney(r.merged.entry, c) : "—"}
                                delta={r.merged ? fmtPct(r.merged.entry / P0 - 1) : "—"}
                            />
                            <CompareRow
                                label={isSpot ? "투입 금액" : "증거금"}
                                hold={fmtMoney(r.marginBefore, c)}
                                sw={fmtMoney(r.marginAfter, c)}
                                delta={fmtPct(r.marginChange)}
                                deltaTone={tone(r.marginChange, 5e-7)}
                            />
                            <CompareRow
                                label="명목 규모"
                                hold={r.holdLiquidated ? "청산" : fmtMoney(r.qtyBefore * P2, c)}
                                sw={fmtMoney(r.notionalAfter, c)}
                                delta={r.holdLiquidated ? "—" : fmtPct(r.qtyChange)}
                                deltaTone={r.holdLiquidated ? undefined : tone(r.qtyChange, 5e-7)}
                            />
                            {r.freeCash > 0 && <CompareRow label="대기 현금" hold="—" sw={fmtMoney(r.freeCash, c)} delta="" />}
                            <CompareRow
                                label="총 평가금"
                                hold={fmtMoney(r.holdValue, c)}
                                sw={fmtMoney(r.switchValue, c)}
                                delta={fmtSignedMoney(r.diffVsHold, c)}
                                deltaTone={tone(r.diffVsHold, 1e-6)}
                                strong
                            />
                            {!isSpot && (
                                <>
                                    <CompareRow label="실효 레버리지" hold={r.holdLiquidated ? "청산" : fmtLev(r.effLevHold)} sw={fmtLev(r.effLevSwitch)} delta="" />
                                    <CompareRow
                                        label="청산가"
                                        hold={r.holdLiquidated ? "청산됨" : r.originalLiq ? fmtMoney(r.originalLiq, c) : "없음"}
                                        sw={r.mergedLiq ? fmtMoney(r.mergedLiq, c) : "없음"}
                                        delta=""
                                    />
                                </>
                            )}
                            <CompareRow
                                label="원금 회복 가격"
                                hold={r.recoveryPriceHold ? fmtMoney(r.recoveryPriceHold, c) : "—"}
                                sw={r.recoveryPriceSwitch ? fmtMoney(r.recoveryPriceSwitch, c) : "—"}
                                delta={r.recoveryPriceHold && r.recoveryPriceSwitch ? fmtPct(r.recoveryPriceSwitch / r.recoveryPriceHold - 1) : ""}
                            />
                        </tbody>
                    </table>
                </div>
            </Panel>

            {/* 핵심 가격 */}
            <section className="grid gap-3 sm:grid-cols-2">
                <KeyPrice
                    title="원래 수량을 되찾는 재진입가"
                    value={r.sameQtyReentryPrice ? fmtMoney(r.sameQtyReentryPrice, c) : "—"}
                    sub={r.sameQtyReentryPrice ? `정리가 대비 ${fmtPct(r.sameQtyReentryPrice / P1 - 1)}` : undefined}
                    body={
                        r.sameQtyReentryPrice
                            ? `이 가격보다 낮게 재진입하면 정리한 수량보다 많이, 높게 재진입하면 적게 다시 잡게 됩니다.${
                                  s.direction === "short" ? " (숏은 수량이 늘어도 더 낮은 가격에 진입하는 것이므로 유불리는 아래 차트로 판단하세요.)" : ""
                              }`
                            : "정리 비율 또는 재진입 금액이 0%입니다."
                    }
                />
                <KeyPrice
                    title="보유 유지와 손익이 같아지는 가격"
                    value={r.crossover ? fmtMoney(r.crossover.price, c) : "없음"}
                    sub={r.crossover ? `재진입가 대비 ${fmtPct(r.crossover.price / P2 - 1)}` : undefined}
                    body={
                        r.crossover
                            ? r.crossover.betterAbove === "hold"
                                ? "이 가격 위에서는 보유 유지가, 아래에서는 재진입이 평가금이 더 큽니다."
                                : "이 가격 위에서는 재진입이, 아래에서는 보유 유지가 평가금이 더 큽니다."
                            : "두 선이 (청산 구간 밖에서) 교차하지 않습니다. 한쪽이 모든 가격에서 우위입니다."
                    }
                />
            </section>

            <Panel title="재진입 이후 가격별 총 평가금">
                <ValueChart r={r} currency={c} />
                <p className="text-[11px] leading-relaxed text-slate-500">
                    가로축은 재진입 이후의 BTC 가격, 세로축은 각 시나리오의 총 평가금(포지션 평가금 + 대기 현금)입니다. 레버리지 포지션은 청산가에 닿으면 0이 됩니다.
                </p>
            </Panel>

            <Panel title="수익률 × 가격 변동 매트릭스">
                <p className="-mt-1 text-xs leading-relaxed text-slate-400">
                    지금 설정(방향·레버리지·정리/재진입 비율·비용)을 그대로 두고, <strong className="text-slate-200">정리 시점의 수익률</strong>과{" "}
                    <strong className="text-slate-200">정리 후 가격 변동</strong>만 바꿨을 때 결과가 어떻게 달라지는지 보여줍니다.
                </p>
                <ScaleHeatmap base={r.input} currentRoe={r.roeAtExit} currentMove={r.moveAfterExit} currency={c} />
            </Panel>

            <section className="rounded-xl border border-protoss-border bg-protoss-card/50 p-4 sm:p-5">
                <h3 className="mb-2 flex items-center gap-2 font-mono text-xs font-bold text-slate-400">
                    <Info className="h-3.5 w-3.5" /> 계산 가정
                </h3>
                <ul className="list-disc space-y-1 pl-5 text-[11px] leading-relaxed text-slate-500">
                    <li>단일 종목(BTC), 격리 마진 기준. 1배 롱은 현물과 같고 청산이 없습니다.</li>
                    <li>기존 포지션의 진입 수수료는 이미 낸 비용으로 보고 제외했습니다. 펀딩비·이자는 반영하지 않습니다.</li>
                    <li>가격은 정리가 → 재진입가로 한 방향으로 움직인다고 가정합니다. 중간에 청산가를 찍고 돌아오는 경로는 반영되지 않습니다.</li>
                    <li>청산가 = 평가금이 유지증거금(유지증거금률 × 명목 규모)에 닿는 가격. 실제 거래소 공식과 약간 다를 수 있습니다.</li>
                    <li>세금은 이번 정리의 실현이익 × 세율로 단순화했습니다(연간 합산·기본공제 미반영).</li>
                </ul>
            </section>
        </>
    );
}

function CompareRow({
    label,
    hold,
    sw,
    delta,
    deltaTone,
    strong,
}: {
    label: string;
    hold: string;
    sw: string;
    delta: string;
    deltaTone?: string;
    strong?: boolean;
}) {
    return (
        <tr className={clsx("border-b border-protoss-border/60", strong && "text-white")}>
            <td className={clsx("py-2 pr-3 font-sans", strong ? "font-bold" : "text-slate-400")}>{label}</td>
            <td className="py-2 pr-3 text-right">{hold}</td>
            <td className="py-2 pr-3 text-right">{sw}</td>
            <td className={clsx("py-2 text-right", deltaTone ?? "text-slate-500")}>{delta}</td>
        </tr>
    );
}

function KeyPrice({ title, value, sub, body }: { title: string; value: string; sub?: string; body: string }) {
    return (
        <div className="rounded-xl border border-protoss-border bg-protoss-card p-4">
            <div className="text-xs text-slate-500">{title}</div>
            <div className="mt-1 font-mono text-lg font-semibold text-protoss-accent-gold">{value}</div>
            {sub && <div className="font-mono text-[11px] text-slate-400">{sub}</div>}
            <p className="mt-2 text-xs leading-relaxed text-slate-400">{body}</p>
        </div>
    );
}
