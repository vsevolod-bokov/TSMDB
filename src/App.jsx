import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/home.jsx'
import Login from './pages/login.jsx'
import Browse from './pages/browse.jsx'
import Film from './pages/film.jsx'
import Account from './pages/account.jsx'
import Favorites from './pages/favorites.jsx'
import Results from './pages/results.jsx'
import Lost from './pages/lost.jsx'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/browse" element={<ProtectedRoute><Browse /></ProtectedRoute>} />
        <Route path="/film/:id" element={<ProtectedRoute><Film /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="*" element={<Lost />} />
      </Routes>
    </AuthProvider>
  )
}

export default App
