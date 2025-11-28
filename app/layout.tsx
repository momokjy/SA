import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-jetbrains-mono"
});

const notoSerifKR = Noto_Serif_KR({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-noto-serif"
});

export const metadata: Metadata = {
    title: "태리아빠의 지식창고",
    description: "Institutional-Grade Investment Knowledge Base",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${jetbrainsMono.variable} ${notoSerifKR.variable} font-sans bg-protoss-bg text-protoss-text antialiased selection:bg-protoss-accent-blue selection:text-black`}>
                {children}
            </body>
        </html>
    );
}
