import { volume1 } from "./volume1";
import { volume2 } from "./volume2";
import { volume3 } from "./volume3";
import { volume4 } from "./volume4";
import { volume5 } from "./volume5";
import { Article } from "./types";

export const archives: Article[] = [
    ...volume1,
    ...volume2,
    ...volume3,
    ...volume4,
    ...volume5,
];

export const getArticleById = (id: string): Article | undefined => {
    return archives.find((article) => article.id === id);
};

export const getArticlesByVolume = (volume: number): Article[] => {
    return archives.filter((article) => article.volume === volume);
};
