"use client";

import {
    Truck,
    FileDown,
    RotateCcw,
    Star,
    MessageCircle,
} from "lucide-react";

export default function OrderActions({

    order,

}) {

    function handleTrackOrder() {

        // Future
        console.log("Track Order", order.id);

    }

    function handleInvoice() {

        window.open(
            `/api/orders/${order.id}/invoice`,
            "_blank"
        );

    }

    function handleBuyAgain() {

        console.log("Buy Again");

    }

    function handleReview() {

        console.log("Write Review");

    }

    function handleContactSeller() {

        console.log("Contact Seller");

    }

    return (

        <div className="mt-10 border-t border-slate-200 pt-8">

            <div className="flex flex-wrap gap-4 justify-between">

                <div className="flex flex-wrap gap-4">

                    {/* Track */}

                    <button

                        onClick={handleTrackOrder}

                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 transition-all duration-300 text-white font-semibold shadow hover:shadow-lg"

                    >

                        <Truck size={18} />

                        Track Order

                    </button>

                    {/* Invoice */}

                    <button

                        onClick={handleInvoice}

                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:border-green-500 hover:text-green-600 transition"

                    >

                        <FileDown size={18} />

                        Invoice

                    </button>

                    {/* Contact */}

                    <button

                        onClick={handleContactSeller}

                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-slate-300 bg-white hover:border-green-500 hover:text-green-600 transition"

                    >

                        <MessageCircle size={18} />

                        Contact Seller

                    </button>

                </div>

                <div className="flex flex-wrap gap-4">

                    {/* Buy Again */}

                    <button

                        onClick={handleBuyAgain}

                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-black transition text-white"

                    >

                        <RotateCcw size={18} />

                        Buy Again

                    </button>

                    {/* Review */}

                    {order.status === "DELIVERED" && (

                        <button

                            onClick={handleReview}

                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 transition text-white"

                        >

                            <Star size={18} />

                            Write Review

                        </button>

                    )}

                </div>

            </div>

        </div>

    );

}