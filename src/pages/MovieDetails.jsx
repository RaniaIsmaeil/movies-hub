import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getMovie } from "../api/tmdb";

export default function MovieDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getMovie(id);
        if (!cancelled) setData(res);
      } catch (e) {
        if (!cancelled) setErr(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10 text-neutral-400">Loading…</div>
    );
  }
  if (err) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-red-400 mb-4">Failed to load this movie.</p>
        <Link to="/" className="text-purple-400 hover:underline">← Back</Link>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-10">
        <p className="text-neutral-300 mb-4">Movie not found.</p>
        <Link to="/" className="text-purple-400 hover:underline">← Back</Link>
      </div>
    );
  }

  const poster = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-purple-400 hover:underline">← Back</Link>
      <div className="mt-6 grid md:grid-cols-[200px,1fr] gap-6">
        <div className="bg-neutral-900 rounded-lg overflow-hidden aspect-[2/3]">
          {poster ? (
            <img src={poster} alt={data.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-500">
              No Image
            </div>
          )}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-neutral-400 mt-1">
            {(data.release_date || "").slice(0, 4)}{data.runtime ? ` • ${data.runtime}m` : ""}
          </p>
          <p className="mt-4 text-neutral-200 leading-relaxed">{data.overview}</p>
          {Array.isArray(data.genres) && data.genres.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {data.genres.map(g => (
                <span key={g.id} className="text-xs bg-neutral-800 px-2 py-1 rounded">
                  {g.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
