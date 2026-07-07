"use client";

import {
    CheckCircle2,
    Circle,
    Clock3,
} from "lucide-react";

const steps = [
    "ORDER_PLACED",
    "PROCESSING",
    "PACKED",
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
];

const labels = {
    ORDER_PLACED: "Order Placed",
    PROCESSING: "Processing",
    PACKED: "Packed",
    SHIPPED: "Shipped",
    OUT_FOR_DELIVERY: "Out For Delivery",
    DELIVERED: "Delivered",
};

export default function OrderTracking({ status }) {

    const currentStep = steps.indexOf(status);

    return (

        <div className="mt-5 bg-slate-50 border rounded-xl p-5">

            <h3 className="text-base font-semibold text-slate-800 mb-5">

                Order Tracking

            </h3>

            <div className="space-y-1">

                {steps.map((step, index) => {

                    const completed = index < currentStep;

                    const active = index === currentStep;

                    return (

                        <div
                            key={step}
                            className="flex gap-4"
                        >

                            {/* Left */}

                            <div className="flex flex-col items-center">

                                {completed ? (

                                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">

                                        <CheckCircle2
                                            size={18}
                                            className="text-white"
                                        />

                                    </div>

                                ) : active ? (

                                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">

                                        <Clock3
                                            size={17}
                                            className="text-white"
                                        />

                                    </div>

                                ) : (

                                    <div className="h-8 w-8 rounded-full border-2 border-slate-300 flex items-center justify-center">

                                        <Circle
                                            size={10}
                                            className="text-slate-300"
                                            fill="currentColor"
                                        />

                                    </div>

                                )}

                                {index !== steps.length - 1 && (

                                    <div
                                        className={`w-[2px] h-12

                                        ${
                                            completed
                                                ? "bg-green-500"
                                                : "bg-slate-300"
                                        }`}
                                    />

                                )}

                            </div>

                            {/* Right */}

                            <div className="pb-8">

                                <h4
                                    className={`font-medium

                                    ${
                                        completed
                                            ? "text-green-600"
                                            : active
                                            ? "text-blue-600"
                                            : "text-slate-500"
                                    }`}
                                >

                                    {labels[step]}

                                </h4>

                                <p className="text-sm text-slate-500 mt-1">

                                    {completed &&
                                        "Completed"}

                                    {active &&
                                        "Current Status"}

                                    {!completed &&
                                        !active &&
                                        "Pending"}

                                </p>

                            </div>

                        </div>

                    );

                })}

            </div>

        </div>

    );

}