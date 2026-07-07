'use client'
import Image from "@/components/Image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import OrderTracking from "./OrderTracking";

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p>{currency}{item.price} Qty : {item.quantity} </p>
                                    <p className="mb-1">Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-green-500 hover:bg-green-50 transition ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }</div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                     <OrderTracking

                        status={order.status}

                    />
                    <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium

    ${order.status === "ORDER_PLACED"

                                ? "bg-blue-100 text-blue-700"

                                : order.status === "PROCESSING"

                                    ? "bg-yellow-100 text-yellow-700"

                                    : order.status === "SHIPPED"

                                        ? "bg-purple-100 text-purple-700"

                                        : "bg-green-100 text-green-700"

                            }`}
                    >

                        <DotIcon size={16} />

                        {order.status.replaceAll("_", " ")}

                    </div>
                   
                    <div className="mt-4 space-y-2 text-sm">

                        <div className="flex items-center gap-2">

                            <div className={`w-3 h-3 rounded-full ${["ORDER_PLACED", "PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
                                ? "bg-green-600"
                                : "bg-slate-300"
                                }`} />

                            <span>Order Placed</span>

                        </div>

                        <div className="flex items-center gap-2">

                            <div className={`w-3 h-3 rounded-full ${["PROCESSING", "SHIPPED", "DELIVERED"].includes(order.status)
                                ? "bg-green-600"
                                : "bg-slate-300"
                                }`} />

                            <span>Processing</span>

                        </div>

                        <div className="flex items-center gap-2">

                            <div className={`w-3 h-3 rounded-full ${["SHIPPED", "DELIVERED"].includes(order.status)
                                ? "bg-green-600"
                                : "bg-slate-300"
                                }`} />

                            <span>Shipped</span>

                        </div>

                        <div className="flex items-center gap-2">

                            <div className={`w-3 h-3 rounded-full ${order.status === "DELIVERED"
                                ? "bg-green-600"
                                : "bg-slate-300"
                                }`} />

                            <span>Delivered</span>

                        </div>

                    </div>

                    <div className="mt-3">

                        <span
                            className={`px-3 py-1 rounded-full text-xs

        ${order.payment?.status === "SUCCESS"

                                    ? "bg-green-100 text-green-700"

                                    : order.payment?.status === "FAILED"

                                        ? "bg-red-100 text-red-700"

                                        : "bg-yellow-100 text-yellow-700"

                                }`}
                        >

                            Payment: {order.payment?.status || "PENDING"}
                            <button
                                onClick={() => window.open(`/api/orders/${order.id}/invoice`)}
                                className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Download Invoice
                            </button>
                        </span>

                    </div>

                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <br />
                    <div className="flex items-center">
                        <span className='text-center mx-auto px-6 py-1.5 rounded bg-green-100 text-green-700' >
                            {order.status.replace(/_/g, ' ').toLowerCase()}
                        </span>
                    </div>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem