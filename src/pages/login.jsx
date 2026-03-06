import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import movieBg from "@/assets/movie background.png"

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

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate("/")
    } catch (err) {
      setError("Invalid email or password.")
    }
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your email and password to sign in.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="login-password">Password</Label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function RegisterForm() {
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
    <Card>
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
              <h2 className="text-lg font-semibold">Create Account</h2>
              <p className="text-sm text-muted-foreground">Choose your avatar and fill in your details.</p>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <div className="flex flex-col gap-2">
              <Label htmlFor="register-name">Name</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="register-confirm-password">Confirm Password</Label>
              <Input
                id="register-confirm-password"
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
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default function Login() {
  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden py-8">
      <img src={movieBg} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center gap-6 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Welcome to TSMDB</h1>
          <p className="text-muted-foreground mt-2">Your ultimate movie database</p>
        </div>
        <Tabs defaultValue="login" className="w-full max-w-sm data-[state=register]:max-w-3xl">
          <TabsList className="w-full">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="max-w-3xl">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
