import { useCallback, useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/Navbar"
import MovieRow from "@/components/MovieRow"
import { Input } from "@/components/ui/input"
import { getTrending, getPopular, getMoviesByGenre, getImageUrl, GENRES } from "@/services/tmdb"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
  const { currentUser } = useAuth()
  const [heroMovie, setHeroMovie] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const fetchTrending = useCallback(() => getTrending(), [])
  const fetchPopular = useCallback(() => getPopular(), [])

  useEffect(() => {
    getTrending().then((data) => {
      const movies = data.results.filter((m) => m.backdrop_path)
      if (movies.length > 0) {
        setHeroMovie(movies[Math.floor(Math.random() * Math.min(5, movies.length))])
      }
    })
  }, [])

  const genreFetchers = useMemo(
    () => GENRES.map((genre) => ({
      ...genre,
      fetchFn: () => getMoviesByGenre(genre.id),
    })),
    []
  )

  const firstName = currentUser?.displayName?.split(" ")[0] || "Movie Fan"

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        {heroMovie && (
          <img
            src={getImageUrl(heroMovie.backdrop_path, "original")}
            alt={heroMovie.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-10 mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold text-white md:text-5xl">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-2 text-lg text-muted-foreground max-w-lg">
            Discover your next favorite movie. Browse trending films, explore genres, or search for something specific.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (searchQuery.trim()) {
                navigate(`/results?q=${encodeURIComponent(searchQuery.trim())}`)
                setSearchQuery("")
              }
            }}
            className="mt-4 max-w-md"
          >
            <Input
              type="search"
              placeholder="Search for a movie..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 bg-background/50 backdrop-blur border-muted-foreground/30 text-white placeholder:text-muted-foreground"
            />
          </form>
          {heroMovie && (
            <p className="mt-3 text-sm text-muted-foreground">
              Featured: <span className="text-white font-medium">{heroMovie.title}</span>
            </p>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl space-y-8 py-6">
        <MovieRow title="Trending This Week" fetchFn={fetchTrending} />
        <MovieRow title="Popular" fetchFn={fetchPopular} />
        {genreFetchers.map((genre) => (
          <MovieRow
            key={genre.id}
            title={genre.name}
            fetchFn={genre.fetchFn}
          />
        ))}
      </main>
    </div>
  )
}
