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
-   `components/`: UI Components.
    -   `layout/`: Sidebar, Global Search.
    -   `dashboard/`: Bento Grid, Cards.
    -   `report/`: Article Renderer.
    -   `widgets/`: Interactive widgets (Tax Calc, Coffee Slider, RWA Visualizer).
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
