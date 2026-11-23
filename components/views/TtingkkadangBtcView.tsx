import { ReactNode } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { AlertTriangle, ArrowLeft, BookOpen, ExternalLink, TrendingDown } from "lucide-react";
import { FibTimeFigure, RiskRewardFigure } from "./TtingkkadangFigures";
import LevelCandleChart from "./LevelCandleChart";

/* ------------------------------------------------------------------ */
/* 사실 / 해석 / 의견 라벨                                                 */
/* ------------------------------------------------------------------ */

type Kind = "fact" | "interp" | "opinion";

const KIND: Record<Kind, { label: string; desc: string; cls: string }> = {
    fact: {
        label: "사실",
        desc: "원작자 게시물·차트에 나온 내용",
        cls: "border-protoss-accent-blue/40 bg-protoss-accent-blue/10 text-protoss-accent-blue",
    },
    interp: {
        label: "해석",
        desc: "게시물들을 종합해 읽어낸 내용",
        cls: "border-protoss-accent-gold/40 bg-protoss-accent-gold/10 text-protoss-accent-gold",
    },
    opinion: {
        label: "의견",
        desc: "정리자의 판단 (원작자 발언 아님)",
        cls: "border-violet-400/40 bg-violet-400/10 text-violet-300",
    },
};

function KindBadge({ kind }: { kind: Kind }) {
    return (
        <span className={clsx("inline-flex flex-none items-center rounded border px-2 py-0.5 font-mono text-[11px] font-bold", KIND[kind].cls)}>
            {KIND[kind].label}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* 콘텐츠                                                                */
/* ------------------------------------------------------------------ */

const AUTHOR_URL = "https://x.com/unknowntrader0";

const SRC = {
    planRevised: "https://x.com/unknowntrader0/status/2121777347204731312",
    maginot: "https://x.com/unknowntrader0/status/2124042048286458289",
    rrTimezone: "https://x.com/unknowntrader0/status/2121854597736329280",
    firstBuy: "https://x.com/unknowntrader0/status/2121855321161527493",
    leadingFive: "https://x.com/unknowntrader0/status/2121746065208815730",
    cowen200w: "https://x.com/unknowntrader0/status/2122340401004867799",
    band71_63: "https://x.com/unknowntrader0/status/2117308723815407932",
} as const;

const TARGET_HISTORY: { date: string; target: string; quote?: string; note?: string; href?: string }[] = [
    { date: "2026-08-20", target: "CVDD 48K", quote: "9~11월 그 어디선가. CVDD는 48k" },
    { date: "2026-11-02", target: "71~63K", note: "주봉 밴드 지표 하단 녹색 구간(71,738~63,471)", href: SRC.band71_63 },
    {
        date: "2026-11-14",
        target: "63K → 5만 달러대로 하향",
        quote: "63K가 바텀이겠거니 했는데 앞자리 5를 봐야 직성이 풀리나봄",
        href: SRC.leadingFive,
    },
    {
        date: "2026-11-15",
        target: "53~49K",
        quote: "계획을 수정. 53~49K사이. CVDD를 다시 간다는 생각",
        note: "차트에 −23.6%, 약 47.8K 측정",
        href: SRC.planRevised,
    },
    { date: "2026-11-16", target: "보조 근거", note: "벤자민 코웬: 과거 저점은 200주 이평 대비 약 −30%", href: SRC.cowen200w },
    {
        date: "2026-11-21",
        target: "마지노선 49~47K",
        quote: "30k까지는 안갈것 같아요. CVDD를 살짝 깨는 선이 마지노선… 49~7K정도?",
        href: SRC.maginot,
    },
];

const EVIDENCE: { title: string; term: string; desc?: ReactNode; figures: { k: string; v: string }[]; fig1?: boolean; figure?: ReactNode }[] = [
    {
        title: "CVDD",
        term: "term-cvdd",
        fig1: true,
        desc: "핵심 기준. 매집 기준점.",
        figures: [
            { k: "상단 (11/15 차트)", v: "약 58,900" },
            { k: "하단 (11/15 차트)", v: "약 49,100" },
        ],
    },
    {
        title: "4Y Realized Price Risk/Reward 지표",
        term: "term-realized",
        figure: <RiskRewardFigure />,
        desc: <q>과거에는 R/R이 90을 넘으면 가속화됐다.</q>,
        figures: [
            { k: "11/14 기준", v: "93.5" },
            { k: "목표선", v: "98.57" },
        ],
    },
    {
        title: "피보나치 타임존",
        term: "term-fib-time",
        figure: <FibTimeFigure />,
        desc: <q>저점 형성 구간은 0.618~0.786.</q>,
        figures: [
            { k: "11/16 주", v: "0.65 진입" },
            { k: "0.786 (차트상)", v: "2027년 5월 전후" },
        ],
    },
    {
        title: "가격 레벨 (11/15 차트)",
        term: "term-fib-retrace",
        fig1: true,
        figures: [
            { k: "6월 저점", v: "57,737" },
            { k: "피보나치 0.382", v: "56,625" },
            { k: "피보나치 0.5", v: "44,204" },
        ],
    },
    {
        title: "200주 이평 −30%",
        term: "term-200w",
        fig1: true,
        figures: [
            { k: "200주 이평 (11/15)", v: "약 67,960" },
            { k: "× 0.7", v: "≈ 47,600" },
        ],
    },
];

const CONVICTION: { range: string; stance: string; cls: string }[] = [
    { range: "53~49K", stance: "기본 시나리오", cls: "border-protoss-accent-gold/50 text-protoss-accent-gold" },
    { range: "47K 하회", stance: "낮게 봄", cls: "border-slate-500/60 text-slate-300" },
    { range: "30K", stance: "부정", cls: "border-slate-700 text-slate-500" },
];

const CONFLUENCE: { title: string; value: string }[] = [
    { title: "CVDD 하단", value: "≈ 49.1K" },
    { title: "−23.6% 측정", value: "≈ 47.8K" },
    { title: "200주 이평 −30%", value: "≈ 47.6K" },
];

const GLOSSARY: { id: string; term: string; aka?: string; body: ReactNode }[] = [
    {
        id: "term-cvdd",
        term: "CVDD",
        aka: "Cumulative Value-Days Destroyed",
        body: (
            <>
                윌리 우(Willy Woo)가 만든 비트코인 온체인 지표. 코인이 움직일 때 ‘보유 일수 × 수량’(Coin Days Destroyed)에 그 시점
                가격을 곱한 값을 누적하고, 이를 시장 나이(일수)와 상수(6,000,000)로 나눠 가격 단위로 바꾼다. 과거 약세장 바닥에서 가격이 이
                선 근처까지 내려온 사례가 있어 ‘바닥 지지선’으로 쓰인다. 이 페이지의 상단·하단 값은 원작자 차트에 그려진 CVDD 밴드 기준이다.
            </>
        ),
    },
    {
        id: "term-200w",
        term: "200주 이동평균",
        aka: "200-week moving average",
        body: (
            <>
                최근 200개 주봉 종가의 평균(약 3.8년). 비트코인의 4년 주기와 길이가 비슷해 장기 추세선으로 많이 쓰이며, 과거 약세장 바닥은
                이 선 근처나 아래에서 만들어진 경우가 많았다. 벤자민 코웬(암호화폐 분석가·유튜버)은 과거 저점이 이 선보다 약 30% 아래였다고
                짚었고(원작자 11/16 인용), 이 페이지의 ‘200주 이평 −30%’는 그 비율을 11/15 값에 적용한 것이다.
            </>
        ),
    },
    {
        id: "term-realized",
        term: "Realized Price · R/R 지표",
        aka: "4Y Realized Price Risk/Reward",
        body: (
            <>
                Realized Price(실현가격)는 각 코인을 마지막으로 온체인에서 옮긴 시점의 가격으로 평가한 시가총액(실현 시가총액)을 유통량으로
                나눈 값으로, 시장 전체의 평균 취득단가에 가깝다. ‘4Y Realized Price Risk/Reward’는 이를 바탕으로 위험 대비 보상 정도를
                수치로 나타낸 차트 지표로 보이며, 정확한 산식과 눈금 기준은 게시물에 설명되어 있지 않다.
            </>
        ),
    },
    {
        id: "term-fib-time",
        term: "피보나치 타임존",
        aka: "Fibonacci time zones",
        body: (
            <>
                가격이 아니라 시간 축에 피보나치 비율을 적용하는 도구. 기준이 되는 기간(예: 앞선 고점에서 저점까지)을 1로 놓고, 그 기간의
                0.618배·0.786배 등이 되는 시점을 변곡 후보로 표시한다. 원작자는 0.618~0.786을 저점 형성 구간으로 본다. 어느 기간을 기준으로
                잡았는지는 원문 차트에서 확인해야 한다.
            </>
        ),
    },
    {
        id: "term-fib-retrace",
        term: "피보나치 되돌림",
        aka: "Fibonacci retracement · 0.382 / 0.5",
        body: (
            <>
                직전 큰 움직임의 폭을 1로 놓고, 그 폭의 38.2%·50% 등만큼 되돌린 가격을 지지·저항 후보로 보는 방법. 0.5는 엄밀히 피보나치
                비율은 아니지만 관례적으로 함께 쓴다. 0.382(56,625)와 0.5(44,204)를 어느 구간에 그었는지는 게시물에 나오지 않는다.
            </>
        ),
    },
    {
        id: "term-weekly-close",
        term: "주봉 종가",
        aka: "weekly close",
        body: (
            <>
                한 주 캔들이 마감될 때의 가격. 트레이딩뷰와 주요 거래소의 비트코인 주봉은 보통 UTC 월요일 00:00, 한국 시간 월요일 오전 9시에
                마감한다. ‘주봉 종가 이탈’은 주중에 잠깐 밑으로 내려가는 것이 아니라 한 주가 그 선 아래에서 끝나는 것을 말한다.
            </>
        ),
    },
    {
        id: "term-split-buy",
        term: "분할 매집",
        body: (
            <>
                한 번에 사지 않고 가격대나 시점을 나눠 여러 번 사는 방식. 바닥을 정확히 맞히지 못해도 평균 단가를 관리하려는 목적이다.
                원작자는 CVDD를 기준점으로 3~4회에 나눠 산다고 밝혔다.
            </>
        ),
    },
    {
        id: "term-accumulation",
        term: "Accumulation zone",
        aka: "매집 구간",
        body: (
            <>
                하락 뒤 가격이 박스권에서 횡보하는 동안 장기 매수세가 물량을 모으는 구간을 가리키는 표현으로, 와이코프 이론의
                매집(Accumulation) 단계에서 나왔다. 11/22 게시물의 이 표현은 비트코인이 아닌 AAVE 차트에 대한 것이다.{" "}
                <Link href="/report/STRAT-002" className="text-protoss-accent-blue underline-offset-4 hover:underline">
                    와이코프 패턴 글 보기
                </Link>
            </>
        ),
    },
];

const SOURCES: { date: string; label: string; href: string }[] = [
    { date: "11/15", label: "계획 수정", href: SRC.planRevised },
    { date: "11/21", label: "마지노선", href: SRC.maginot },
    { date: "11/15", label: "R/R·피보나치 타임존", href: SRC.rrTimezone },
    { date: "11/15", label: "1차 매수·분할 매집", href: SRC.firstBuy },
    { date: "11/14", label: "앞자리 5", href: SRC.leadingFive },
    { date: "11/16", label: "코웬 200주 이평", href: SRC.cowen200w },
    { date: "11/02", label: "71~63K", href: SRC.band71_63 },
];

/* ------------------------------------------------------------------ */
/* 작은 UI 조각                                                          */
/* ------------------------------------------------------------------ */

function ExtLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={clsx("inline-flex items-center gap-1 text-protoss-accent-blue underline-offset-4 hover:underline", className)}
        >
            {children}
            <ExternalLink className="h-3 w-3 flex-none" aria-hidden="true" />
            <span className="sr-only">(새 탭에서 열림)</span>
        </a>
    );
}

function Section({
    kind,
    title,
    sub,
    id,
    className,
    children,
}: {
    kind?: Kind;
    title: string;
    sub?: string;
    id?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <section id={id} className={clsx("min-w-0 scroll-mt-6 rounded-xl border border-protoss-border bg-protoss-card p-4 sm:p-6", className)}>
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1">
                <h2 className="font-mono text-base font-bold text-white sm:text-lg">{title}</h2>
                {kind && <KindBadge kind={kind} />}
                {sub && <span className="font-mono text-[11px] text-slate-500">{sub}</span>}
            </div>
            {children}
        </section>
    );
}

function Bullet({ children }: { children: ReactNode }) {
    return (
        <li className="flex gap-2.5 break-keep leading-relaxed">
            <span className="mt-[0.6em] h-1.5 w-1.5 flex-none rounded-full bg-protoss-accent-blue" aria-hidden="true" />
            <div className="min-w-0">{children}</div>
        </li>
    );
}

/* ------------------------------------------------------------------ */
/* 메인                                                                 */
/* ------------------------------------------------------------------ */

export default function TtingkkadangBtcView() {
    return (
        <div className="mx-auto w-full max-w-[1800px] space-y-6 p-4 md:p-8">
            <Link
                href="/"
                className="inline-flex items-center font-mono text-sm text-slate-500 transition-colors hover:text-protoss-accent-blue"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                BACK TO TERMINAL
            </Link>

            <div className="grid gap-6 xl:grid-cols-2 xl:items-start">
                <div className="space-y-5">
                    {/* 헤더 */}
                    <header className="space-y-3">
                        <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
                            <TrendingDown className="h-4 w-4 text-protoss-accent-gold" />
                            VIEWS // BTC DOWNSIDE
                        </div>
                        <h1 className="break-keep font-mono text-2xl font-bold tracking-tight text-white md:text-3xl">
                            띵까당의 비트코인 <span className="text-protoss-accent-blue">하방 관점</span> 정리
                        </h1>
                        <p className="text-sm text-slate-400">
                            원작자: 띵까당{" "}
                            <ExtLink href={AUTHOR_URL} className="font-mono">
                                @unknowntrader0
                            </ExtLink>
                        </p>
                    </header>

                    {/* 고지 */}
                    <div className="flex gap-2.5 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm leading-relaxed text-amber-200">
                        <AlertTriangle className="mt-0.5 h-4 w-4 flex-none text-amber-400" aria-label="고지" />
                        <p className="break-keep">
                            <strong className="font-mono">기준 시점: 2026-11-23 KST</strong> · 원작자 게시물 기준 요약이며 투자 권유가 아닙니다.
                            원문과 다를 경우 원문이 우선합니다.
                        </p>
                    </div>

                    {/* 라벨 범례 */}
                    <ul className="flex flex-col gap-2 text-xs text-slate-400 sm:flex-row sm:flex-wrap sm:gap-x-5" aria-label="라벨 설명">
                        {(Object.keys(KIND) as Kind[]).map((k) => (
                            <li key={k} className="flex items-center gap-2">
                                <KindBadge kind={k} />
                                {KIND[k].desc}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 한 줄 요약 */}
                <div className="rounded-r-xl border-l-4 border-protoss-accent-gold bg-protoss-card p-5 sm:p-8">
                    <h2 className="mb-3 font-mono text-sm font-bold uppercase tracking-widest text-protoss-accent-gold">한 줄 요약</h2>
                    <p className="break-keep font-serif text-lg leading-relaxed text-slate-200 sm:text-xl">
                        띵까당은 비트코인 하방을 <strong className="text-white">약 47~53K 달러</strong>까지 열어두고 있으며, 바닥 시점 창은{" "}
                        <strong className="text-white">2027년 봄 전후</strong>까지 본다. 확률을 수치로 제시하지 않고, CVDD를 기준으로 3~4회
                        분할 매집 중이다.
                    </p>
                </div>
            </div>

            {/* 차트 (전체 폭) */}
            <Section kind="fact" title="차트로 보기" sub="바이낸스 실제 주봉 + 게시물 수치 · USD">
                <p className="mb-4 max-w-4xl break-keep text-sm leading-relaxed text-slate-400">
                    실제 비트코인 주봉 캔들 위에 원작자의 목표 구간, CVDD 밴드, 근거 레벨(근거 1·4·5)과 피보나치 타임존 구간을 겹쳤습니다. 구간
                    이름은 구간 안에, 레벨 이름은 오른쪽 가격 축 옆에 있습니다. 용어 뜻은{" "}
                    <a href="#glossary" className="text-protoss-accent-blue underline-offset-4 hover:underline">
                        용어 설명
                    </a>
                    에 있습니다.
                </p>
                <LevelCandleChart />
            </Section>

            <div className="grid gap-6 xl:grid-cols-2 xl:items-start">

                {/* 하방 목표 변화 */}
                <Section kind="fact" title="하방 목표 변화" sub="게시물 원문 기준 · 가격 단위 USD">
                    <table className="block w-full text-sm md:table">
                        <thead className="hidden md:table-header-group">
                            <tr className="border-b border-protoss-border text-left font-mono text-xs text-slate-500">
                                <th scope="col" className="py-2 pr-4 font-normal">날짜</th>
                                <th scope="col" className="py-2 pr-4 font-normal">하방 목표</th>
                                <th scope="col" className="py-2 font-normal">근거·원문 요지</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group">
                            {TARGET_HISTORY.map((row) => (
                                <tr
                                    key={row.date}
                                    className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-protoss-border/60 py-3 last:border-b-0 md:table-row"
                                >
                                    <td className="font-mono text-xs text-slate-500 md:whitespace-nowrap md:py-3 md:pr-4 md:align-top">{row.date}</td>
                                    <td className="break-keep font-mono font-semibold text-protoss-accent-gold md:py-3 md:pr-4 md:align-top">
                                        {row.target}
                                    </td>
                                    <td className="w-full break-keep leading-relaxed md:w-auto md:py-3 md:align-top">
                                        {row.quote && <q className="text-slate-200">{row.quote}</q>}
                                        {row.note && (
                                            <span className={clsx("text-slate-400", row.quote && "ml-1")}>
                                                {row.quote ? `(${row.note})` : row.note}
                                            </span>
                                        )}
                                        {row.href && (
                                            <ExtLink href={row.href} className="ml-2 align-baseline font-mono text-[11px]">
                                                원문
                                            </ExtLink>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Section>

                <div className="min-w-0 space-y-6">
                    {/* 확신의 정도 */}
                    <Section kind="interp" title="확신의 정도">
                        <div className="mb-4 grid gap-2 sm:grid-cols-3">
                            {CONVICTION.map((c) => (
                                <div
                                    key={c.range}
                                    className={clsx(
                                        "flex items-baseline justify-between gap-3 rounded-lg border bg-protoss-bg/60 px-3 py-2.5 sm:block sm:p-3 sm:text-center",
                                        c.cls
                                    )}
                                >
                                    <div className="whitespace-nowrap font-mono text-base font-bold">{c.range}</div>
                                    <div className="whitespace-nowrap text-xs sm:mt-0.5">{c.stance}</div>
                                </div>
                            ))}
                        </div>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <Bullet>수치 확률 없음. 53~49K는 기본 시나리오, 47K 하회는 낮게, 30K는 부정.</Bullet>
                            <Bullet>
                                본인 단서(8/21): <q className="text-slate-200">사이클 바텀에서의 지표들 역시 반드시 지켜지리란 법이 없음.</q>
                            </Bullet>
                            <Bullet>
                                행동: 11/14 1차 매수, 총 3~4회 분할, 기준점 CVDD(11/15). <q className="text-slate-200">조정을 사랑하자.</q>
                            </Bullet>
                        </ul>
                        <div className="mt-4 flex flex-col gap-1 rounded-lg border border-protoss-border bg-protoss-bg/60 p-3 text-xs leading-relaxed text-slate-400 sm:flex-row sm:gap-2.5">
                            <span className="flex-none whitespace-nowrap font-mono font-bold text-amber-300">혼동 주의</span>
                            <p className="break-keep">
                                11/22 <q>Accumulation zone은 이제 막 시작, 내년 여름까지</q>는 AAVE 월봉 차트 기준(비트코인 아님).
                            </p>
                        </div>
                    </Section>

                    {/* 판단 재료로 쓸 때 */}
                    <Section kind="opinion" title="판단 재료로 쓸 때">
                        <p className="mb-3 break-keep text-sm text-slate-300">
                            아래 세 값이 <strong className="text-white">47~53K</strong>에 겹친다.
                        </p>
                        <div className="mb-5 grid gap-2 sm:grid-cols-3">
                            {CONFLUENCE.map((c) => (
                                <div
                                    key={c.title}
                                    className="flex items-baseline justify-between gap-3 rounded-lg border border-protoss-border bg-protoss-bg/60 p-3 sm:block"
                                >
                                    <div className="text-xs text-slate-500">{c.title}</div>
                                    <div className="font-mono text-lg font-semibold text-protoss-accent-gold sm:mt-1">{c.value}</div>
                                </div>
                            ))}
                        </div>
                        <ul className="space-y-3 text-sm text-slate-300">
                            <Bullet>
                                <span className="font-bold text-white">반대 시나리오</span>: 47K 하회 시 다음 레벨은 언급 없음. 차트상 다음 지지는 피보나치
                                0.5(≈44.2K). CVDD 하단 주봉 종가 이탈 = 프레임 무효화.
                            </Bullet>
                            <Bullet>
                                목표가가 3주간 두 번 하향됨 → <q className="text-slate-200">바닥 가격</q>보다{" "}
                                <q className="text-slate-200">분할 매집 시작 구간</q>으로 읽는 것이 의도에 가깝다.
                            </Bullet>
                        </ul>
                    </Section>
                </div>
            </div>

            {/* 근거 */}
            <Section kind="fact" title="근거" sub="카드의 “그림 1”은 위 차트, “용어”는 아래 용어 설명으로 이동">
                <ol className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {EVIDENCE.map((e, i) => (
                        <li key={e.title} className="rounded-lg border border-protoss-border bg-protoss-bg/60 p-4">
                            <div className="flex items-start gap-2">
                                <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full border border-protoss-accent-blue/50 font-mono text-[11px] text-protoss-accent-blue">
                                    {i + 1}
                                </span>
                                <h3 className="min-w-0 flex-1 break-keep pt-0.5 font-mono text-sm font-bold text-white">{e.title}</h3>
                                <div className="flex flex-none items-center gap-1.5 pt-0.5">
                                    {e.fig1 && (
                                        <a
                                            href="#fig-levels"
                                            className="rounded border border-protoss-border px-1.5 py-0.5 font-mono text-[10px] text-slate-400 transition-colors hover:border-protoss-accent-blue/50 hover:text-protoss-accent-blue"
                                        >
                                            그림 1
                                        </a>
                                    )}
                                    <a
                                        href={`#${e.term}`}
                                        className="inline-flex items-center gap-1 rounded border border-protoss-border px-1.5 py-0.5 text-[10px] text-slate-400 transition-colors hover:border-protoss-accent-blue/50 hover:text-protoss-accent-blue"
                                    >
                                        <BookOpen className="h-3 w-3" aria-hidden="true" />
                                        용어
                                    </a>
                                </div>
                            </div>
                            {e.desc && <p className="mt-2 break-keep text-sm leading-relaxed text-slate-300">{e.desc}</p>}
                            <dl className="mt-3 space-y-1.5 text-sm">
                                {e.figures.map((f) => (
                                    <div key={f.k} className="flex items-baseline justify-between gap-3 border-t border-protoss-border/60 pt-1.5">
                                        <dt className="break-keep text-xs text-slate-500">{f.k}</dt>
                                        <dd className="text-right font-mono text-protoss-accent-gold">{f.v}</dd>
                                    </div>
                                ))}
                            </dl>
                            {e.figure}
                        </li>
                    ))}
                </ol>
            </Section>


            {/* 용어 설명 */}
            <Section id="glossary" title="용어 설명" sub="일반적인 정의 · 원작자 설명 아님">
                <dl className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {GLOSSARY.map((g) => (
                        <div key={g.id} id={g.id} className="scroll-mt-6 rounded-lg border border-protoss-border bg-protoss-bg/60 p-4 target:border-protoss-accent-blue/60">
                            <dt className="break-keep">
                                <span className="font-mono text-sm font-bold text-white">{g.term}</span>
                                {g.aka && <span className="ml-2 font-mono text-[11px] text-slate-500">{g.aka}</span>}
                            </dt>
                            <dd className="mt-2 break-keep text-sm leading-relaxed text-slate-300">{g.body}</dd>
                        </div>
                    ))}
                </dl>
            </Section>

            {/* 출처 */}
            <Section title="출처" sub="모두 X(트위터) 게시물 · 새 탭에서 열림">
                <ul className="grid gap-x-8 text-sm sm:grid-cols-2 xl:grid-cols-4">
                    {SOURCES.map((s) => (
                        <li key={s.href} className="flex items-baseline gap-3 border-b border-protoss-border/60 py-2.5">
                            <span className="w-11 flex-none font-mono text-xs text-slate-500">{s.date}</span>
                            <ExtLink href={s.href} className="min-w-0 break-keep">
                                {s.label}
                            </ExtLink>
                        </li>
                    ))}
                </ul>
            </Section>
        </div>
    );
}
