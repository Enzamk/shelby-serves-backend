import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto max-w-7xl px-8 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-slate-900">
          Shelby Serves
        </Link>
        <div className="flex space-x-6">
          <NavLink to="/" isActive={location.pathname === '/'}>
            Dashboard
          </NavLink>
          <NavLink to="/upload" isActive={location.pathname === '/upload'}>
            Upload
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children, isActive }) {
  return (
    <Link 
      to={to} 
      className={`text-slate-600 hover:text-slate-900 transition-colors relative ${
        isActive ? 'text-slate-900 font-medium' : ''
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"></span>
      )}
    </Link>
  );
}
