import React from "react";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  const img = movie.poster_path
    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
    : null;
  return (
    <Link
      to={`/movie/${movie.id}`}
      className="group rounded-xl overflow-hidden bg-neutral-900 ring-1 ring-neutral-800 hover:ring-purple-500/40 transition"
    >
      <div className="aspect-[2/3] bg-neutral-800 relative">
        {img ? (
          <img
            src={img}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-500">
            No Image
          </div>
        )}
        <span className="absolute bottom-2 right-2 text-xs bg-neutral-900/80 px-2 py-0.5 rounded-full">
          {(movie.vote_average ?? 0).toFixed(1)}
        </span>
      </div>
      <div className="p-3">
        <p className="font-medium truncate" title={movie.title}>
          {movie.title}
        </p>
        <p className="text-xs text-neutral-400">
          {(movie.release_date || "").slice(0, 4) || "—"}
        </p>
      </div>
    </Link>
  );
}
