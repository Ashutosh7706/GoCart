"use client";

import OrderHeader from "./OrderHeader";
import OrderTimeline from "./OrderTimeline";
import ProductCard from "./ProductCard";
import AddressCard from "./AddressCart";
import PaymentCard from "./PaymentCard";
import OrderSummary from "./OrderSummary";
import OrderActions from "./OrderActions";

export default function OrderCard({
    order,
    currency,
    expanded,
    onToggle,
}) {
    return (
        <div className="w-full  bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">

            {/* Header */}

            <OrderHeader
                order={order}
                currency={currency}
                expanded={expanded}
                onToggle={onToggle}
            />

            {/* Timeline */}

            <div className="px-4 py-2">
                <OrderTimeline
                    status={order.status}
                />
            </div>

            {/* Expanded Details */}

            {expanded && (

                <div className="border-t border-slate-200">

                    <div className="p-4">

                        {/* Products */}

                        <div>

                            <h2 className="text-base font-semibold text-slate-800 mb-3">
                                Products
                            </h2>

                            <div className="space-y-3">

                                {order.orderItems.map((item) => (

                                    <ProductCard
                                        key={item.productId}
                                        item={item}
                                        currency={currency}
                                    />

                                ))}

                            </div>

                        </div>

                        {/* Address + Payment */}

                        <div className="grid lg:grid-cols-2 gap-4 mt-5">

                            <AddressCard
                                address={order.address}
                            />

                            <PaymentCard
                                order={order}
                            />

                        </div>

                        {/* Summary */}

                        <div className="mt-5">

                            <OrderSummary
                                order={order}
                                currency={currency}
                            />

                        </div>

                        {/* Actions */}

                        <div className="mt-4">

                            <OrderActions
                                order={order}
                            />

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}