import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export default function Navbar() {
  const [query, setQuery] = useState("")
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  function handleSearch(e) {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query.trim())}`)
      setQuery("")
    }
  }

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/" className="text-xl font-bold text-primary shrink-0">
          TSMDB
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <Input
            type="search"
            placeholder="Search movies..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
          />
        </form>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/favorites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Favorites
          </Link>
          {currentUser && (
            <div className="flex items-center gap-3">
              {currentUser.photoURL && (
                <img
                  src={currentUser.photoURL}
                  alt="Avatar"
                  className="size-8 rounded-full border border-muted bg-muted"
                />
              )}
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {currentUser.displayName}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
