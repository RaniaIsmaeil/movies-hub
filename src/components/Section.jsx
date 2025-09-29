import React from "react";
import MovieGrid from "./MovieGrid.jsx";

export default function Section({ id, title, loading, error, results, page, onPrev, onNext, totalPages }) {
  return (
    <section id={id} className="container mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <div className="flex items-center gap-2 text-sm">
          <button onClick={onPrev} disabled={page<=1} className="px-2 py-1 rounded bg-neutral-800 disabled:opacity-50">Prev</button>
          <span className="text-neutral-400">Page {page} / {totalPages}</span>
          <button onClick={onNext} disabled={page>=totalPages} className="px-2 py-1 rounded bg-neutral-800 disabled:opacity-50">Next</button>
        </div>
      </div>

      {loading ? (
        <div className="text-neutral-400">Loading…</div>
      ) : error ? (
        <div className="text-red-400">Failed to load.</div>
      ) : (
        <MovieGrid items={results} />
      )}
    </section>
  );
}
