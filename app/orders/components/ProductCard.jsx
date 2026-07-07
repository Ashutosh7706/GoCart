"use client";

import Image from "@/components/Image";

export default function ProductCard({

    item,

    currency,

}) {

    return (

        <div className="bg-slate-50 hover:bg-green-50 transition-all duration-300 rounded-2xl p-5 border border-transparent hover:border-green-200">

            <div className="flex flex-col md:flex-row gap-5">

                {/* Product Image */}

                <div className="flex-shrink-0">

                    <Image
                        src={
                            item.product?.images?.[0] ||
                            "/placeholder-product.png"
                        }
                        alt={item.product?.name || "Product"}
                        width={120}
                        height={120}
                        className="rounded-xl object-cover border w-28 h-28"
                    />

                </div>

                {/* Product Details */}

                <div className="flex-1">

                    <h2 className="text-xl font-semibold text-slate-800">

                        {item.product?.name}

                    </h2>

                    <p className="text-slate-500 mt-2">

                        {item.product?.category || "General"}

                    </p>

                    <div className="grid grid-cols-3 gap-6 mt-6">

                        <div>

                            <p className="text-xs text-slate-400 uppercase tracking-wide">

                                Quantity

                            </p>

                            <p className="font-semibold mt-1">

                                {item.quantity}

                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-slate-400 uppercase tracking-wide">

                                Unit Price

                            </p>

                            <p className="font-semibold mt-1">

                                {currency}
                                {item.price}

                            </p>

                        </div>

                        <div>

                            <p className="text-xs text-slate-400 uppercase tracking-wide">

                                Total

                            </p>

                            <p className="font-bold text-green-600 mt-1">

                                {currency}
                                {item.quantity * item.price}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}