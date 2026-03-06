import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { getImageUrl } from "@/services/tmdb"

export default function MovieRow({ title, fetchFn }) {
  const [movies, setMovies] = useState([])
  const rowRef = useRef(null)

  useEffect(() => {
    fetchFn().then((data) => setMovies(data.results))
  }, [fetchFn])

  function scroll(direction) {
    if (rowRef.current) {
      const amount = rowRef.current.clientWidth * 0.8
      rowRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="rounded-full bg-muted/50 p-1.5 text-white hover:bg-muted transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="rounded-full bg-muted/50 p-1.5 text-white hover:bg-muted transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      </div>
      <div
        ref={rowRef}
        className="flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide"
        style={{ scrollbarWidth: "none" }}
      >
        {movies.map((movie) => {
          const poster = getImageUrl(movie.poster_path, "w300")
          if (!poster) return null
          return (
            <Link
              key={movie.id}
              to={`/film/${movie.id}`}
              className="shrink-0 w-36 group"
            >
              <img
                src={poster}
                alt={movie.title}
                className="w-full rounded-lg transition-transform group-hover:scale-105"
              />
              <p className="mt-1.5 text-xs text-muted-foreground truncate group-hover:text-white transition-colors">
                {movie.title}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
