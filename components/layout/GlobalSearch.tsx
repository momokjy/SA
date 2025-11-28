"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { archives } from "@/data";
import { Article } from "@/data/types";

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = archives.filter((article) => {
      return (
        article.title.toLowerCase().includes(lowerQuery) ||
        article.content.toLowerCase().includes(lowerQuery) ||
        article.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
    setResults(filtered.slice(0, 5)); // Limit to 5 results
  }, [query]);

  const handleSelect = (id: string) => {
    router.push(`/report/${id}`);
    onClose();
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/80 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-protoss-bg border border-protoss-accent-blue/50 rounded-xl shadow-[0_0_30px_rgba(0,240,255,0.1)] overflow-hidden flex flex-col">
        <div className="flex items-center px-4 py-3 border-b border-protoss-border">
          <Search className="w-5 h-5 text-protoss-accent-blue mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search archives..."
            className="flex-1 bg-transparent border-none outline-none text-protoss-text placeholder-slate-600 font-mono text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-500 hover:text-white" />
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-[60vh] overflow-y-auto py-2">
            {results.map((article) => (
              <button
                key={article.id}
                onClick={() => handleSelect(article.id)}
                className="w-full text-left px-4 py-3 hover:bg-protoss-card transition-colors flex items-start group border-l-2 border-transparent hover:border-protoss-accent-blue"
              >
                <FileText className="w-4 h-4 text-slate-500 mt-1 mr-3 group-hover:text-protoss-accent-blue" />
                <div>
                  <div className="text-sm font-bold text-protoss-text group-hover:text-white font-mono">
                    {article.title}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-1">
                    {article.coreThesis}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {article.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] bg-protoss-card border border-protoss-border px-1.5 py-0.5 rounded text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {query && results.length === 0 && (
          <div className="p-8 text-center text-slate-500 font-mono text-sm">
            No results found.
          </div>
        )}

        {!query && (
          <div className="p-4 text-xs text-slate-600 font-mono text-center">
            Type to search the entire archive database.
          </div>
        )}
      </div>
    </div>
  );
}
