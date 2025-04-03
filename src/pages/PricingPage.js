import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

const PricingPage = () => {
  const [stripe, setStripe] = useState(null); // State to store the Stripe instance

  // useEffect is called inside the functional component
  useEffect(() => {
    const initializeStripe = async () => {
      // Load Stripe
      const stripeInstance = await loadStripe("pk_test_51Qwe7dGPESFqZVLrkKIF8ZyoWoVQYzjv8E8HahilHBgxJ5AKyHm9Eg9AaHMgqZJNVpvN4oVatlJZ06YILaDuGXB800DeC7G9b6");
      setStripe(stripeInstance); // Set the Stripe instance in state
    };

    initializeStripe(); // Initialize Stripe when the component is mounted
  }, []); // Empty dependency array ensures this only runs once

  const handleCheckout = async (priceId) => {
    if (!stripe) {
      console.error("Stripe has not loaded yet.");
      return;
    }

    try {
      // Create a checkout session by calling your server
      const response = await fetch("http://localhost:5000/api/create-checkout-session", {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const session = await response.json();

      if (session.url) {
        // Redirect to Stripe checkout session
        window.location.href = session.url;
      }
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h1>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Freemium Plan */}
        <div className="card bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-semibold text-center mb-4">Freemium</h2>
          <p className="text-center text-lg mb-4">1 free AI-enhanced resume, then $5 per use.</p>
          <button
            onClick={() => handleCheckout("price_1R93iQGPESFqZVLryeO1zy82")}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Start Free
          </button>
        </div>

        {/* Basic Plan */}
        <div className="card bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-semibold text-center mb-4">Basic</h2>
          <p className="text-center text-lg mb-4">$10/month - 5 AI-enhanced resumes</p>
          <button
            onClick={() => handleCheckout("price_1R8xrJGPESFqZVLruuSRTica")}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Subscribe $10/month
          </button>
        </div>

        {/* Pro Plan */}
        <div className="card bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition duration-300">
          <h2 className="text-2xl font-semibold text-center mb-4">Pro</h2>
          <p className="text-center text-lg mb-4">$25/month - 15 AI-enhanced resumes</p>
          <button
            onClick={() => handleCheckout("price_1R93l2GPESFqZVLrF9fzah0t")}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Subscribe $25/month
          </button>
        </div>
      </div>

      {/* Pay-Per-Use */}
      <div className="text-center mt-8">
        <h2 className="text-xl font-bold">Pay-Per-Use</h2>
        <p className="text-lg mb-4">$5 per AI-enhanced resume</p>
        <button
          onClick={() => handleCheckout("price_1R93nZGPESFqZVLrYoVToexV")}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition duration-300"
        >
          Pay $5 Per Use
        </button>
      </div>
    </div>
  );
};

export default PricingPage;
