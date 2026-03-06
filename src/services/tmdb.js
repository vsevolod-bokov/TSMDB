const API_KEY = import.meta.env.VITE_TMDB_API_KEY
const BASE_URL = "https://api.themoviedb.org/3"
const IMAGE_BASE = "https://image.tmdb.org/t/p"

export const getImageUrl = (path, size = "w500") => {
  if (!path) return null
  return `${IMAGE_BASE}/${size}${path}`
}

async function fetchTMDB(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}${endpoint}`)
  url.searchParams.set("api_key", API_KEY)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  const res = await fetch(url)
  if (!res.ok) throw new Error("TMDB API error")
  return res.json()
}

export function getTrending(timeWindow = "week") {
  return fetchTMDB(`/trending/movie/${timeWindow}`)
}

export function getPopular(page = 1) {
  return fetchTMDB("/movie/popular", { page })
}

export function getMoviesByGenre(genreId, page = 1) {
  return fetchTMDB("/discover/movie", {
    with_genres: genreId,
    sort_by: "popularity.desc",
    page,
  })
}

export function searchMovies(query, page = 1) {
  return fetchTMDB("/search/movie", { query, page })
}

export function getMovieDetails(movieId) {
  return fetchTMDB(`/movie/${movieId}`, { append_to_response: "credits,videos" })
}

export function getGenres() {
  return fetchTMDB("/genre/movie/list")
}

export const GENRES = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Sci-Fi" },
  { id: 18, name: "Drama" },
  { id: 16, name: "Animation" },
]
