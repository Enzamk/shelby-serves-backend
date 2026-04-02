import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <main className="ml-20 container mx-auto max-w-7xl px-8 py-10">
        <Outlet />
      </main>
    </div>
  );
}
