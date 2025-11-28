import { Suspense } from "react";
import Sidebar from "@/components/layout/Sidebar";
import BentoGrid from "@/components/dashboard/BentoGrid";

export default function Home({ searchParams }: { searchParams: { filter?: string } }) {
    return (
        <main className="min-h-screen bg-protoss-bg pl-16 md:pl-20">
            <Suspense fallback={<div className="fixed left-0 top-0 h-full w-16 md:w-20 bg-protoss-bg border-r border-protoss-border" />}>
                <Sidebar />
            </Suspense>
            <BentoGrid filter={searchParams.filter} />
        </main>
    );
}
