import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchMovies } from "../api/tmdb";

export default function Navbar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const nav = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, []);

  // debounce
  useEffect(() => {
    if (!q) {
      setResults([]);
      return;
    }
    let c = false;
    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchMovies(q, 1);
        if (!c) setResults(res.results.slice(0, 8));
      } finally {
        if (!c) setLoading(false);
      }
    }, 350);
    return () => {
      c = true;
      clearTimeout(t);
    };
  }, [q]);

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="text-purple-500 font-bold text-3xl select-none">
          Movies <span className="text-white">Hub</span>
        </a>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#trending" className="hover:text-purple-400">
            Trending
          </a>
          <a href="#popular" className="hover:text-purple-400">
            Popular
          </a>
          <a href="#top-rated" className="hover:text-purple-400">
            Top Rated
          </a>
        </nav>

        <div className="hidden md:block relative" ref={ref}>
          <input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search movies..."
            className="bg-neutral-800/80 text-white pl-4 pr-9 py-2 rounded-full text-sm w-48 focus:w-72 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
          <div className="pointer-events-none absolute right-3 top-2.5 text-neutral-400">
            {loading ? (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>

          {open && (
            <div className="absolute mt-2 right-0 w-80 max-w-[calc(100vw-2rem)] bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
              {loading ? (
                <div className="p-4 text-center text-neutral-400 text-sm">
                  Searching…
                </div>
              ) : results.length ? (
                <ul className="divide-y divide-neutral-700">
                  {results.map((m) => (
                    <li key={m.id} className="hover:bg-neutral-700">
                      <button
                        onClick={() => {
                          setOpen(false);
                          setQ("");
                          nav(`/movie/${m.id}`);
                        }}
                        className="flex items-center p-3 w-full text-left gap-3"
                      >
                        <div className="w-10 h-14 bg-neutral-700 rounded overflow-hidden flex-shrink-0">
                          {m.poster_path ? (
                            <img
                              src={`https://image.tmdb.org/t/p/w92${m.poster_path}`}
                              alt={m.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-500 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate">
                            {m.title}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {(m.release_date || "").slice(0, 4) || "—"}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : q ? (
                <div className="p-4 text-center text-neutral-400 text-sm">
                  No movies found…
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
