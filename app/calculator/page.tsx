import { Suspense } from "react";
import type { Metadata } from "next";
import Sidebar from "@/components/layout/Sidebar";
import ReentryCalculator from "@/components/calculator/ReentryCalculator";

export const metadata: Metadata = {
    title: "BTC 재진입 계산기 | 태리아빠의 지식창고",
    description: "손실·이익 포지션을 정리한 뒤 가격 변동 후 재진입할 때 비트코인 포지션 규모가 어떻게 달라지는지 계산합니다.",
};

export default function CalculatorPage() {
    return (
        <main className="min-h-screen bg-protoss-bg pl-16 md:pl-20">
            <Suspense fallback={<div className="fixed left-0 top-0 h-full w-16 md:w-20 bg-protoss-bg border-r border-protoss-border" />}>
                <Sidebar />
            </Suspense>
            <ReentryCalculator />
        </main>
    );
}
