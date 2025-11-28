export type Article = {
    id: string;
    volume: number;
    category: string;
    title: string;
    coreThesis: string;
    content: string; // HTML string
    tags: string[];
    imageUrl?: string;
};
