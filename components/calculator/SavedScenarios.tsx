"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Check, Download, FolderOpen, Save, Trash2 } from "lucide-react";
import { calculate } from "@/lib/btcReentry";
import { SavedScenario, downloadCsv } from "./scenarioStore";
import { State, reentryLeverageOf, reentryPriceOf, toInput } from "./state";
import { fmtMoney, fmtPct, fmtSignedMoney } from "./format";

const tone = (v: number, eps = 1e-9) => (v > eps ? "text-rose-400" : v < -eps ? "text-blue-400" : "text-slate-300");

export function positionLabel(s: State): string {
    const reLev = reentryLeverageOf(s);
    if (s.direction === "long" && s.leverage === 1 && reLev === 1) return "현물";
    return `${s.direction === "long" ? "롱" : "숏"} ${s.leverage}x`;
}

export function autoName(s: State, roe: number): string {
    return `${positionLabel(s)} · 수익률 ${fmtPct(roe, 1)} → 변동 ${fmtPct(s.movePct / 100, 1)}`;
}

/** 페이지 상단: 현재 계산 저장 + 저장 목록 바로가기 */
export function SaveBar({
    defaultName,
    disabled,
    storageOk,
    savedCount,
    onSave,
}: {
    defaultName: string;
    disabled: boolean;
    storageOk: boolean;
    savedCount: number;
    onSave: (name: string) => void;
}) {
    const [name, setName] = useState("");
    const [saved, setSaved] = useState(false);

    const submit = () => {
        if (disabled) return;
        onSave(name.trim() || defaultName);
        setName("");
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                submit();
            }}
            className="flex flex-col gap-2 rounded-xl border border-protoss-border bg-protoss-card p-3 sm:flex-row sm:items-center"
        >
            <label htmlFor="save-name" className="flex flex-none items-center gap-1.5 font-mono text-xs text-protoss-accent-gold">
                <Save className="h-3.5 w-3.5" /> 이 계산 저장
            </label>
            <input
                id="save-name"
                type="text"
                value={name}
                maxLength={80}
                onChange={(e) => setName(e.target.value)}
                placeholder={defaultName}
                className="min-w-0 flex-1 rounded-md border border-protoss-border bg-protoss-bg px-3 py-1.5 text-sm text-white placeholder:text-slate-600 focus:border-protoss-accent-blue focus:outline-none"
            />
            <button
                type="submit"
                disabled={disabled}
                className={clsx(
                    "inline-flex flex-none items-center justify-center gap-1.5 rounded-md border px-3 py-1.5 font-mono text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                    saved
                        ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300"
                        : "border-protoss-accent-gold/50 bg-protoss-accent-gold/10 text-protoss-accent-gold hover:bg-protoss-accent-gold/20"
                )}
            >
                {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
                {saved ? "저장됨" : "저장"}
            </button>
            {savedCount > 0 && (
                <a
                    href="#saved"
                    onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("saved")?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="inline-flex flex-none items-center justify-center gap-1.5 rounded-md border border-protoss-border px-3 py-1.5 font-mono text-xs text-slate-300 transition-colors hover:border-protoss-accent-blue/60 hover:text-protoss-accent-blue"
                >
                    <FolderOpen className="h-3.5 w-3.5" /> 저장한 계산 {savedCount}개
                </a>
            )}
            {!storageOk && (
                <p className="text-[11px] text-amber-300 sm:basis-full">
                    이 브라우저에서는 저장소를 쓸 수 없어(사생활 보호 모드 등) 새로고침하면 저장 목록이 사라집니다. CSV로 내보내 보관하세요.
                </p>
            )}
        </form>
    );
}

/** 저장한 계산 목록: 비교·불러오기·삭제·CSV 내보내기 */
export function SavedList({
    items,
    onLoad,
    onRemove,
    onClear,
}: {
    items: SavedScenario[];
    onLoad: (item: SavedScenario) => void;
    onRemove: (id: string) => void;
    onClear: () => void;
}) {
    const [confirmClear, setConfirmClear] = useState(false);
    if (items.length === 0) return null;

    return (
        <section id="saved" className="rounded-xl border border-protoss-border bg-protoss-card p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-mono text-sm font-bold text-white">
                    저장한 계산 <span className="font-normal text-slate-500">{items.length}개</span>
                </h2>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => downloadCsv(items)}
                        className="inline-flex items-center gap-1.5 rounded-md border border-protoss-border px-3 py-1.5 font-mono text-xs text-slate-300 transition-colors hover:border-protoss-accent-blue/60 hover:text-protoss-accent-blue"
                    >
                        <Download className="h-3.5 w-3.5" /> CSV 내보내기
                    </button>
                    {confirmClear ? (
                        <span className="inline-flex items-center gap-2 font-mono text-xs text-slate-400">
                            전부 삭제할까요?
                            <button
                                type="button"
                                onClick={() => {
                                    onClear();
                                    setConfirmClear(false);
                                }}
                                className="rounded border border-rose-500/50 px-2 py-1 text-rose-300 hover:bg-rose-500/10"
                            >
                                삭제
                            </button>
                            <button type="button" onClick={() => setConfirmClear(false)} className="rounded border border-protoss-border px-2 py-1 hover:text-white">
                                취소
                            </button>
                        </span>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setConfirmClear(true)}
                            className="inline-flex items-center gap-1.5 rounded-md border border-protoss-border px-3 py-1.5 font-mono text-xs text-slate-500 transition-colors hover:text-rose-300"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> 전체 삭제
                        </button>
                    )}
                </div>
            </div>

            <div className="relative overflow-x-auto">
                <table className="w-full min-w-[820px] font-mono text-xs tabular-nums">
                    <thead>
                        <tr className="border-b border-protoss-border text-left text-slate-500">
                            <th className="py-2 pr-3 font-normal">이름</th>
                            <th className="py-2 pr-3 font-normal">포지션</th>
                            <th className="py-2 pr-3 text-right font-normal">정리 시 수익률</th>
                            <th className="py-2 pr-3 text-right font-normal">재진입가 (변동)</th>
                            <th className="py-2 pr-3 text-right font-normal">BTC 수량 변화</th>
                            <th className="py-2 pr-3 text-right font-normal">보유 대비 평가금</th>
                            <th className="py-2 pr-3 text-right font-normal">역전 가격</th>
                            <th className="py-2 text-right font-normal">
                                <span className="sr-only">동작</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-300">
                        {items.map((it) => {
                            const s = it.state;
                            const r = calculate(toInput(s));
                            return (
                                <tr key={it.id} className="border-b border-protoss-border/60 align-top">
                                    <td className="max-w-[220px] py-2 pr-3">
                                        <div className="truncate font-sans text-slate-200" title={it.name}>
                                            {it.name}
                                        </div>
                                        <div className="text-[10px] text-slate-600">{new Date(it.savedAt).toLocaleString("ko-KR")}</div>
                                    </td>
                                    <td className="py-2 pr-3 text-slate-400">
                                        {positionLabel(s)}
                                        <span className="ml-1 text-[10px] text-slate-600">{s.currency}</span>
                                    </td>
                                    {r.ok ? (
                                        <>
                                            <td className={clsx("py-2 pr-3 text-right", tone(r.roeAtExit))}>{fmtPct(r.roeAtExit)}</td>
                                            <td className="py-2 pr-3 text-right">
                                                {fmtMoney(reentryPriceOf(s), s.currency)}
                                                <div className={clsx("text-[10px]", tone(r.moveAfterExit))}>{fmtPct(r.moveAfterExit)}</div>
                                            </td>
                                            <td className={clsx("py-2 pr-3 text-right font-bold", tone(r.qtyChange, 5e-7))}>{fmtPct(r.qtyChange)}</td>
                                            <td className={clsx("py-2 pr-3 text-right", tone(r.diffVsHold, 1e-6))}>
                                                {fmtSignedMoney(r.diffVsHold, s.currency)}
                                                <div className="text-[10px] text-slate-500">원금 대비 {fmtPct(r.diffVsHold / r.marginBefore)}</div>
                                            </td>
                                            <td className="py-2 pr-3 text-right text-slate-400">
                                                {r.crossover ? fmtMoney(r.crossover.price, s.currency) : "없음"}
                                            </td>
                                        </>
                                    ) : (
                                        <td colSpan={5} className="py-2 pr-3 text-right text-amber-300">
                                            {r.message}
                                        </td>
                                    )}
                                    <td className="whitespace-nowrap py-2 text-right">
                                        <button
                                            type="button"
                                            onClick={() => onLoad(it)}
                                            className="inline-flex items-center gap-1 rounded border border-protoss-border px-2 py-1 text-[11px] text-slate-300 transition-colors hover:border-protoss-accent-blue/60 hover:text-protoss-accent-blue"
                                            aria-label={`${it.name} 불러오기`}
                                        >
                                            <FolderOpen className="h-3 w-3" /> 불러오기
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onRemove(it.id)}
                                            className="ml-1.5 inline-flex items-center rounded border border-protoss-border p-1 text-slate-500 transition-colors hover:border-rose-500/50 hover:text-rose-300"
                                            aria-label={`${it.name} 삭제`}
                                            title="삭제"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                저장한 계산은 이 브라우저에만 보관됩니다(다른 기기·브라우저와 공유되지 않음). 브라우저 데이터를 지우면 함께 사라지니, 오래 보관하려면 CSV로 내보내세요.
            </p>
        </section>
    );
}
