import { Suspense } from "react";
import { getArticleById, archives } from "@/data";
import ArticleRenderer from "@/components/report/ArticleRenderer";
import Sidebar from "@/components/layout/Sidebar";
import { notFound } from "next/navigation";

// Generate static params for all articles to enable static export if needed
export async function generateStaticParams() {
    return archives.map((article) => ({
        id: article.id,
    }));
}

export default function ReportPage({ params }: { params: { id: string } }) {
    const article = getArticleById(params.id);

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-protoss-bg pl-16 md:pl-20">
            <Suspense fallback={<div className="fixed left-0 top-0 h-full w-16 md:w-20 bg-protoss-bg border-r border-protoss-border" />}>
                <Sidebar />
            </Suspense>
            <ArticleRenderer article={article} />
        </div>
    );
}
