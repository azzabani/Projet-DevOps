"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function PayPage() {
  const { id } = useParams();

  useEffect(() => {
    const startPayment = async () => {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Redirection vers Stripe Checkout
      }
    };

    startPayment();
  }, [id]);

  return (
    <div className="p-10 text-center text-orange-700 text-xl">
      Redirection vers la page de paiement...
    </div>
  );
}
