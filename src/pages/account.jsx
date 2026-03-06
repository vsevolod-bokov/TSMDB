import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import Navbar from "@/components/Navbar"

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
  const { currentUser, updateUserProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState(currentUser?.displayName || "")
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [seeds, setSeeds] = useState(() => generateSeeds(8))
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const avatarUrl = selectedSeed
    ? getAvatarUrl(selectedStyle, selectedSeed)
    : (currentUser?.photoURL || getAvatarUrl(selectedStyle, name || "default"))

  function handleShuffle() {
    setSeeds(generateSeeds(8))
    setSelectedSeed(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      await updateUserProfile({ displayName: name, photoURL: avatarUrl })
      setSuccess("Profile updated successfully!")
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative overflow-hidden py-8">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{
            backgroundImage: `url(${avatarUrl})`,
            filter: "blur(80px) brightness(0.3)",
            transform: "scale(1.5)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/60 to-gray-800/80" />

        <div className="relative z-10 flex flex-col items-center gap-6 mx-auto max-w-3xl px-4">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Your Profile</h1>
            <p className="text-muted-foreground mt-1">{currentUser?.email}</p>
          </div>

          <Card className="w-full">
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
                    <h2 className="text-lg font-semibold">Edit Profile</h2>
                    <p className="text-sm text-muted-foreground">Update your name and avatar.</p>
                  </div>

                  {error && (
                    <p className="text-sm text-destructive text-center">{error}</p>
                  )}
                  {success && (
                    <p className="text-sm text-green-500 text-center">{success}</p>
                  )}

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="edit-name">Name</Label>
                    <Input
                      id="edit-name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={currentUser?.email || ""}
                      disabled
                      className="opacity-50"
                    />
                  </div>

                  <Button type="submit" className="w-full mt-2" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
