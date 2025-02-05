"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "@/context/AuthContext.js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function PaymentCards() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Manage Payment Cards
      </h1>
      <Elements stripe={stripePromise}>
        <PaymentForm />
      </Elements>
    </div>
  );
}

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { user, logout } = useAuth();
  const [email, setEmail] = useState(user?.email || "");
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (email) fetchCards();
  }, [email]);

  const fetchCards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/get-cards", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setCards(data.cards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      setMessage("Error fetching cards. Please try again.");
    }
    setIsLoading(false);
  };

  const handleAddCard = async () => {
    if (!stripe || !elements) return;

    setIsLoading(true);
    const cardElement = elements.getElement(CardElement);
    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setMessage("Error adding card.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/stripe/add-card", {
        method: "POST",
        body: JSON.stringify({ email, paymentMethodId: paymentMethod.id }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Card added successfully!");
        fetchCards();
      } else {
        setMessage("Error adding card.");
      }
    } catch (error) {
      console.error("Error adding card:", error);
      setMessage("Error adding card. Please try again.");
    }
    setIsLoading(false);
  };

  const handleRemoveCard = async (id) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/delete-card", {
        method: "POST",
        body: JSON.stringify({ paymentMethodId: id }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Card removed.");
        fetchCards();
      } else {
        setMessage("Error removing card.");
      }
    } catch (error) {
      console.error("Error removing card:", error);
      setMessage("Error removing card. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border border-gray-300 p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-black"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="border border-gray-300 p-4 rounded mb-4">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      <button
        onClick={handleAddCard}
        disabled={isLoading || !stripe}
        className="w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition duration-200 disabled:opacity-50"
      >
        {isLoading ? "Processing..." : "Add Card"}
      </button>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("Error") ? "text-red-500" : "text-green-500"
          }`}
        >
          {message}
        </p>
      )}

      <h2 className="text-xl font-bold mt-8 mb-4">Saved Cards</h2>
      {isLoading ? (
        <p className="text-center">Loading cards...</p>
      ) : cards.length > 0 ? (
        cards.map((card) => (
          <div
            key={card.id}
            className="flex justify-between items-center border border-gray-300 p-3 rounded mt-2"
          >
            <p>
              **** **** **** {card.card.last4} (Exp: {card.card.exp_month}/
              {card.card.exp_year})
            </p>
            <button
              onClick={() => handleRemoveCard(card.id)}
              className="text-red-500 hover:text-red-700 transition duration-200"
            >
              Remove
            </button>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No saved cards</p>
      )}
    </div>
  );
}
