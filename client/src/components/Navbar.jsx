import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); 

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-[56px] border-b border-hairline px-6 md:px-12 flex items-center justify-between sticky top-0 bg-canvas/60 backdrop-blur-xl z-50 supports-[backdrop-filter]:bg-canvas/40">
      
      {/* LEFT: Branding */}
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center select-none">
          <span className="text-on-dark text-[18px] font-bold tracking-tighter hover:opacity-80 transition-opacity">
            Sentinel<span className="text-accent-red">.</span>
          </span>
        </Link>

        {/* MIDDLE: Primary Links */}
        <div className="hidden lg:flex items-center gap-6">
          <Link 
            to="/pulse" 
            className={`text-[14px] transition-colors ${isActive('/pulse') ? 'text-on-dark font-medium shadow-[0_1px_0_0_#fff]' : 'text-body hover:text-on-dark'}`}
          >
            System Pulse
          </Link>
          <Link 
            to="/architect" 
            className={`text-[14px] transition-colors ${isActive('/architect') ? 'text-on-dark font-medium shadow-[0_1px_0_0_#fff]' : 'text-body hover:text-on-dark'}`}
          >
            Architect
          </Link>
          <Link 
            to="/vault" 
            className={`text-[14px] transition-colors ${isActive('/vault') ? 'text-on-dark font-medium shadow-[0_1px_0_0_#fff]' : 'text-body hover:text-on-dark'}`}
          >
            Vault
          </Link>
          <Link 
            to="/logs" 
            className={`text-[14px] transition-colors ${isActive('/logs') ? 'text-on-dark font-medium shadow-[0_1px_0_0_#fff]' : 'text-body hover:text-on-dark'}`}
          >
            Logs
          </Link>
          <Link 
            to="/kube" 
            className={`text-[14px] transition-colors ${isActive('/kube') ? 'text-on-dark font-medium shadow-[0_1px_0_0_#fff]' : 'text-body hover:text-on-dark'}`}
          >
            Kube Cloud
          </Link>
        </div>
      </div>

      {/* RIGHT: Meta & Actions */}
      <div className="flex items-center gap-6">
        <span className="hidden md:block text-mute text-[12px] font-mono tracking-wider">
          v1.0.0-alpha
        </span>
        
        {user ? (
          <div className="flex items-center gap-4">
            <Link 
              to="/profile" 
              className="text-on-dark font-medium text-[14px] hover:text-accent-blue transition-colors flex items-center gap-2 group"
            >
              <div className="w-6 h-6 rounded-full bg-surface-card border border-hairline flex items-center justify-center text-[11px] text-mute group-hover:border-accent-blue/50 group-hover:text-accent-blue transition-colors">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-transparent border border-hairline text-body hover:text-on-dark hover:border-hairline-strong px-3 py-1.5 h-[32px] rounded-md font-medium text-[13px] transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link 
            to="/login" 
            className="bg-primary text-on-primary px-4 py-2 h-[32px] rounded-md font-medium text-[13px] tracking-[0.2px] hover:bg-primary-pressed active:bg-primary-pressed transition-colors flex items-center justify-center"
          >
            System Login
          </Link>
        )}
      </div>
    </nav>
  );
}