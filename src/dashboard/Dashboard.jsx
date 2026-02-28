import { Routes, Route, Link } from 'react-router-dom';
import Complaints from './Complaints';
// import Volunteers from './Volunteers'; // Jab aap bana lein
// import Overview from './Overview';

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 flex gap-6">
      {/* Sidebar Section */}
      <aside className="w-64 space-y-2">
        <div className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 mb-4">
          <h2 className="font-bold text-[#0057a8]">Campus Dashboard</h2>
          <p className="text-xs text-gray-500">Lost & found, complaints, volunteers.</p>
        </div>

        <nav className="flex flex-col gap-1">
          <Link to="/dashboard" className="px-4 py-3 rounded-xl hover:bg-gray-100 font-medium">Overview</Link>
          <Link to="/dashboard/complaints" className="px-4 py-3 rounded-xl hover:bg-gray-100 font-medium text-gray-700">Complaints</Link>
          <Link to="/dashboard/volunteers" className="px-4 py-3 rounded-xl hover:bg-gray-100 font-medium text-gray-700">Volunteers</Link>
        </nav>
      </aside>

      {/* Content Section */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<div>Welcome to Overview</div>} />
          <Route path="complaints" element={<Complaints />} />
          <Route path="volunteers" element={<div>Volunteers Section (Coming Soon)</div>} />
        </Routes>
      </main>
    </div>
  );
}