import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import Message from "../components/Message.jsx";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState(user?.shippingAddress?.address || "");
  const [city, setCity] = useState(user?.shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(user?.shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(user?.shippingAddress?.country || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const payload = { name, email, shippingAddress: { address, city, postalCode, country } };
      if (password) payload.password = password;
      await updateProfile(payload);
      setSuccess("Profile updated");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile");
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <p className="label-eyebrow">Account</p>
      <h1 className="font-display text-page-title mt-1 mb-8">Your profile</h1>

      {error && <div className="mb-4"><Message type="error">{error}</Message></div>}
      {success && <div className="mb-4"><Message type="success">{success}</Message></div>}

      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="label-eyebrow block mb-1.5">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="label-eyebrow block mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="label-eyebrow block mb-1.5">New password (optional)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div className="pt-2 border-t border-ink/10">
          <p className="label-eyebrow mb-3 mt-4">Shipping address</p>
          <div className="space-y-3">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street address"
              className="input-field"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="input-field"
              />
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="Postal code"
                className="input-field"
              />
            </div>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Country"
              className="input-field"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          Save changes
        </button>
      </form>
    </div>
  );
};

export default Profile;
