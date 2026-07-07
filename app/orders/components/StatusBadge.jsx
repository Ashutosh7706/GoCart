"use client";

import {
    CheckCircle2,
    Clock3,
    Package,
    Truck,
    XCircle,
    Loader2,
    AlertCircle,
} from "lucide-react";

export default function StatusBadge({

    status,

    type = "order",

}) {

    let config = {};

    // =========================
    // Order Status
    // =========================

    if (type === "order") {

        switch (status) {

            case "ORDER_PLACED":

                config = {
                    label: "Order Placed",
                    icon: Clock3,
                    className:
                        "bg-yellow-100 text-yellow-700 border-yellow-200",
                };

                break;

            case "PROCESSING":

                config = {
                    label: "Processing",
                    icon: Loader2,
                    className:
                        "bg-blue-100 text-blue-700 border-blue-200",
                    spin: true,
                };

                break;

            case "SHIPPED":

                config = {
                    label: "Shipped",
                    icon: Truck,
                    className:
                        "bg-purple-100 text-purple-700 border-purple-200",
                };

                break;

            case "DELIVERED":

                config = {
                    label: "Delivered",
                    icon: CheckCircle2,
                    className:
                        "bg-green-100 text-green-700 border-green-200",
                };

                break;

            default:

                config = {
                    label: "Unknown",
                    icon: AlertCircle,
                    className:
                        "bg-slate-100 text-slate-700 border-slate-200",
                };

        }

    }

    // =========================
    // Payment Status
    // =========================

    if (type === "payment") {

        switch (status) {

            case "SUCCESS":

                config = {
                    label: "Paid",
                    icon: CheckCircle2,
                    className:
                        "bg-green-100 text-green-700 border-green-200",
                };

                break;

            case "PENDING":

                config = {
                    label: "Pending",
                    icon: Clock3,
                    className:
                        "bg-yellow-100 text-yellow-700 border-yellow-200",
                };

                break;

            case "FAILED":

                config = {
                    label: "Failed",
                    icon: XCircle,
                    className:
                        "bg-red-100 text-red-700 border-red-200",
                };

                break;

            case "REFUNDED":

                config = {
                    label: "Refunded",
                    icon: Package,
                    className:
                        "bg-slate-200 text-slate-700 border-slate-300",
                };

                break;

            default:

                config = {
                    label: "Unknown",
                    icon: AlertCircle,
                    className:
                        "bg-slate-100 text-slate-700 border-slate-200",
                };

        }

    }

    const Icon = config.icon;

    return (

        <span
            className={`
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                border
                ${config.className}
            `}
        >

            <Icon
                size={16}
                className={config.spin ? "animate-spin" : ""}
            />

            {config.label}

        </span>

    );

}