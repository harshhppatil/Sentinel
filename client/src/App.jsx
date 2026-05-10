import { Routes, Route } from 'react-router-dom'
import Navbar        from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Home          from './pages/Home'
import Login         from './pages/Login'
import Register      from './pages/Register'
import Profile       from './pages/Profile'
import KernelVault   from './pages/KernelVault'
import SystemPulse   from './pages/SystemPulse'
import LogStreamer    from './pages/LogStreamer'
import Architect     from './pages/Architect'
import KubeCloud     from './pages/KubeCloud'

export default function App() {
  return (
    <div className="min-h-screen bg-[#07080a]">
      <Navbar />
      <Routes>

        {/* Public */}
        <Route path="/"          element={<Home />} />
        <Route path="/login"     element={<Login />} />
        <Route path="/register"  element={<Register />} />
        <Route path="/kube"      element={<KubeCloud />} />

        {/* Protected — must be logged in */}
        <Route element={<ProtectedRoute />}>
          <Route path="/vault"     element={<KernelVault />} />
          <Route path="/pulse"     element={<SystemPulse />} />
          <Route path="/logs"      element={<LogStreamer />} />
          <Route path="/architect" element={<Architect />} />
          <Route path="/profile"   element={<Profile />} />
        </Route>

      </Routes>
    </div>
  )
}