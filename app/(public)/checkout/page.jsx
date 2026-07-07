"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Script from "next/script";
import {
    MapPin,
    CreditCard,
    Plus,
    Pencil,
    Trash2,
    ShieldCheck,
    Truck,
} from "lucide-react";

import AddressModal from "@/components/AddressModal";

export default function Checkout() {

    const currency =
        process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

    const [loading, setLoading] = useState(true);

    const [addresses, setAddresses] = useState([]);

    const [summary, setSummary] = useState(null);

    const [selectedAddress, setSelectedAddress] = useState("");

    const [paymentMethod, setPaymentMethod] =
        useState("COD");

const [couponCode, setCouponCode] = useState("");

const [discount, setDiscount] = useState(0);

const [appliedCoupon, setAppliedCoupon] = useState(null);

    const [addressModal, setAddressModal] =
        useState(false);

    const [editingAddress, setEditingAddress] =
        useState(null);

    useEffect(() => {

        loadCheckout();

    }, []);

    async function loadCheckout() {

        try {

            setLoading(true);

            const [addressRes, summaryRes] =
                await Promise.all([

                    fetch("/api/address", {
                        credentials: "include",
                    }),

                    fetch("/api/orders/summary", {
                        credentials: "include",
                    }),

                ]);

            const addressData =
                await addressRes.json();

            const summaryData =
                await summaryRes.json();

            if (!addressRes.ok) {

                throw new Error(addressData.message);

            }

            if (!summaryRes.ok) {

                throw new Error(summaryData.message);

            }

            setAddresses(addressData);

            setSummary(summaryData);

            if (addressData.length > 0) {

                setSelectedAddress(addressData[0].id);

            } else {

                setSelectedAddress("");

            }

        } catch (error) {

            toast.error(error.message);

        } finally {

            setLoading(false);

        }

    }

    async function deleteAddress(id) {

        if (!confirm("Delete this address?")) {

            return;

        }

        try {

            const res = await fetch(
                `/api/address/${id}`,
                {
                    method: "DELETE",
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {

                throw new Error(data.message);

            }

            toast.success("Address Deleted");

            loadCheckout();

        } catch (error) {

            toast.error(error.message);

        }

    }

    async function applyCoupon(){

    try{

        const res = await fetch("/api/coupons/apply",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            credentials:"include",

            body:JSON.stringify({

                code:couponCode

            })

        });

        const data=await res.json();

        if(!res.ok){

            throw new Error(data.message);

        }

        setAppliedCoupon(data.coupon);

        setDiscount(data.summary.discount);

        setSummary(data.summary);

        toast.success("Coupon Applied");

    }

    catch(error){

        toast.error(error.message);

    }

}

   async function placeOrder() {

    if (!selectedAddress) {

        toast.error("Please select an address");

        return;

    }

    if (paymentMethod === "COD") {

        try {

            const res = await fetch("/api/orders", {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                },

                credentials: "include",

                body: JSON.stringify({

                    addressId: selectedAddress,

                    paymentMethod: "COD",
                     coupon:appliedCoupon

                }),

            });

            const data = await res.json();

            if (!res.ok) {

                throw new Error(data.message);

            }

            toast.success("Order Placed Successfully");

            window.location.href = "/orders";

        } catch (error) {

            toast.error(error.message);

        }

        return;

    }

    startRazorpay();

}
async function startRazorpay() {

    try {

        const res = await fetch("/api/payment/create-order", {

            method: "POST",

            headers: {

                "Content-Type": "application/json",

            },

            credentials: "include",

            body: JSON.stringify({

                addressId: selectedAddress,

            }),

        });

        const data = await res.json();

        if (!res.ok) {

            throw new Error(data.message);

        }

        const options = {

            key: data.key,

            amount: data.razorpayOrder.amount,

            currency: data.razorpayOrder.currency,

            name: "GoCart",

            description: "Order Payment",

            order_id: data.razorpayOrder.id,

            handler: async function (response) {

                const verify = await fetch("/api/payment/verify", {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",

                    },

                    credentials: "include",

                    body: JSON.stringify({

                        razorpay_order_id: response.razorpay_order_id,

                        razorpay_payment_id: response.razorpay_payment_id,

                        razorpay_signature: response.razorpay_signature,

                        orderId: data.order.id,

                    }),

                });

                const result = await verify.json();

                if (!verify.ok) {

                    toast.error(result.message);

                    return;

                }

                toast.success("Payment Successful");

                window.location.href = "/orders";

            },

            theme: {

                color: "#16a34a",

            },

        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();

    } catch (error) {

        toast.error(error.message);

    }

}

    if (loading) {

        return (

            <div className="flex items-center justify-center h-[70vh]">

                <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>

            </div>

        );

    }

    return (
<>
<Script src="https://checkout.razorpay.com/v1/checkout.js" />

        <div className="bg-slate-50 min-h-screen">

            <div className="max-w-7xl mx-auto py-10 px-5">

                <h1 className="text-3xl font-bold text-slate-800">

                    Checkout

                </h1>

                <p className="text-slate-500 mt-2">

                    Complete your order securely.

                </p>

                <div className="grid lg:grid-cols-3 gap-8 mt-8">
                    {/* =========================
    LEFT SECTION
========================= */}

<div className="lg:col-span-2 space-y-6">

    {/* Address Card */}

    <div className="bg-white rounded-xl shadow-sm border p-5">

        <div className="flex items-center justify-between mb-5">

            <div>

                <h2 className="text-xl font-semibold text-slate-800">
                    Delivery Address
                </h2>

                <p className="text-sm text-slate-500">
                    Select where you want your order delivered.
                </p>

            </div>

            <button
                onClick={() => {

                    setEditingAddress(null);

                    setAddressModal(true);

                }}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >

                <Plus size={18} />

                Add Address

            </button>

        </div>

        <div className="space-y-4">

            {addresses.length === 0 ? (

                <div className="border-2 border-dashed rounded-xl py-12 flex flex-col items-center">

                    <MapPin
                        size={50}
                        className="text-slate-400 mb-4"
                    />

                    <h3 className="text-lg font-semibold">

                        No Address Found

                    </h3>

                    <p className="text-slate-500 mt-2">

                        Add your first delivery address.

                    </p>

                </div>

            ) : (

                addresses.map((address) => (

                    <div
                        key={address.id}
                        onClick={() =>
                            setSelectedAddress(address.id)
                        }
                        className={`border rounded-xl p-5 cursor-pointer transition

                        ${
                            selectedAddress === address.id
                                ? "border-green-600 bg-green-50"
                                : "border-slate-200 hover:border-green-300"
                        }`}
                    >

                        <div className="flex justify-between">

                            <div className="flex gap-3">

                                <input
                                    type="radio"
                                    checked={
                                        selectedAddress ===
                                        address.id
                                    }
                                    readOnly
                                />

                                <div>

                                    <h3 className="font-semibold text-slate-800">

                                        {address.name}

                                    </h3>

                                    <p className="text-slate-600 mt-1">

                                        {address.street}

                                    </p>

                                    <p className="text-slate-600">

                                        {address.city},{" "}
                                        {address.state}

                                    </p>

                                    <p className="text-slate-600">

                                        {address.country} •{" "}
                                        {address.zip}

                                    </p>

                                    <p className="text-sm mt-2">

                                        📞 {address.phone}

                                    </p>

                                </div>

                            </div>

                            {address.isDefault && (

                                <span className="bg-green-600 text-white text-xs px-3 py-1 rounded-full h-fit">

                                    Default

                                </span>

                            )}

                        </div>

                        <div className="flex gap-5 mt-5">

                            <button
                                onClick={(e) => {

                                    e.stopPropagation();

                                    setEditingAddress(address);

                                    setAddressModal(true);

                                }}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                            >

                                <Pencil size={17} />

                                Edit

                            </button>

                            <button
                                onClick={(e) => {

                                    e.stopPropagation();

                                    deleteAddress(address.id);

                                }}
                                className="flex items-center gap-2 text-red-600 hover:text-red-700"
                            >

                                <Trash2 size={17} />

                                Delete

                            </button>

                        </div>

                    </div>

                ))

            )}

        </div>

    </div>

    {/* Payment */}

    {addresses.length > 0 && (

        <div className="bg-white rounded-xl shadow-sm border p-5">

            <div className="flex items-center gap-3 mb-5">

                <CreditCard className="text-green-600" />

                <h2 className="text-xl font-semibold">

                    Payment Method

                </h2>

            </div>

            <div className="space-y-3">

              <div className="space-y-4">

    <label
        className={`border rounded-xl p-5 flex justify-between items-center cursor-pointer transition

        ${
            paymentMethod === "COD"
                ? "border-green-600 bg-green-50"
                : "hover:border-green-400"
        }`}
    >

        <div>

            <h3 className="font-semibold">

                Cash on Delivery

            </h3>

            <p className="text-sm text-slate-500">

                Pay when your order is delivered.

            </p>

        </div>

        <input
            type="radio"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
        />

    </label>

    <label
        className={`border rounded-xl p-5 flex justify-between items-center cursor-pointer transition

        ${
            paymentMethod === "RAZORPAY"
                ? "border-blue-600 bg-blue-50"
                : "hover:border-blue-400"
        }`}
    >

        <div>

            <h3 className="font-semibold">

                Razorpay

            </h3>

            <p className="text-sm text-slate-500">

                UPI • Cards • Net Banking • Wallets

            </p>

        </div>

        <input
            type="radio"
            checked={paymentMethod === "RAZORPAY"}
            onChange={() => setPaymentMethod("RAZORPAY")}
        />

    </label>

</div>
            </div>

        </div>

    )}

</div>
{/* =========================
    RIGHT SECTION
========================= */}

<div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border p-5">

    <h2 className="text-xl font-semibold mb-4">

        Coupon

    </h2>

    <div className="flex gap-3">

        <input

            value={couponCode}

            onChange={(e)=>setCouponCode(e.target.value)}

            placeholder="Enter Coupon Code"

            className="flex-1 border rounded-lg px-4 py-3"

        />

        <button

            onClick={applyCoupon}

            className="bg-green-600 hover:bg-green-700 text-white px-5 rounded-lg"

        >

            Apply

        </button>

    </div>

    {

        appliedCoupon && (

            <p className="mt-3 text-green-600">

                Coupon Applied:

                <b> {appliedCoupon.code}</b>

            </p>

        )

    }

</div>

    {/* Order Summary */}

    <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">

        <h2 className="text-xl font-semibold text-slate-800 mb-6">

            Order Summary

        </h2>

        <div className="space-y-4">

            <div className="flex justify-between text-slate-600">

                <span>Subtotal</span>
<div className="flex justify-between text-green-600">

    <span>

        Discount

    </span>

    <span>

        - {currency}{discount}

    </span>

</div>
                <span>
                    {currency}{summary?.subTotal ?? 0}
                </span>

            </div>

            <div className="flex justify-between text-slate-600">

                <span>Shipping</span>

                <span>
                    {currency}{summary?.shippingCharge ?? 0}
                </span>

            </div>

            <div className="flex justify-between text-slate-600">

                <span>Tax</span>

                <span>
                    {currency}{summary?.tax ?? 0}
                </span>

            </div>

            <hr />

            <div className="flex justify-between text-xl font-bold text-slate-800">

                <span>Total</span>

                <span>

                    {currency}{summary?.total ?? 0}

                </span>

            </div>

        </div>

      <button

    onClick={placeOrder}

    disabled={!selectedAddress}

    className={`w-full mt-8 py-3 rounded-xl font-semibold transition

    ${
        selectedAddress

            ? paymentMethod === "COD"

                ? "bg-green-600 hover:bg-green-700 text-white"

                : "bg-blue-600 hover:bg-blue-700 text-white"

            : "bg-slate-300 text-slate-500 cursor-not-allowed"

    }`}

>

    {paymentMethod === "COD"

        ? "Place Order"

        : `Pay ${currency}${summary?.total ?? 0}`}

</button>

        <div className="mt-8 space-y-4 text-sm text-slate-600">

            <div className="flex items-center gap-3">

                <Truck
                    className="text-green-600"
                    size={20}
                />

                <span>

                    Free delivery on all orders

                </span>

            </div>

            <div className="flex items-center gap-3">

                <ShieldCheck
                    className="text-green-600"
                    size={20}
                />

                <span>

                    100% Secure Checkout

                </span>

            </div>

            <div className="flex items-center gap-3">

                <CreditCard
                    className="text-green-600"
                    size={20}
                />

                <span>

                    Cash on Delivery Available

                </span>

            </div>

        </div>

    </div>

</div>

</div>

<AddressModal

    open={addressModal}

    address={editingAddress}

    onClose={() => {

        setAddressModal(false);

        setEditingAddress(null);

    }}

    onSuccess={() => {

        loadCheckout();

    }}

/>

</div>

</div>
</>
);
}