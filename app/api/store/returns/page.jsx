"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/Image";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import {
    RotateCcw,
    Search,
    CheckCircle2,
    XCircle,
    Wallet,
    Eye,
    Package,
    User,
    Clock3,
} from "lucide-react";

export default function StoreReturns() {

    const currency =
        process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

    const [loading, setLoading] = useState(true);

    const [returns, setReturns] = useState([]);

    const [summary, setSummary] = useState({});

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    const [selectedReturn, setSelectedReturn] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {

        fetchReturns();

    }, []);

    async function fetchReturns() {

        try {

            const res = await fetch("/api/store/returns", {

                credentials: "include",

            });

            const data = await res.json();

            if (res.ok) {

                setReturns(data.returns);

                setSummary(data.summary);

            }

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    }

    const filteredReturns = useMemo(() => {

        return returns.filter((item) => {

            const keyword = search.toLowerCase();

            const matchesSearch =

                item.user.name.toLowerCase().includes(keyword) ||

                item.order.id.toLowerCase().includes(keyword) ||

                item.reason.toLowerCase().includes(keyword);

            const matchesStatus =

                statusFilter === "ALL"

                    ? true

                    : item.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [returns, search, statusFilter]);

    async function updateStatus(id, status) {

        try {

            const res = await fetch(

                `/api/store/returns/${id}`,

                {

                    method: "PUT",

                    headers: {

                        "Content-Type":

                            "application/json",

                    },

                    credentials: "include",

                    body: JSON.stringify({

                        status,

                    }),

                }

            );

            if (res.ok) {

                fetchReturns();

            }

        }

        catch (error) {

            console.log(error);

        }

    }

    function openModal(item) {

        setSelectedReturn(item);

        setModalOpen(true);

    }

    function closeModal() {

        setModalOpen(false);

        setSelectedReturn(null);

    }

    function badge(status) {

        switch (status) {

            case "REQUESTED":

                return "bg-yellow-100 text-yellow-700";

            case "APPROVED":

                return "bg-blue-100 text-blue-700";

            case "REJECTED":

                return "bg-red-100 text-red-700";

            case "REFUNDED":

                return "bg-green-100 text-green-700";

            default:

                return "bg-slate-100";

        }

    }

    if (loading)

        return (

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {[...Array(8)].map((_, index) => (

                <ProductSkeleton key={index} />

            ))}

        </div>

        );

    return (

        <div className="max-w-7xl mx-auto p-8">

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold">

                        Return Requests

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Manage all customer return requests

                    </p>

                </div>

            </div>

            {/* Summary */}

            <div className="grid lg:grid-cols-4 gap-5">

                <div className="bg-white rounded-2xl shadow border p-6">

                    <RotateCcw className="text-yellow-600" />

                    <p className="text-slate-500 mt-4">

                        Requested

                    </p>

                    <h2 className="text-3xl font-bold">

                        {summary.requested || 0}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow border p-6">

                    <CheckCircle2 className="text-blue-600" />

                    <p className="text-slate-500 mt-4">

                        Approved

                    </p>

                    <h2 className="text-3xl font-bold">

                        {summary.approved || 0}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow border p-6">

                    <XCircle className="text-red-600" />

                    <p className="text-slate-500 mt-4">

                        Rejected

                    </p>

                    <h2 className="text-3xl font-bold">

                        {summary.rejected || 0}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow border p-6">

                    <Wallet className="text-green-600" />

                    <p className="text-slate-500 mt-4">

                        Refunded

                    </p>

                    <h2 className="text-3xl font-bold">

                        {summary.refunded || 0}

                    </h2>

                </div>

            </div>

            {/* Search */}

            <div className="bg-white rounded-2xl border shadow mt-8 p-6">

                <div className="flex flex-col lg:flex-row gap-4">

                    <div className="relative flex-1">

                        <Search

                            size={18}

                            className="absolute left-4 top-4 text-slate-400"

                        />

                        <input

                            placeholder="Search customer, reason or order id..."

                            value={search}

                            onChange={(e) => setSearch(e.target.value)}

                            className="w-full border rounded-xl pl-11 py-3"

                        />

                    </div>

                    <select

                        value={statusFilter}

                        onChange={(e) => setStatusFilter(e.target.value)}

                        className="border rounded-xl px-5"

                    >

                        <option value="ALL">

                            All Status

                        </option>

                        <option value="REQUESTED">

                            Requested

                        </option>

                        <option value="APPROVED">

                            Approved

                        </option>

                        <option value="REJECTED">

                            Rejected

                        </option>

                        <option value="REFUNDED">

                            Refunded

                        </option>

                    </select>

                </div>


                {/* Returns Table */}

                <div className="overflow-x-auto mt-8">

                    {

                        filteredReturns.length === 0 ?

                            (

                                <div className="bg-white rounded-2xl shadow border py-20 text-center">

                                    <Package
                                        size={70}
                                        className="mx-auto text-slate-300"
                                    />

                                    <h2 className="mt-6 text-2xl font-semibold">

                                        No Return Requests Found

                                    </h2>

                                    <p className="text-slate-500 mt-2">

                                        Customer return requests will appear here.

                                    </p>

                                </div>

                            )

                            :

                            (

                                <table className="min-w-full bg-white rounded-2xl overflow-hidden shadow border">

                                    <thead className="bg-slate-100">

                                        <tr className="text-left text-slate-700">

                                            <th className="px-6 py-4">

                                                Customer

                                            </th>

                                            <th className="px-6 py-4">

                                                Order

                                            </th>

                                            <th className="px-6 py-4">

                                                Reason

                                            </th>

                                            <th className="px-6 py-4">

                                                Refund

                                            </th>

                                            <th className="px-6 py-4">

                                                Status

                                            </th>

                                            <th className="px-6 py-4 text-center">

                                                Actions

                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {

                                            filteredReturns.map((item) => (

                                                <tr

                                                    key={item.id}

                                                    className="border-b hover:bg-slate-50 transition"

                                                >

                                                    <td className="px-6 py-5">

                                                        <div className="flex items-center gap-4">

                                                            <div className="h-11 w-11 rounded-full bg-green-100 flex items-center justify-center">

                                                                <User
                                                                    size={18}
                                                                    className="text-green-700"
                                                                />

                                                            </div>

                                                            <div>

                                                                <h3 className="font-semibold">

                                                                    {item.user.name}

                                                                </h3>

                                                                <p className="text-sm text-slate-500">

                                                                    {item.user.email}

                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-5">

                                                        <div>

                                                            <p className="font-medium">

                                                                #{item.order.id.slice(-8)}

                                                            </p>

                                                            <p className="text-sm text-slate-500">

                                                                {

                                                                    new Date(item.createdAt)

                                                                        .toLocaleDateString()

                                                                }

                                                            </p>

                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-5">

                                                        <div>

                                                            <p className="font-medium">

                                                                {item.reason}

                                                            </p>

                                                            <p className="text-sm text-slate-500 truncate max-w-[180px]">

                                                                {item.description || "No Description"}

                                                            </p>

                                                        </div>

                                                    </td>

                                                    <td className="px-6 py-5">

                                                        <span className="font-bold text-green-700">

                                                            {currency}

                                                            {item.refundAmount}

                                                        </span>

                                                    </td>

                                                    <td className="px-6 py-5">

                                                        <span

                                                            className={`px-4 py-2 rounded-full text-xs font-semibold ${badge(item.status)}`}

                                                        >

                                                            {

                                                                item.status

                                                                    .replace(/_/g, " ")

                                                            }

                                                        </span>

                                                    </td>

                                                    <td className="px-6 py-5">

                                                        <div className="flex justify-center gap-2">

                                                            <button

                                                                onClick={() => openModal(item)}

                                                                className="h-10 w-10 rounded-lg bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center"

                                                            >

                                                                <Eye size={18} />

                                                            </button>

                                                            {

                                                                item.status === "REQUESTED" &&

                                                                <>

                                                                    <button

                                                                        onClick={() => updateStatus(item.id, "APPROVED")}

                                                                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"

                                                                    >

                                                                        Approve

                                                                    </button>

                                                                    <button

                                                                        onClick={() => updateStatus(item.id, "REJECTED")}

                                                                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"

                                                                    >

                                                                        Reject

                                                                    </button>

                                                                </>

                                                            }
                                                            {

                                                                item.status === "APPROVED"

                                                                    ?

                                                                    <button

                                                                        onClick={() => updateStatus(

                                                                            item.id,

                                                                            "REFUNDED"

                                                                        )}

                                                                        className="bg-green-600 text-white px-4 py-2 rounded-lg"

                                                                    >

                                                                        Refund Customer

                                                                    </button>

                                                                    :

                                                                    item.status === "REFUNDED"

                                                                    &&

                                                                    <span className="text-green-600 font-semibold">

                                                                        ✓ Refunded

                                                                    </span>

                                                            }

                                                        </div>

                                                    </td>

                                                </tr>

                                            ))

                                        }

                                    </tbody>

                                </table>

                            )

                    }

                </div>

                {/* Return Details Modal */}

                {

                    modalOpen &&

                    selectedReturn &&

                    (

                        <div

                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-6"

                            onClick={closeModal}

                        >

                            <div

                                onClick={(e) => e.stopPropagation()}

                                className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"

                            >
                                <div className="flex items-center justify-between p-7 border-b">

                                    <div>

                                        <h2 className="text-3xl font-bold">

                                            Return Details

                                        </h2>

                                        <p className="text-slate-500 mt-1">

                                            Return ID #{selectedReturn.id.slice(-8)}

                                        </p>

                                    </div>

                                    <span

                                        className={`px-4 py-2 rounded-full text-sm font-semibold ${badge(selectedReturn.status)}`}

                                    >

                                        {

                                            selectedReturn.status.replace(/_/g, " ")

                                        }

                                    </span>

                                </div>

                                <div className="grid lg:grid-cols-2 gap-8 p-7">

                                    {/* Customer */}

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <h3 className="text-lg font-semibold mb-5">

                                            Customer Information

                                        </h3>

                                        <div className="space-y-3">

                                            <div>

                                                <p className="text-slate-500 text-sm">

                                                    Name

                                                </p>

                                                <p className="font-medium">

                                                    {selectedReturn.user.name}

                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-slate-500 text-sm">

                                                    Email

                                                </p>

                                                <p className="font-medium">

                                                    {selectedReturn.user.email}

                                                </p>

                                            </div>

                                            <div>

                                                <p className="text-slate-500 text-sm">

                                                    Phone

                                                </p>

                                                <p className="font-medium">

                                                    {selectedReturn.order.address.phone}

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                    {/* Shipping */}

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <h3 className="text-lg font-semibold mb-5">

                                            Shipping Address

                                        </h3>

                                        <p>

                                            {

                                                selectedReturn.order.address.name

                                            }

                                        </p>

                                        <p>

                                            {

                                                selectedReturn.order.address.street

                                            }

                                        </p>

                                        <p>

                                            {

                                                selectedReturn.order.address.city

                                            }

                                            ,

                                            {

                                                selectedReturn.order.address.state

                                            }

                                        </p>

                                        <p>

                                            {

                                                selectedReturn.order.address.zip

                                            }

                                        </p>

                                        <p>

                                            {

                                                selectedReturn.order.address.country

                                            }

                                        </p>

                                    </div>

                                </div>

                                {/* Products */}

                                <div className="px-7">

                                    <h3 className="text-xl font-semibold mb-5">

                                        Returned Products

                                    </h3>

                                    <div className="space-y-4">

                                        {

                                            selectedReturn.order.orderItems.map(

                                                (item) => (

                                                    <div

                                                        key={item.product.id}

                                                        className="border rounded-2xl p-5 flex gap-5"

                                                    >

                                                        <Image

                                                            src={item.product.images[0]}

                                                            className="h-24 w-24 rounded-xl object-cover border"

                                                        />

                                                        <div className="flex-1">

                                                            <h3 className="font-semibold text-lg">

                                                                {

                                                                    item.product.name

                                                                }

                                                            </h3>

                                                            <p className="text-slate-500 mt-2">

                                                                Quantity :

                                                                {

                                                                    item.quantity

                                                                }

                                                            </p>

                                                            <p className="text-green-700 font-semibold mt-2">

                                                                {currency}

                                                                {

                                                                    item.price

                                                                }

                                                            </p>

                                                        </div>

                                                    </div>

                                                )

                                            )

                                        }

                                    </div>

                                </div>

                                {/* Return */}

                                <div className="grid lg:grid-cols-2 gap-8 p-7">

                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                                        <h3 className="font-semibold mb-4">

                                            Return Reason

                                        </h3>

                                        <p className="font-medium">

                                            {

                                                selectedReturn.reason

                                            }

                                        </p>

                                        <p className="text-slate-600 mt-3">

                                            {

                                                selectedReturn.description ||

                                                "No additional description."

                                            }

                                        </p>

                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                                        <h3 className="font-semibold mb-4">

                                            Refund Information

                                        </h3>

                                        <p>

                                            Refund Amount

                                        </p>

                                        <h2 className="text-3xl font-bold text-green-700 mt-2">

                                            {currency}

                                            {

                                                selectedReturn.refundAmount

                                            }

                                        </h2>

                                        <div className="mt-5 flex items-center gap-2 text-slate-600">

                                            <Clock3 size={18} />

                                            {

                                                new Date(

                                                    selectedReturn.createdAt

                                                ).toLocaleString()

                                            }

                                        </div>

                                    </div>

                                </div>

                                {/* Footer */}

                                <div className="flex justify-end gap-3 border-t p-6">

                                    <button

                                        onClick={closeModal}

                                        className="px-6 py-3 rounded-xl border hover:bg-slate-100"

                                    >

                                        Close

                                    </button>

                                </div>

                            </div>

                        </div>

                    )

                }

            </div>

        </div>

    );

}
