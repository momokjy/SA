export type Currency = "KRW" | "USDT";

const MINUS = "−";

export const currencyUnit = (c: Currency) => (c === "KRW" ? "원" : "USDT");

const moneyDigits = (c: Currency) => (c === "KRW" ? 0 : 2);

function grouped(v: number, digits: number): string {
    return Math.abs(v).toLocaleString("ko-KR", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    });
}

/** 142,500,000원 / 95,000.00 USDT */
export function fmtMoney(v: number, c: Currency): string {
    const digits = moneyDigits(c);
    const neg = v < 0 && Math.abs(v) >= 0.5 * 10 ** -digits;
    return `${neg ? MINUS : ""}${grouped(v, digits)}${c === "KRW" ? "원" : " USDT"}`;
}

/** +1,234원 / −12.30 USDT */
export function fmtSignedMoney(v: number, c: Currency): string {
    const digits = moneyDigits(c);
    if (Math.abs(v) < 0.5 * 10 ** -digits) return fmtMoney(0, c);
    return `${v > 0 ? "+" : MINUS}${fmtMoney(Math.abs(v), c)}`;
}

export function fmtBtc(v: number): string {
    return `${v.toLocaleString("ko-KR", { minimumFractionDigits: 6, maximumFractionDigits: 6 })} BTC`;
}

/** 부호 있는 퍼센트. v는 소수(0.05 = 5%). */
export function fmtPct(v: number, digits = 2): string {
    const scaled = v * 100;
    const rounded = Number(scaled.toFixed(digits));
    if (rounded === 0) return `${(0).toFixed(digits)}%`;
    return `${rounded > 0 ? "+" : MINUS}${Math.abs(rounded).toFixed(digits)}%`;
}

export function fmtLev(v: number | null): string {
    if (v === null || !Number.isFinite(v)) return "—";
    return `${v.toFixed(2)}x`;
}

function trim(n: number, digits: number): string {
    return Number(n.toFixed(digits)).toLocaleString("ko-KR", { maximumFractionDigits: digits });
}

/** 축 눈금용 축약: 1.43억 / 8,500만 / 12.5K / 1.2M */
export function fmtCompact(v: number, c: Currency): string {
    const sign = v < 0 ? MINUS : "";
    const a = Math.abs(v);
    if (c === "KRW") {
        if (a >= 1e8) return `${sign}${trim(a / 1e8, 3)}억`;
        if (a >= 1e4) return `${sign}${trim(a / 1e4, 0)}만`;
        return `${sign}${trim(a, 0)}`;
    }
    if (a >= 1e6) return `${sign}${trim(a / 1e6, 2)}M`;
    if (a >= 1e3) return `${sign}${trim(a / 1e3, 1)}K`;
    return `${sign}${trim(a, 2)}`;
}

/** 입력칸 아래 한글 단위 힌트: 1억 4,250만원 */
export function koreanUnit(v: number): string {
    if (!Number.isFinite(v) || v <= 0) return "";
    const eok = Math.floor(v / 1e8);
    const man = Math.floor((v % 1e8) / 1e4);
    const rest = Math.round(v % 1e4);
    const parts: string[] = [];
    if (eok) parts.push(`${eok.toLocaleString("ko-KR")}억`);
    if (man) parts.push(`${man.toLocaleString("ko-KR")}만`);
    if (rest && !eok) parts.push(rest.toLocaleString("ko-KR"));
    return parts.length ? `${parts.join(" ")}원` : "";
}
