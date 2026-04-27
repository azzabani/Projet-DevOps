"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Erreur de connexion");
      return;
    }

    // ✔️ On enregistre le token
    localStorage.setItem("token", data.token);

    // ✔️ Redirection selon le rôle RENVOYÉ PAR L'API
    if (data.role === "admin") {
      router.push("/admin");   // 👉 Dashboard Admin
    } else {
      router.push("/");        // 👉 Page client
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/assets/1.png')" }}
    >
      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-sm bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/30"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Connexion
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/80 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          className="w-full p-3 mb-4 rounded-lg bg-white/80 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Se connecter
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-red-300">{message}</p>
        )}

        <p className="text-center text-sm text-white mt-4">
          Pas de compte ?
          <a href="/register" className="underline ml-1 font-semibold">
            S’inscrire
          </a>
        </p>
      </form>
    </div>
  );
}
