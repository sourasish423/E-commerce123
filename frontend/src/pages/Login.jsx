import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Message from "../components/Message.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <p className="label-eyebrow">Welcome back</p>
      <h1 className="font-display text-page-title mt-1 mb-8">Sign in</h1>

      {error && (
        <div className="mb-4">
          <Message type="error">{error}</Message>
        </div>
      )}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-eyebrow block mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="label-eyebrow block mb-1.5">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="text-sm text-slate-450 mt-6">
        New here?{" "}
        <Link to={`/register${redirect !== "/" ? `?redirect=${redirect}` : ""}`} className="text-ink underline">
          Create an account
        </Link>
      </p>
      <p className="font-mono text-caption text-slate-450 mt-8 border-t border-dashed border-ink/20 pt-4">
        Demo admin: admin@example.com / admin123
      </p>
    </div>
  );
};

export default Login;
