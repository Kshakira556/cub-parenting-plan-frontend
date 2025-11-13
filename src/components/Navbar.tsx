import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        Parenting App
      </Link>

      <div className="space-x-4">
        {user && (
          <>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
              Dashboard 
            </Link>
            <Link to="/visits" className="text-gray-700 hover:text-blue-600">
              Visits 
            </Link>
            <Link to="/messages" className="text-gray-700 hover:text-blue-600">
              Messages 
            </Link>
            <Link to="/journal" className="text-gray-700 hover:text-blue-600">
              Journal 
            </Link>
            <Link to="/children" className="text-gray-700 hover:text-blue-600">
              Children 
            </Link>
            <Link to="/plans" className="text-gray-700 hover:text-blue-600">Plans</Link>
            <button
              onClick={logout}
              className="text-gray-700 hover:text-red-600"
            >
              Logout
            </button>
          </>
        )}

        {!user && (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
