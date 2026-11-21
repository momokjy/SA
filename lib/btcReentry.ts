/**
 * BTC 정리 → 가격 변동 → 재진입 시뮬레이션 엔진 (순수 함수, UI 의존성 없음)
 *
 * 모델 가정
 * - 단일 종목(BTC), 격리(isolated) 마진 기준. 레버리지 1x 롱 = 현물과 동일(청산 없음).
 * - 기존 포지션의 진입 수수료는 이미 지불된 매몰비용으로 보고 제외.
 * - 수수료는 체결 명목가(수량 × 체결가)에 편도로 부과, 슬리피지는 불리한 방향으로 체결가를 밀어냄.
 * - 세금은 이번 정리에서 발생한 실현이익(수수료 차감 후)이 양수일 때만 단순 비율로 부과.
 * - 가격 경로는 단조(한 방향)로 가정: 도착 가격이 청산가를 넘으면 청산, 아니면 생존.
 * - 청산가: 포지션 평가금이 유지증거금(mmr × 수량 × 가격)에 도달하는 가격.
 */

export type Direction = "long" | "short";

export interface CalcInput {
    direction: Direction;
    /** 기존 포지션 레버리지 (>= 1) */
    leverage: number;
    /** 평균 진입가 P0 */
    entryPrice: number;
    /** 투입 원금(증거금) M0 */
    margin: number;
    /** 현재가 = 정리 가격 P1 */
    exitPrice: number;
    /** 정리 비율 (0~1) */
    closeRatio: number;
    /** 재진입 가격 P2 */
    reentryPrice: number;
    /** 정리로 확보한 현금 중 재진입에 쓰는 비율 (0~1) */
    reentryRatio: number;
    /** 재진입 레버리지 (>= 1) */
    reentryLeverage: number;
    /** 편도 수수료율 (소수, 0.0005 = 0.05%) */
    feeRate: number;
    /** 편도 슬리피지 (소수) */
    slippageRate: number;
    /** 실현이익 세율 (소수) */
    taxRate: number;
    /** 유지증거금률 (소수) */
    mmr: number;
}

export interface Position {
    qty: number;
    entry: number;
    margin: number;
}

export interface Crossover {
    price: number;
    /** 이 가격보다 위에서 유리한 쪽 */
    betterAbove: "hold" | "switch";
}

export interface CalcResult {
    ok: true;
    input: CalcInput;
    dir: 1 | -1;

    original: Position;
    originalLiq: number | null;

    // 현재(정리 시점) 상태
    priceChangeAtExit: number;
    unrealizedAtExit: number;
    roeAtExit: number;

    // ① 정리
    closeQty: number;
    exitExecPrice: number;
    grossPnl: number;
    exitFee: number;
    exitSlippageCost: number;
    tax: number;
    realizedNet: number;
    cashOut: number;

    // 정리 후 남은 포지션
    remaining: Position | null;
    remainingLiquidated: boolean;

    // 가격 변동
    moveAfterExit: number;

    // ② 재진입
    budget: number;
    freeCash: number;
    reentryExecPrice: number;
    newMargin: number;
    newNotional: number;
    newQty: number;
    entryFee: number;
    entrySlippageCost: number;

    // 재진입 후 합산 포지션
    merged: Position | null;
    mergedLiq: number | null;

    // 보유 유지 시나리오
    holdLiquidated: boolean;
    holdValue: number;

    // 비교
    switchValue: number;
    diffVsHold: number;
    totalCost: number;

    qtyBefore: number;
    qtyAfter: number;
    qtyChange: number;
    notionalBefore: number;
    notionalAfter: number;
    marginBefore: number;
    marginAfter: number;
    marginChange: number;
    effLevHold: number | null;
    effLevSwitch: number | null;

    /** 원래 BTC 수량을 정확히 되찾는 재진입가 (이보다 낮게 재진입하면 수량 증가) */
    sameQtyReentryPrice: number | null;
    /** 보유 유지 vs 재진입 평가금이 같아지는 미래 가격 */
    crossover: Crossover | null;
    /** 평가금이 초기 원금으로 돌아오는 가격 */
    recoveryPriceHold: number | null;
    recoveryPriceSwitch: number | null;
}

export type CalcError =
    | { ok: false; reason: "invalid"; message: string }
    | { ok: false; reason: "liquidated"; message: string; liqPrice: number };

export type CalcOutcome = CalcResult | CalcError;

export const sign = (d: Direction): 1 | -1 => (d === "long" ? 1 : -1);

export function positionEquity(dir: Direction, pos: Position, price: number): number {
    return pos.margin + sign(dir) * pos.qty * (price - pos.entry);
}

export function liquidationPrice(dir: Direction, pos: Position, mmr: number): number | null {
    if (pos.qty <= 0) return null;
    const marginPerUnit = pos.margin / pos.qty;
    if (dir === "long") {
        const p = (pos.entry - marginPerUnit) / (1 - mmr);
        // 1x 롱(현물)은 p = 0 → 청산 없음. 부동소수 오차 보정.
        return p > pos.entry * 1e-9 ? p : null;
    }
    return (pos.entry + marginPerUnit) / (1 + mmr);
}

export function isLiquidated(dir: Direction, pos: Position, price: number, mmr: number): boolean {
    const liq = liquidationPrice(dir, pos, mmr);
    if (liq === null) return false;
    return dir === "long" ? price <= liq : price >= liq;
}

/** 청산되었으면 0, 아니면 평가금(음수 불가) */
export function positionValue(dir: Direction, pos: Position | null, price: number, mmr: number): number {
    if (!pos || pos.qty <= 0) return 0;
    if (isLiquidated(dir, pos, price, mmr)) return 0;
    return Math.max(0, positionEquity(dir, pos, price));
}

function validate(i: CalcInput): string | null {
    const positive: [number, string][] = [
        [i.entryPrice, "평균 진입가"],
        [i.margin, "투입 원금"],
        [i.exitPrice, "현재가(정리가)"],
        [i.reentryPrice, "재진입가"],
    ];
    for (const [v, name] of positive) {
        if (!Number.isFinite(v) || v <= 0) return `${name}는 0보다 커야 합니다.`;
    }
    if (!Number.isFinite(i.leverage) || i.leverage < 1) return "레버리지는 1배 이상이어야 합니다.";
    if (!Number.isFinite(i.reentryLeverage) || i.reentryLeverage < 1) return "재진입 레버리지는 1배 이상이어야 합니다.";
    const ratios: [number, string][] = [
        [i.closeRatio, "정리 비율"],
        [i.reentryRatio, "재진입 비율"],
    ];
    for (const [v, name] of ratios) {
        if (!Number.isFinite(v) || v < 0 || v > 1) return `${name}은 0~100% 사이여야 합니다.`;
    }
    const rates: [number, string][] = [
        [i.feeRate, "수수료"],
        [i.slippageRate, "슬리피지"],
        [i.taxRate, "세율"],
        [i.mmr, "유지증거금률"],
    ];
    for (const [v, name] of rates) {
        if (!Number.isFinite(v) || v < 0 || v >= 1) return `${name}은 0~100% 미만이어야 합니다.`;
    }
    return null;
}

export function calculate(input: CalcInput): CalcOutcome {
    const err = validate(input);
    if (err) return { ok: false, reason: "invalid", message: err };

    const {
        direction,
        leverage: L,
        entryPrice: P0,
        margin: M0,
        exitPrice: P1,
        closeRatio: c,
        reentryPrice: P2,
        reentryRatio: k,
        reentryLeverage: L2,
        feeRate: f,
        slippageRate: s,
        taxRate: t,
        mmr,
    } = input;
    const d = sign(direction);

    // 기존 포지션
    const Q0 = (M0 * L) / P0;
    const original: Position = { qty: Q0, entry: P0, margin: M0 };
    const originalLiq = liquidationPrice(direction, original, mmr);

    if (isLiquidated(direction, original, P1, mmr)) {
        return {
            ok: false,
            reason: "liquidated",
            message: "현재가가 청산가를 넘어섰습니다. 이 포지션은 이미 강제 청산된 상태입니다.",
            liqPrice: originalLiq ?? 0,
        };
    }

    const unrealizedAtExit = d * Q0 * (P1 - P0);
    const roeAtExit = unrealizedAtExit / M0;
    const priceChangeAtExit = P1 / P0 - 1;

    // ① 정리 (closeRatio 만큼)
    const closeQty = c * Q0;
    const exitExecPrice = P1 * (1 - d * s);
    const grossPnl = d * closeQty * (exitExecPrice - P0);
    const exitFee = closeQty * exitExecPrice * f;
    const exitSlippageCost = closeQty * P1 * s;
    const preTax = grossPnl - exitFee;
    const tax = Math.max(0, preTax) * t;
    const realizedNet = preTax - tax;
    const cashOut = Math.max(0, c * M0 + realizedNet);

    // 남은 포지션 (부분 정리 시)
    let remaining: Position | null =
        c < 1 ? { qty: (1 - c) * Q0, entry: P0, margin: (1 - c) * M0 } : null;
    let remainingLiquidated = false;
    if (remaining && isLiquidated(direction, remaining, P2, mmr)) {
        remainingLiquidated = true;
        remaining = null;
    }

    const moveAfterExit = P2 / P1 - 1;

    // ② 재진입: 예산 = 증거금 + 진입 수수료
    const budget = k * cashOut;
    const freeCash = cashOut - budget;
    const reentryExecPrice = P2 * (1 + d * s);
    const newMargin = budget / (1 + L2 * f);
    const newNotional = newMargin * L2;
    const newQty = newNotional / reentryExecPrice;
    const entryFee = newNotional * f;
    const entrySlippageCost = newQty * P2 * s;

    // 합산 포지션
    const remQty = remaining?.qty ?? 0;
    const qtyAfter = remQty + newQty;
    let merged: Position | null = null;
    if (qtyAfter > 0) {
        merged = {
            qty: qtyAfter,
            entry: (remQty * P0 + newQty * reentryExecPrice) / qtyAfter,
            margin: (remaining?.margin ?? 0) + newMargin,
        };
    }
    const mergedLiq = merged ? liquidationPrice(direction, merged, mmr) : null;

    // 보유 유지 시나리오 (P1 → P2 동안 아무것도 안 함)
    const holdLiquidated = isLiquidated(direction, original, P2, mmr);
    const holdValue = holdLiquidated ? 0 : positionValue(direction, original, P2, mmr);
    const switchValue = freeCash + positionValue(direction, merged, P2, mmr);

    const holdEquityAtP2 = holdLiquidated ? 0 : positionEquity(direction, original, P2);
    const switchPosEquityAtP2 = merged ? positionEquity(direction, merged, P2) : 0;

    const sameQtyReentryPrice =
        c > 0 && budget > 0 ? (budget * L2) / (1 + L2 * f) / (c * Q0 * (1 + d * s)) : null;

    // 보유 vs 재진입 평가금 교차 가격 (둘 다 청산되지 않은 구간의 선형식)
    let crossover: Crossover | null = null;
    if (!holdLiquidated) {
        const holdA = M0 - d * Q0 * P0;
        const holdB = d * Q0;
        const swA = freeCash + (merged ? merged.margin - d * merged.qty * merged.entry : 0);
        const swB = merged ? d * merged.qty : 0;
        const B = swB - holdB;
        if (Math.abs(B) > Q0 * 1e-9) {
            const p = -(swA - holdA) / B;
            if (
                Number.isFinite(p) &&
                p > 0 &&
                !isLiquidated(direction, original, p, mmr) &&
                !(merged && isLiquidated(direction, merged, p, mmr))
            ) {
                crossover = { price: p, betterAbove: B > 0 ? "switch" : "hold" };
            }
        }
    }

    const recoveryPriceHold = holdLiquidated ? null : P0;
    let recoveryPriceSwitch: number | null = null;
    if (merged) {
        const p = merged.entry + (M0 - freeCash - merged.margin) / (d * merged.qty);
        if (Number.isFinite(p) && p > 0 && !isLiquidated(direction, merged, p, mmr)) recoveryPriceSwitch = p;
    }

    return {
        ok: true,
        input,
        dir: d,
        original,
        originalLiq,
        priceChangeAtExit,
        unrealizedAtExit,
        roeAtExit,
        closeQty,
        exitExecPrice,
        grossPnl,
        exitFee,
        exitSlippageCost,
        tax,
        realizedNet,
        cashOut,
        remaining,
        remainingLiquidated,
        moveAfterExit,
        budget,
        freeCash,
        reentryExecPrice,
        newMargin,
        newNotional,
        newQty,
        entryFee,
        entrySlippageCost,
        merged,
        mergedLiq,
        holdLiquidated,
        holdValue,
        switchValue,
        diffVsHold: switchValue - holdValue,
        totalCost: exitFee + exitSlippageCost + tax + entryFee + entrySlippageCost,
        qtyBefore: Q0,
        qtyAfter,
        qtyChange: qtyAfter / Q0 - 1,
        notionalBefore: Q0 * P0,
        notionalAfter: qtyAfter * P2,
        marginBefore: M0,
        marginAfter: merged?.margin ?? 0,
        marginChange: (merged?.margin ?? 0) / M0 - 1,
        effLevHold: holdEquityAtP2 > 0 ? (Q0 * P2) / holdEquityAtP2 : null,
        effLevSwitch: merged && switchPosEquityAtP2 > 0 ? (merged.qty * P2) / switchPosEquityAtP2 : null,
        sameQtyReentryPrice,
        crossover,
        recoveryPriceHold,
        recoveryPriceSwitch,
    };
}

/** 재진입 이후 임의의 미래 가격에서의 두 시나리오 평가금 */
export function valuesAt(r: CalcResult, price: number): { hold: number; switch: number } {
    const { direction, mmr } = r.input;
    return {
        hold: r.holdLiquidated ? 0 : positionValue(direction, r.original, price, mmr),
        switch: r.freeCash + positionValue(direction, r.merged, price, mmr),
    };
}

/** 기존 레버리지·방향 기준 ROE(%) → 가격 */
export function priceFromRoe(input: Pick<CalcInput, "direction" | "leverage" | "entryPrice">, roe: number): number {
    return input.entryPrice * (1 + roe / (sign(input.direction) * input.leverage));
}

export function roeFromPrice(input: Pick<CalcInput, "direction" | "leverage" | "entryPrice">, price: number): number {
    return sign(input.direction) * input.leverage * (price / input.entryPrice - 1);
}

export type HeatMetric = "qty" | "value";

export interface HeatCell {
    roe: number;
    move: number;
    value: number | null;
    exitPrice: number;
    reentryPrice: number;
    liquidatedAtExit: boolean;
}

/**
 * 현재 수익률(ROE) × 정리 후 가격 변동 → 규모 변화 매트릭스.
 * qty: 재진입 후 BTC 수량 변화율, value: 보유 유지 대비 평가금 차이 / 초기 원금.
 */
export function heatGrid(base: CalcInput, roes: number[], moves: number[], metric: HeatMetric): HeatCell[][] {
    return roes.map((roe) =>
        moves.map((move) => {
            const exitPrice = priceFromRoe(base, roe);
            const reentryPrice = exitPrice * (1 + move);
            const empty: HeatCell = { roe, move, value: null, exitPrice, reentryPrice, liquidatedAtExit: true };
            if (!(exitPrice > 0) || !(reentryPrice > 0)) return empty;
            const r = calculate({ ...base, exitPrice, reentryPrice });
            if (!r.ok) return empty;
            const value = metric === "qty" ? r.qtyChange : r.diffVsHold / r.marginBefore;
            return { roe, move, value, exitPrice, reentryPrice, liquidatedAtExit: false };
        })
    );
}
