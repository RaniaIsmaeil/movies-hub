import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../api/tmdb";

export default function Navbar() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false); // search dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile menu panel
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const nav = useNavigate();

  const searchRefDesktop = useRef(null);
  const searchRefMobile = useRef(null);
  const mobilePanelRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    if (!open && !mobileOpen) return; // only when something is open

    const onDoc = (e) => {
      if (toggleRef.current && toggleRef.current.contains(e.target)) return;

      const inDesktop = searchRefDesktop.current?.contains(e.target);
      const inMobile = searchRefMobile.current?.contains(e.target);
      if (!inDesktop && !inMobile) setOpen(false);

      if (
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(e.target)
      ) {
        setMobileOpen(false);
      }
    };

    const onEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMobileOpen(false);
      }
    };

    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open, mobileOpen]);

  useEffect(() => {
    const body = document.body;
    if (mobileOpen) {
      const prev = body.style.overflow;
      body.style.overflow = "hidden";
      return () => {
        body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    const query = q.trim();

    if (!query) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    let alive = true;

    const t = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await searchMovies(query, 1, { signal: controller.signal });
        if (alive) setResults((res?.results ?? []).slice(0, 8));
      } catch {
      } finally {
        if (alive) setLoading(false);
      }
    }, 350);

    return () => {
      alive = false;
      controller.abort();
      clearTimeout(t);
    };
  }, [q]);

  const handlePick = (id) => {
    setOpen(false);
    setMobileOpen(false);
    setQ("");
    nav(`/movie/${id}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" className="text-purple-500 font-bold text-3xl select-none">
          Movies <span className="text-white">Hub</span>
        </a>

        {/* Desktop nav */}
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

        {/* Desktop search */}
        <div className="hidden md:block relative" ref={searchRefDesktop}>
          <input
            value={q}
            onChange={(e) => {
              const v = e.target.value;
              setQ(v);
              setOpen(true);
              if (!v.trim()) {
                setResults([]);
                setLoading(false);
              }
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search movies..."
            className="bg-neutral-800/80 text-white pl-4 pr-9 py-2 rounded-full text-sm w-48 focus:w-72 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            aria-label="Search movies"
          />
          <div className="pointer-events-none absolute right-3 top-2.5 text-neutral-400">
            {loading && q ? (
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8"
                />
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

          {open && (loading || results.length || q) && (
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
                        onClick={() => handlePick(m.id)}
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

        {/* Hamburger (mobile only) */}
        <button
          ref={toggleRef}
          className="md:hidden p-2 rounded-lg hover:bg-neutral-800/70 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              fill="none"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div
          ref={mobilePanelRef}
          className="md:hidden border-t border-neutral-800 bg-neutral-950/95 backdrop-blur"
        >
          <div className="container mx-auto px-4 py-3 space-y-3">
            {/* mobile search */}
            <div className="relative" ref={searchRefMobile}>
              <input
                value={q}
                onChange={(e) => {
                  const v = e.target.value;
                  setQ(v);
                  setOpen(true);
                  if (!v.trim()) {
                    setResults([]);
                    setLoading(false);
                  }
                }}
                onFocus={() => setOpen(true)}
                placeholder="Search movies…"
                className="bg-neutral-800/80 text-white pl-4 pr-9 py-2 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                aria-label="Search movies"
              />
              <div className="pointer-events-none absolute right-3 top-2.5 text-neutral-400">
                {loading && q ? (
                  <svg
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8"
                    />
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

              {open && (loading || results.length || q) && (
                <div className="absolute mt-2 left-0 right-0 bg-neutral-800 rounded-lg shadow-lg overflow-hidden">
                  {loading ? (
                    <div className="p-4 text-center text-neutral-400 text-sm">
                      Searching…
                    </div>
                  ) : results.length ? (
                    <ul className="divide-y divide-neutral-700">
                      {results.map((m) => (
                        <li key={m.id} className="hover:bg-neutral-700">
                          <button
                            onClick={() => handlePick(m.id)}
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

            {/* mobile links */}
            <nav className="grid gap-2 text-sm">
              <a
                href="#trending"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-purple-400"
              >
                Trending
              </a>
              <a
                href="#popular"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-purple-400"
              >
                Popular
              </a>
              <a
                href="#top-rated"
                onClick={() => setMobileOpen(false)}
                className="py-2 hover:text-purple-400"
              >
                Top Rated
              </a>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
