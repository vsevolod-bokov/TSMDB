import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

const STYLES = [
  { id: "adventurer", label: "Adventurer" },
  { id: "avataaars", label: "Avataaars" },
  { id: "bottts", label: "Bottts" },
  { id: "lorelei", label: "Lorelei" },
  { id: "pixel-art", label: "Pixel Art" },
  { id: "thumbs", label: "Thumbs" },
]

function generateSeeds(count) {
  return Array.from({ length: count }, () => Math.random().toString(36).substring(2, 10))
}

function getAvatarUrl(style, seed) {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`
}

export default function Account() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [seeds, setSeeds] = useState(() => generateSeeds(8))
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { register, updateUserProfile } = useAuth()
  const navigate = useNavigate()

  const avatarUrl = getAvatarUrl(selectedStyle, selectedSeed || name || "default")

  function handleShuffle() {
    setSeeds(generateSeeds(8))
    setSelectedSeed(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError("Passwords do not match.")
    }
    setError("")
    setLoading(true)
    try {
      await register(email, password)
      await updateUserProfile({ displayName: name, photoURL: avatarUrl })
      navigate("/")
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden py-8">
      {(name || selectedSeed) && (
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(${avatarUrl})`,
            filter: "blur(80px) brightness(0.3)",
            transform: "scale(1.5)",
          }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/60 to-gray-800/80" />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Welcome to TSMDB</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <Card className="w-full max-w-3xl">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-8">
              {/* Left side - Avatar */}
              <div className="flex flex-col items-center gap-4 md:w-1/2">
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="size-28 rounded-full border-2 border-muted bg-muted"
                />

                <div className="flex flex-col gap-2 w-full">
                  <Label>Avatar Style</Label>
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => { setSelectedStyle(style.id); setSelectedSeed(null) }}
                        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                          selectedStyle === style.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex items-center justify-between">
                    <Label>Choose Avatar</Label>
                    <button
                      type="button"
                      onClick={handleShuffle}
                      className="text-xs text-primary underline underline-offset-4 hover:text-primary/80"
                    >
                      Shuffle
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {seeds.map((seed) => {
                      const url = getAvatarUrl(selectedStyle, seed)
                      return (
                        <button
                          key={seed}
                          type="button"
                          onClick={() => setSelectedSeed(seed)}
                          className={`rounded-lg border-2 p-2 transition-colors ${
                            selectedSeed === seed
                              ? "border-primary bg-primary/10"
                              : "border-transparent bg-muted hover:border-muted-foreground/30"
                          }`}
                        >
                          <img src={url} alt="Avatar option" className="size-full rounded-md" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Right side - Form fields */}
              <div className="flex flex-col gap-4 md:w-1/2">
                <div className="mb-2">
                  <h2 className="text-lg font-semibold">Register</h2>
                  <p className="text-sm text-muted-foreground">Create a new account to get started.</p>
                </div>

                {error && (
                  <p className="text-sm text-destructive text-center">{error}</p>
                )}

                <div className="flex flex-col gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full mt-2" disabled={loading}>
                  {loading ? "Creating account..." : "Register"}
                </Button>
                <p className="text-sm text-muted-foreground text-center">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary underline underline-offset-4 hover:text-primary/80">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
