"use client";

import {
    CheckCircle2,
    Clock3,
    Loader2,
    Truck,
} from "lucide-react";

const steps = [
    {
        key: "ORDER_PLACED",
        label: "Order Placed",
        icon: Clock3,
    },
    {
        key: "PROCESSING",
        label: "Processing",
        icon: Loader2,
    },
    {
        key: "SHIPPED",
        label: "Shipped",
        icon: Truck,
    },
    {
        key: "DELIVERED",
        label: "Delivered",
        icon: CheckCircle2,
    },
];

export default function OrderTimeline({ status }) {

    const currentStep = steps.findIndex(
        (step) => step.key === status
    );

    return (

        <div className="mt-2">

            {/* Progress Bar */}

            <div className="relative mb-4">

                <div className="absolute top-4.5 left-0 w-full h-0.5 bg-slate-200 rounded-full"></div>

                <div
                    className="absolute top-4.5 left-0 h-1 bg-green-600 rounded-full transition-all duration-700"
                    style={{
                        width: `${((currentStep + 1) / steps.length) * 100}%`,
                    }}
                />

                <div className="relative flex justify-between">

                    {steps.map((step, index) => {

                        const completed = index <= currentStep;

                        const Icon = step.icon;

                        return (

                            <div
                                key={step.key}
                                className="flex flex-col items-center text-center w-16"
                            >

                                <div
                                    className={`
                                        w-7
                                        h-7
                                        rounded-full
                                        flex
                                        items-center
                                        justify-center
                                        border-2
                                        transition-all
                                        duration-300
                                        ${
                                            completed
                                                ? "bg-green-600 border-green-600 text-white"
                                                : "bg-white border-slate-300 text-slate-400"
                                        }
                                    `}
                                >

                                    <Icon
                                        size={40}
                                        className={
                                            step.key === "PROCESSING" &&
                                            completed
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                </div>

                                <p
                                    className={`
                                        mt-1
                                        text-sm 
                                        font-medium
                                        ${
                                            completed
                                                ? "text-green-600"
                                                : "text-slate-400"
                                        }
                                    `}
                                >

                                    {step.label}

                                </p>

                            </div>

                        );

                    })}

                </div>

            </div>

        </div>

    );

}