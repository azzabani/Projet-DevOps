"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas !");
    }

    const { confirmPassword, ...dataToSend } = form;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.message);

    router.push("/login");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/assets/1.png')" }}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/30"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Créer un compte
        </h1>

        {error && (
          <p className="text-red-300 text-center mb-4 text-sm">{error}</p>
        )}

        {/* Prénom */}
        <input
          name="prenom"
          type="text"
          placeholder="Prénom"
          className="w-full p-3 mb-4 rounded-lg bg-white/70 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-white/90 text-gray-900"
          onChange={handleChange}
          required
        />

        {/* Nom */}
        <input
          name="nom"
          type="text"
          placeholder="Nom"
          className="w-full p-3 mb-4 rounded-lg bg-white/70 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-white/90 text-gray-900"
          onChange={handleChange}
          required
        />

        {/* Email */}
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded-lg bg-white/70 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-white/90 text-gray-900"
          onChange={handleChange}
          required
        />

        {/* Mot de passe */}
        <input
          name="password"
          type="password"
          placeholder="Mot de passe"
          className="w-full p-3 mb-4 rounded-lg bg-white/70 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-white/90 text-gray-900"
          onChange={handleChange}
          required
        />

        {/* Confirmer mot de passe */}
        <input
          name="confirmPassword"
          type="password"
          placeholder="Répétez le mot de passe"
          className="w-full p-3 mb-6 rounded-lg bg-white/70 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none placeholder:text-white/90 text-gray-900"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          S’inscrire
        </button>

        <p className="text-center text-sm text-white mt-4">
          Déjà inscrit ?
          <a href="/login" className="underline ml-1 font-semibold">
            Se connecter
          </a>
        </p>
      </form>
    </div>
  );
}
