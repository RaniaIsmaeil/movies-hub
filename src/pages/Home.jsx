import React, { useEffect } from "react";
import usePaged from "../hooks/usePaged.js";
import { getPopular, getTopRated, getTrending } from "../api/tmdb.js";
import Section from "../components/Section.jsx";
import { useLocation } from "react-router-dom";

export default function Home() {
  const trending = usePaged((p) => getTrending(p), []);
  const popular = usePaged((p) => getPopular(p), []);
  const top = usePaged((p) => getTopRated(p), []);
  const location = useLocation();

  useEffect(() => {
    const id = (location.hash || "").slice(1);
    if (!id) return;
    const ready = !trending.loading && !popular.loading && !top.loading;
    if (!ready) return;
    let tries = 0;
    const maxTries = 40;
    const stepMs = 50;
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (tries < maxTries) {
        tries++;
        setTimeout(tryScroll, stepMs);
      }
    };
    requestAnimationFrame(tryScroll);
  }, [location.hash, trending.loading, popular.loading, top.loading]);

  return (
    <div className="pb-16">
      <div className="container mx-auto px-4 mt-6">
        <div className="rounded-2xl bg-gradient-to-r from-purple-600/30 to-fuchsia-600/20 p-6 ring-1 ring-purple-500/20">
          <h1 className="text-3xl font-extrabold">Discover movies</h1>
          <p className="text-neutral-300 mt-1">
            Trending, popular, and top-rated. Search anything from the navbar.
          </p>
        </div>
      </div>

      <Section
        id="trending"
        title="Trending Today"
        loading={trending.loading}
        error={trending.error}
        results={trending.data.results}
        page={trending.page}
        onPrev={() => trending.setPage(Math.max(1, trending.page - 1))}
        onNext={() =>
          trending.setPage(
            Math.min(trending.data.total_pages, trending.page + 1)
          )
        }
        totalPages={trending.data.total_pages}
      />
      <Section
        id="popular"
        title="Popular"
        loading={popular.loading}
        error={popular.error}
        results={popular.data.results}
        page={popular.page}
        onPrev={() => popular.setPage(Math.max(1, popular.page - 1))}
        onNext={() =>
          popular.setPage(Math.min(popular.data.total_pages, popular.page + 1))
        }
        totalPages={popular.data.total_pages}
      />
      <Section
        id="top-rated"
        title="Top Rated"
        loading={top.loading}
        error={top.error}
        results={top.data.results}
        page={top.page}
        onPrev={() => top.setPage(Math.max(1, top.page - 1))}
        onNext={() => top.setPage(Math.min(top.data.total_pages, top.page + 1))}
        totalPages={top.data.total_pages}
      />
    </div>
  );
}
