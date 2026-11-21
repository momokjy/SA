"use client";

import { useState } from "react";
import { clsx } from "clsx";

interface NumberFieldProps {
    id: string;
    value: number;
    onChange: (v: number) => void;
    /** 표시 소수 자릿수 */
    decimals?: number;
    suffix?: string;
    allowNegative?: boolean;
    hint?: string;
    ariaLabel?: string;
    className?: string;
}

function parse(text: string, allowNegative: boolean): number | null {
    const t = text.replace(/[,\s]/g, "");
    if (t === "" || t === "-" || t === "." || t === "-.") return null;
    if (!allowNegative && t.startsWith("-")) return null;
    const n = Number(t);
    return Number.isFinite(n) ? n : null;
}

function display(v: number, decimals: number): string {
    if (!Number.isFinite(v)) return "";
    return v.toLocaleString("ko-KR", { maximumFractionDigits: decimals });
}

function raw(v: number, decimals: number): string {
    if (!Number.isFinite(v)) return "";
    return String(Number(v.toFixed(decimals)));
}

/**
 * 포커스 중에는 사용자가 입력한 원문을 유지하고, 포커스가 빠지면 천 단위 구분 기호로 보여준다.
 * 다른 입력에서 값이 바뀌면(연동 필드) 포커스가 없을 때 즉시 반영된다.
 */
export default function NumberField({
    id,
    value,
    onChange,
    decimals = 2,
    suffix,
    allowNegative = false,
    hint,
    ariaLabel,
    className,
}: NumberFieldProps) {
    const [focused, setFocused] = useState(false);
    const [text, setText] = useState("");

    return (
        <div className={className}>
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    aria-label={ariaLabel}
                    value={focused ? text : display(value, decimals)}
                    onFocus={(e) => {
                        setText(raw(value, decimals));
                        setFocused(true);
                        requestAnimationFrame(() => e.target.select());
                    }}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                        setText(e.target.value);
                        const n = parse(e.target.value, allowNegative);
                        if (n !== null) onChange(n);
                    }}
                    className={clsx(
                        "w-full bg-protoss-bg border border-protoss-border rounded-md py-2 pl-3 text-white font-mono text-sm tabular-nums",
                        "focus:border-protoss-accent-blue focus:outline-none focus:ring-1 focus:ring-protoss-accent-blue/40 transition-colors",
                        suffix ? "pr-14" : "pr-3"
                    )}
                />
                {suffix && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-500">
                        {suffix}
                    </span>
                )}
            </div>
            {hint && <p className="mt-1 text-[11px] font-mono text-slate-500">{hint}</p>}
        </div>
    );
}
