// src/pages/Home.tsx
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to CUB Parenting App</h1>
      <p className="text-lg mb-6">Manage visits, messages, and journals easily.</p>
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Get Started
      </Link>
    </div>
  );
};

export default Home;
