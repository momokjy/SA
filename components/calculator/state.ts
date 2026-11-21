import type { CalcInput, Direction } from "@/lib/btcReentry";
import type { Currency } from "./format";

/** 계산기 입력 상태 (퍼센트 값은 사람이 입력한 그대로, 예: 0.05 = 0.05%) */
export interface State {
    currency: Currency;
    direction: Direction;
    leverage: number;
    entryPrice: number;
    margin: number;
    exitPrice: number;
    closePct: number;
    movePct: number;
    reentryPct: number;
    sameLeverage: boolean;
    reentryLeverage: number;
    feePct: number;
    slippagePct: number;
    taxPct: number;
    mmrPct: number;
}

export const CURRENCY_BASE: Record<Currency, { entryPrice: number; margin: number }> = {
    KRW: { entryPrice: 150_000_000, margin: 10_000_000 },
    USDT: { entryPrice: 100_000, margin: 10_000 },
};

export const DEFAULTS: State = {
    currency: "KRW",
    direction: "long",
    leverage: 1,
    entryPrice: CURRENCY_BASE.KRW.entryPrice,
    margin: CURRENCY_BASE.KRW.margin,
    exitPrice: CURRENCY_BASE.KRW.entryPrice * 0.95,
    closePct: 100,
    movePct: -5,
    reentryPct: 100,
    sameLeverage: true,
    reentryLeverage: 1,
    feePct: 0.05,
    slippagePct: 0,
    taxPct: 0,
    mmrPct: 0.5,
};

export const reentryLeverageOf = (s: State) => (s.sameLeverage ? s.leverage : s.reentryLeverage);
export const reentryPriceOf = (s: State) => s.exitPrice * (1 + s.movePct / 100);

export function toInput(s: State): CalcInput {
    return {
        direction: s.direction,
        leverage: s.leverage,
        entryPrice: s.entryPrice,
        margin: s.margin,
        exitPrice: s.exitPrice,
        closeRatio: s.closePct / 100,
        reentryPrice: reentryPriceOf(s),
        reentryRatio: s.reentryPct / 100,
        reentryLeverage: reentryLeverageOf(s),
        feeRate: s.feePct / 100,
        slippageRate: s.slippagePct / 100,
        taxRate: s.taxPct / 100,
        mmr: s.mmrPct / 100,
    };
}

/** 저장된 값(오래된 버전이거나 손상된 값 포함)을 안전한 State로 복원. 실패하면 null. */
export function restoreState(raw: unknown): State | null {
    if (!raw || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    const out: State = { ...DEFAULTS };
    for (const key of Object.keys(DEFAULTS) as (keyof State)[]) {
        const v = r[key];
        const def = DEFAULTS[key];
        if (typeof def === "number" && typeof v === "number" && Number.isFinite(v)) (out[key] as number) = v;
        else if (typeof def === "boolean" && typeof v === "boolean") (out[key] as boolean) = v;
    }
    if (r.currency === "KRW" || r.currency === "USDT") out.currency = r.currency;
    if (r.direction === "long" || r.direction === "short") out.direction = r.direction;
    return out;
}
