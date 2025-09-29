import React from "react";
import MovieCard from "./MovieCard.jsx";

export default function MovieGrid({ items = [] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map(m => <MovieCard key={m.id} movie={m} />)}
    </div>
  );
}
