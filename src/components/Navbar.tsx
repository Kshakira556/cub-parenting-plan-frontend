// src/components/Navbar.tsx
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">Parenting App</Link>
      <div className="space-x-4">
        <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        <Link to="/visits" className="text-gray-700 hover:text-blue-600">Visits</Link>
        <Link to="/messages" className="text-gray-700 hover:text-blue-600">Messages</Link>
        <Link to="/journal" className="text-gray-700 hover:text-blue-600">Journal</Link>
      </div>
    </nav>
  );
};

export default Navbar;
