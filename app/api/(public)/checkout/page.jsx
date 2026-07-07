"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";

export default function CheckoutPage() {

    const [addresses, setAddresses] = useState([]);
    const [summary, setSummary] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCheckout();
    }, []);

  async function loadCheckout() {
    try {
        const addressRes = await fetch("/api/address", {
            credentials: "include",
        });

        if (!addressRes.ok) {
            throw new Error(`Address API failed: ${addressRes.status}`);
        }

        const addressData = await addressRes.json();

        const summaryRes = await fetch("/api/orders/summary", {
            credentials: "include",
        });

        if (!summaryRes.ok) {
            throw new Error(`Summary API failed: ${summaryRes.status}`);
        }

        const summaryData = await summaryRes.json();

        setAddresses(addressData);
        setSummary(summaryData);

        if (addressData.length > 0) {
            setSelectedAddress(addressData[0].id);
        }

    } catch (error) {
        console.error(error);
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
}
    async function placeOrder() {

        try {

            const res = await fetch("/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    addressId: selectedAddress,
                    paymentMethod,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success("Order Placed");

        } catch (error) {

            toast.error(error.message);

        }

    }

    if (loading)  return (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {[...Array(8)].map((_, index) => (

                <ProductSkeleton key={index} />

            ))}

        </div>

    );

    return (
        <div className="max-w-5xl mx-auto py-10">

            <h1 className="text-3xl font-bold mb-8">
                Checkout
            </h1>

            <div className="grid md:grid-cols-2 gap-10">

                <div>

                    <h2 className="text-xl font-semibold mb-4">
                        Delivery Address
                    </h2>

                    <select
                        className="border p-3 rounded w-full"
                        value={selectedAddress}
                        onChange={(e)=>setSelectedAddress(e.target.value)}
                    >

                        {
                            addresses.map(address=>(
                                <option
                                    key={address.id}
                                    value={address.id}
                                >
                                    {address.name} - {address.city}
                                </option>
                            ))
                        }

                    </select>

                    <h2 className="text-xl font-semibold mt-8 mb-4">
                        Payment Method
                    </h2>

                    <select
                        className="border p-3 rounded w-full"
                        value={paymentMethod}
                        onChange={(e)=>setPaymentMethod(e.target.value)}
                    >
                        <option value="COD">
                            Cash On Delivery
                        </option>

                        <option value="STRIPE">
                            Stripe
                        </option>

                    </select>

                </div>

                <div>

                    <h2 className="text-xl font-semibold mb-4">
                        Order Summary
                    </h2>

                    {
                        summary && (
                            <div className="space-y-3">

                                <p>
                                    Subtotal :
                                    ₹ {summary.subTotal}
                                </p>

                                <p>
                                    Shipping :
                                    ₹ {summary.shippingCharge}
                                </p>

                                <p>
                                    Tax :
                                    ₹ {summary.tax}
                                </p>

                                <hr />

                                <h2 className="font-bold text-xl">
                                    Total :
                                    ₹ {summary.total}
                                </h2>

                            </div>
                        )
                    }

                    <button
                        onClick={placeOrder}
                        className="mt-8 bg-black text-white px-6 py-3 rounded"
                    >
                        Place Order
                    </button>

                </div>

            </div>

        </div>
    );

}