const BASE = "https://api.themoviedb.org/3";

const bearer = import.meta.env.VITE_TMDB_API_KEY; // v4 Read Access Token

async function request(path, params = {}) {
  const url = new URL(BASE + path);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  }
  const res = await fetch(url, {
    headers: {
      accept: "application/json",
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
  });
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

export async function searchMovies(query, page = 1) {
  if (!bearer) return mockSearch(query, page);
  return request("/search/movie", { query, include_adult: "false", language: "en-US", page });
}

export async function getTrending(page = 1) {
  if (!bearer) return mockList(page, "Trending");
  return request("/trending/movie/day", { page });
}

export async function getPopular(page = 1) {
  if (!bearer) return mockList(page, "Popular");
  return request("/movie/popular", { page });
}

export async function getTopRated(page = 1) {
  if (!bearer) return mockList(page, "Top Rated");
  return request("/movie/top_rated", { page });
}

export async function getMovie(id) {
  if (!bearer) return mockMovie(id);
  return request(`/movie/${id}`);
}

// Mock fallback so project runs without a key
function mockList(page, tag) {
  const results = Array.from({ length: 20 }).map((_, i) => ({
    id: page * 1000 + i,
    title: `${tag} Movie ${i + 1}`,
    release_date: "2024-01-01",
    vote_average: Math.round((Math.random() * 4 + 6) * 10) / 10,
    poster_path: null,
    overview: "Placeholder overview. Add a TMDB token to fetch real data."
  }));
  return Promise.resolve({ page, total_pages: 5, results });
}

function mockSearch(q, page) {
  return mockList(page, `Search: ${q || "query"}`);
}

function mockMovie(id) {
  return Promise.resolve({
    id,
    title: `Mock Movie ${id}`,
    overview: "This is mock data. Provide a TMDB token for real movie details.",
    release_date: "2023-05-05",
    runtime: 123,
    vote_average: 7.2,
    poster_path: null,
    genres: [{ id: 1, name: "Action" }, { id: 2, name: "Drama" }]
  });
}
