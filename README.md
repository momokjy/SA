# PROTOSS MASTER ARCHIVE

**Institutional-Grade Investment Knowledge Base**

This project is a Next.js 14 application built with TypeScript and Tailwind CSS. It features a "Bloomberg meets Cyberpunk" aesthetic and serves as a high-density research terminal.

## 🚀 Getting Started

Since this project was created in an environment without Node.js, you need to install dependencies first.

1.  **Install Node.js**: Ensure you have Node.js (v18+) installed.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Open Browser**: Navigate to `http://localhost:3000`.

## 📂 Project Structure

-   `app/`: Next.js App Router structure.
    -   `page.tsx`: Main Dashboard (Bento Grid).
    -   `report/[id]/page.tsx`: Dynamic Article View.
    -   `calculator/page.tsx`: BTC 재진입 계산기 (`/calculator`).
-   `components/`: UI Components.
    -   `layout/`: Sidebar, Global Search.
    -   `dashboard/`: Bento Grid, Cards.
    -   `report/`: Article Renderer.
    -   `widgets/`: Interactive widgets (Tax Calc, Coffee Slider, RWA Visualizer).
    -   `calculator/`: BTC 재진입 계산기 UI (입력, 차트, 매트릭스).
-   `lib/btcReentry.ts`: 재진입 계산 엔진 (UI와 분리된 순수 함수).
-   `data/`: **Source of Truth**.
    -   `volume1.ts` ~ `volume5.ts`: Raw data files containing the exact text from the whitepapers.
    -   `index.ts`: Data aggregator and helper functions.

## 🎨 Design System

-   **Fonts**: JetBrains Mono (Data/Headers), Noto Serif KR (Body).
-   **Colors**:
    -   Background: `#0B0F19`
    -   Accent Blue: `#00F0FF`
    -   Accent Gold: `#FFD700`

## 🛠 Features

-   **Dual-Layer UX**: Dashboard for summary, Deep Dive for details.
-   **Global Search**: Cmd+K to search across all articles.
-   **Interactive Widgets**:
    -   Tax Calculator (22% Rule)
    -   Coffee Extraction Slider (Variable Control)
    -   RWA Recursive Leverage Visualizer
-   **BTC 재진입 계산기** (`/calculator`):
    -   현재 수익률(ROE)에서 포지션을 정리 → 가격 변동 → 재진입했을 때 BTC 수량·명목 규모·증거금 변화
    -   롱/숏, 레버리지(격리 마진·청산가), 부분 정리, 부분 재진입, 수수료·슬리피지·세금 반영
    -   보유 유지 대비 평가금 비교, 손익 역전 가격, 원래 수량을 되찾는 재진입가
    -   수익률 × 가격 변동 매트릭스, 업비트(KRW)/바이낸스(USDT) 실시간 가격 불러오기
