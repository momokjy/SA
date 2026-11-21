"use client";

import { useCallback, useEffect, useState } from "react";
import { calculate } from "@/lib/btcReentry";
import { State, restoreState, reentryLeverageOf, reentryPriceOf, toInput } from "./state";

/**
 * 저장한 계산은 이 브라우저의 localStorage에만 남는다(기기·브라우저 간 공유 안 됨).
 * 계산 결과 숫자는 저장하지 않고 입력값만 저장해, 불러올 때마다 현재 엔진으로 다시 계산한다.
 */
const KEY = "btc-reentry-calculator.saved.v1";
const MAX_ITEMS = 100;

export interface SavedScenario {
    id: string;
    name: string;
    savedAt: string;
    state: State;
}

function readStorage(): SavedScenario[] {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const items: SavedScenario[] = [];
    for (const p of parsed) {
        if (!p || typeof p !== "object") continue;
        const rec = p as Record<string, unknown>;
        const state = restoreState(rec.state);
        if (!state || typeof rec.id !== "string") continue;
        items.push({
            id: rec.id,
            name: typeof rec.name === "string" && rec.name.trim() ? rec.name : "이름 없음",
            savedAt: typeof rec.savedAt === "string" ? rec.savedAt : new Date().toISOString(),
            state,
        });
    }
    return items;
}

export function useSavedScenarios() {
    const [items, setItems] = useState<SavedScenario[]>([]);
    const [storageOk, setStorageOk] = useState(true);

    useEffect(() => {
        try {
            setItems(readStorage());
        } catch {
            setStorageOk(false);
        }
    }, []);

    const persist = useCallback((next: SavedScenario[]) => {
        setItems(next);
        try {
            window.localStorage.setItem(KEY, JSON.stringify(next));
            setStorageOk(true);
        } catch {
            setStorageOk(false);
        }
    }, []);

    const add = useCallback(
        (name: string, state: State) => {
            const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
            const item: SavedScenario = { id, name: name.trim() || "이름 없음", savedAt: new Date().toISOString(), state: { ...state } };
            persist([item, ...items].slice(0, MAX_ITEMS));
            return item;
        },
        [items, persist]
    );

    const remove = useCallback((id: string) => persist(items.filter((i) => i.id !== id)), [items, persist]);
    const clear = useCallback(() => persist([]), [persist]);

    return { items, storageOk, add, remove, clear };
}

/* ------------------------------------------------------------------ */
/* CSV 내보내기                                                          */
/* ------------------------------------------------------------------ */

function csvCell(v: string | number | null | undefined): string {
    if (v === null || v === undefined || (typeof v === "number" && !Number.isFinite(v))) return "";
    const s = typeof v === "number" ? String(Number(v.toPrecision(12))) : v;
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

const pct = (v: number) => v * 100;

export function scenariosToCsv(items: SavedScenario[]): string {
    const header = [
        "이름",
        "저장일시",
        "통화",
        "방향",
        "레버리지(x)",
        "평균 진입가",
        "투입 원금",
        "정리가",
        "정리 시점 수익률(%)",
        "정리 비율(%)",
        "재진입가",
        "정리가 대비 변동(%)",
        "재진입 금액 비율(%)",
        "재진입 레버리지(x)",
        "수수료(%)",
        "슬리피지(%)",
        "세율(%)",
        "유지증거금률(%)",
        "확보 현금",
        "BTC 수량(전)",
        "BTC 수량(후)",
        "BTC 수량 변화(%)",
        "명목 규모(후)",
        "증거금(후)",
        "보유 유지 평가금",
        "재진입 평가금",
        "보유 대비 차이",
        "보유 대비 차이(원금 대비 %)",
        "거래 비용 합계",
        "역전 가격",
        "원래 수량 회복 재진입가",
        "재진입 후 청산가",
        "비고",
    ];
    const rows = items.map((it) => {
        const s = it.state;
        const r = calculate(toInput(s));
        const base = [
            it.name,
            new Date(it.savedAt).toLocaleString("ko-KR"),
            s.currency,
            s.direction === "long" ? "롱" : "숏",
            s.leverage,
            s.entryPrice,
            s.margin,
            s.exitPrice,
            r.ok ? pct(r.roeAtExit) : null,
            s.closePct,
            reentryPriceOf(s),
            s.movePct,
            s.reentryPct,
            reentryLeverageOf(s),
            s.feePct,
            s.slippagePct,
            s.taxPct,
            s.mmrPct,
        ];
        const res = r.ok
            ? [
                  r.cashOut,
                  r.qtyBefore,
                  r.qtyAfter,
                  pct(r.qtyChange),
                  r.notionalAfter,
                  r.marginAfter,
                  r.holdValue,
                  r.switchValue,
                  r.diffVsHold,
                  pct(r.diffVsHold / r.marginBefore),
                  r.totalCost,
                  r.crossover?.price ?? null,
                  r.sameQtyReentryPrice,
                  r.mergedLiq,
                  r.holdLiquidated ? "보유 시 청산" : "",
              ]
            : [...Array(14).fill(null), r.message];
        return [...base, ...res].map(csvCell).join(",");
    });
    return [header.map(csvCell).join(","), ...rows].join("\r\n");
}

export function downloadCsv(items: SavedScenario[]) {
    // 엑셀에서 한글이 깨지지 않도록 UTF-8 BOM 포함
    const blob = new Blob(["﻿" + scenariosToCsv(items)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `btc-reentry-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}
