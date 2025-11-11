import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register as registerService } from "../services/authService";

const roles = ["parent", "mediator", "admin"] as const;

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"parent" | "mediator" | "admin">("parent");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      await registerService(fullName, email, password, role);
      navigate("/login");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-md mx-auto mt-12 p-6 bg-white rounded shadow"
    >
      <h2 className="text-2xl font-bold text-center">Register</h2>

      {error && <p className="text-red-600">{error}</p>}

      <input
        type="text"
        placeholder="Full Name"
        className="p-2 border rounded"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        className="p-2 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="p-2 border rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <label htmlFor="role" className="font-medium">
        Role
      </label>
      <select
        id="role"
        value={role}
        onChange={(e) => setRole(e.target.value as typeof role)}
        className="p-2 border rounded"
        required
      >
        {roles.map((r) => (
          <option key={r} value={r}>
            {r.charAt(0).toUpperCase() + r.slice(1)}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Registering..." : "Register"}
      </button>
    </form>
  );
};

export default Register;
