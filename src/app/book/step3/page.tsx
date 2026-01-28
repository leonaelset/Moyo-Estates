"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import Footer from "../../components/Footer";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

function CheckoutForm({ summary }: { summary: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cardholderName, setCardholderName] = useState("");

  // GA debug to check if gtag is loaded
  useEffect(() => {
    console.log("window.gtag is", window.gtag);
  }, []);

  if (!summary) return null;

  const totalPriceWithoutTax = summary.packageRate * summary.nights;
  const totalTax = totalPriceWithoutTax * summary.taxRate;
  const totalPriceInclTax = totalPriceWithoutTax + totalTax;

  const sendGAPurchaseEvent = () => {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", "purchase", {
      transaction_id: summary.transactionId || "txn_" + Date.now(),
      value: totalPriceInclTax,
      currency: "USD",
      items: [
        {
          name: summary.packageName,
          quantity: 1,
          price: totalPriceInclTax,
        },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setErrorMessage("");

    try {
      // 1. Create PaymentIntent
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(totalPriceInclTax * 100) }),
      });

      const data = await res.json();
      if (!data.clientSecret) throw new Error("PaymentIntent creation failed");

      const cardNumberElement = elements.getElement(CardNumberElement);
      if (!cardNumberElement) throw new Error("Card element not found");

      // 2. Confirm Card Payment
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: cardNumberElement,
          billing_details: { name: cardholderName },
        },
      });

      if (result.error) {
        setErrorMessage(result.error.message ?? "Payment failed");
        setLoading(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        // 3. Save booking info with customer name
        const updatedSummary = { ...summary, customerName: cardholderName };
        localStorage.setItem(
          "bookingStep2Summary",
          JSON.stringify(updatedSummary)
        );

        // 4. Trigger email
        await fetch("/bookings/booking-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSummary),
        });

        // 5. Send GA purchase event
        sendGAPurchaseEvent();

        // 6. Redirect to home page
        router.push("/");
      }
    } catch (err: any) {
      setErrorMessage(err?.message ?? "Payment failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-[80%] flex flex-col gap-6">
      {/* Booking Summary */}
      <div className="w-full bg-black p-6 border border-black rounded-xl shadow-sm">
        <h2 className="text-xl mb-6 font-semibold text-white">Booking Summary</h2>
        <p className="text-white">Package: {summary.packageName}</p>
        <p className="text-white">Nights: {summary.nights}</p>
        <p className="text-white">Guests: {summary.adults + summary.children}</p>
        <p className="text-white font-bold">
          Total: ${totalPriceInclTax.toFixed(2)}
        </p>
      </div>

      {/* Payment Information */}
      <div className="w-full bg-white p-6 border border-black rounded-xl shadow-sm">
        <h2 className="text-xl mb-6 font-semibold text-black">Payment Information</h2>

        <label className="block text-sm mb-2 text-black">Cardholder Name</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="Name on card"
          required
          className="w-full p-3 border border-black rounded-md mb-4 focus:ring-2 focus:ring-black focus:outline-none text-black"
        />

        <label className="block text-sm mb-2 text-black">Card Number</label>
        <div className="p-2 border border-black rounded-md mb-4 bg-white min-h-[44px]">
          <CardNumberElement
            options={{
              style: {
                base: { fontSize: "16px", color: "#000", letterSpacing: "0.5px" },
                invalid: { color: "#fa755a" },
              },
            }}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm mb-2 text-black">Expiry Date</label>
            <div className="p-2 border border-black rounded-md bg-white min-h-[44px]">
              <CardExpiryElement
                options={{
                  style: {
                    base: { fontSize: "16px", color: "#000", letterSpacing: "0.5px" },
                    invalid: { color: "#fa755a" },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-2 text-black">CVC</label>
            <div className="p-2 border border-black rounded-md bg-white min-h-[44px]">
              <CardCvcElement
                options={{
                  style: {
                    base: { fontSize: "16px", color: "#000", letterSpacing: "0.5px" },
                    invalid: { color: "#fa755a" },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {errorMessage && <p className="text-red-600">{errorMessage}</p>}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="mt-6 px-8 py-3 bg-black text-white uppercase hover:bg-white hover:text-black border border-black transition rounded-md"
      >
        {loading ? "Processing..." : `Pay $${totalPriceInclTax.toFixed(2)}`}
      </button>
    </form>
  );
}

export default function Step3Payment() {
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const journeySteps = ["BOOKING", "REVIEW", "PAYMENT"];
  const currentStep = 2;

  useEffect(() => {
    const storedSummary = localStorage.getItem("bookingStep2Summary");
    const recordId = localStorage.getItem("airtableRecordId");

    if (!storedSummary && !recordId) {
      router.push("/book/step2");
      return;
    }

    if (storedSummary) setSummary(JSON.parse(storedSummary));
    setLoading(false);
  }, [router]);

  if (loading) return null;
  if (!summary)
    return <p className="pt-44">Booking info missing. Please go back to step 2.</p>;

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-44 pb-28 font-[Doritis] uppercase tracking-[0.05em] select-none">
      <div className="flex items-center justify-center gap-4 mb-10 tracking-[0.1em]">
        {journeySteps.map((step, index) => (
          <React.Fragment key={step}>
            <div
              className={`aspect-square w-28 flex items-center justify-center text-sm border transition 
              ${index <= currentStep ? "bg-black text-white border-black" : "bg-white text-black border-black"}`}
            >
              {step}
            </div>
            {index < journeySteps.length - 1 && (
              <div
                className={`h-[2px] w-8 ${index < currentStep ? "bg-black" : "bg-gray-400"}`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>

      <h1 className="text-2xl mb-12 text-black">Payment</h1>
      <Elements stripe={stripePromise}>
        <CheckoutForm summary={summary} />
      </Elements>

      <div className="mt-32"></div>
      <Footer />
    </div>
  );
}
