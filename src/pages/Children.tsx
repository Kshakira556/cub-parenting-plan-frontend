// src/pages/Children.tsx
import { useEffect, useState } from "react";
import type { Child } from "../services/childrenService"; 
import { getChildren, createChild } from "../services/childrenService";
import { useAuth } from "../context/AuthContext";

const ChildrenPage = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch all children
  const fetchChildren = async () => {
    try {
      const data = await getChildren();
      setChildren(data);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to load children");
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  // Add a new child
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
        if (!user) throw new Error("User not logged in");
      const newChild = await createChild({ full_name: fullName, date_of_birth: dob, parent_id: user.id, }); 
      setChildren((prev) => [...prev, newChild]);
      setFullName("");
      setDob("");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to add child");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Children</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2 flex-wrap">
        <div className="flex flex-col">
          <label htmlFor="fullName" className="sr-only">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="dob" className="sr-only">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Child"}
        </button>
      </form>

      {children.length === 0 ? (
        <p>No children found.</p>
      ) : (
        <ul className="space-y-2">
          {children.map((child) => (
            <li key={child.id} className="p-2 border rounded flex justify-between">
              <span>
                {child.full_name} — {new Date(child.date_of_birth).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChildrenPage;
