"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmptyOrders() {

    const router = useRouter();

    return (

        <div className="min-h-[70vh] flex items-center justify-center">

            <div className="bg-white border border-slate-200 shadow-lg rounded-3xl max-w-xl w-full p-10 text-center">

                {/* Icon */}

                <div className="mx-auto w-28 h-28 rounded-full bg-green-50 flex items-center justify-center">

                    <ShoppingBag
                        size={55}
                        className="text-green-600"
                    />

                </div>

                {/* Heading */}

                <h1 className="mt-8 text-4xl font-bold text-slate-800">

                    No Orders Yet

                </h1>

                {/* Description */}

                <p className="mt-5 text-slate-500 leading-7">

                    Looks like you haven't placed any orders yet.

                    Start exploring our latest products and place
                    your first order today.

                </p>

                {/* Features */}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">

                    <div className="bg-slate-50 rounded-xl p-4">

                        <p className="text-3xl">

                            🚚

                        </p>

                        <p className="mt-2 text-sm text-slate-600">

                            Fast Delivery

                        </p>

                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">

                        <p className="text-3xl">

                            🔒

                        </p>

                        <p className="mt-2 text-sm text-slate-600">

                            Secure Payment

                        </p>

                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">

                        <p className="text-3xl">

                            ⭐

                        </p>

                        <p className="mt-2 text-sm text-slate-600">

                            Premium Quality

                        </p>

                    </div>

                </div>

                {/* Button */}

                <button

                    onClick={() => router.push("/shop")}

                    className="mt-10 inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 transition-all duration-300 hover:scale-105 active:scale-95 text-white px-8 py-4 rounded-2xl font-semibold shadow-md"

                >

                    Continue Shopping

                    <ArrowRight size={20} />

                </button>

            </div>

        </div>

    );

}