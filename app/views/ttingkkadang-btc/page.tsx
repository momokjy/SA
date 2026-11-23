import { Suspense } from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import TtingkkadangBtcView from "@/components/views/TtingkkadangBtcView";

export const metadata: Metadata = {
    title: "띵까당 BTC 하방 관점 | 태리아빠의 지식창고",
    description: "띵까당(@unknowntrader0)의 비트코인 하방 목표(약 47~53K 달러) 변화와 근거를 게시물 원문 기준으로 정리합니다. 투자 권유가 아닙니다.",
};

export default function TtingkkadangBtcPage() {
    return (
        <main className="min-h-screen bg-protoss-bg pl-16 md:pl-20">
            <Suspense fallback={<div className="fixed left-0 top-0 h-full w-16 md:w-20 bg-protoss-bg border-r border-protoss-border" />}>
                <Sidebar />
            </Suspense>
            <TtingkkadangBtcView />
        </main>
    );
}
