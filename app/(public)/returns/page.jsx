"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "@/components/Image";
   import ProductSkeleton from "@/components/skeletons/ProductSkeleton";

import {
    RotateCcw,
    Search,
    Wallet,
    Clock3,
    CheckCircle2,
    XCircle,
    Eye,
} from "lucide-react";

export default function ReturnsPage() {

    const currency =
        process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";

    const [returns, setReturns] = useState([]);

    const [loading, setLoading] = useState(true);

    const [selectedReturn, setSelectedReturn] = useState(null);

    const [modalOpen, setModalOpen] = useState(false);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {

        fetchReturns();

    }, []);

    async function fetchReturns() {

        try {

            const res = await fetch(

                "/api/returns",

                {

                    credentials: "include",

                }

            );

            const data = await res.json();

            if (res.ok) {

                setReturns(data);

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

                item.reason.toLowerCase().includes(keyword) ||

                item.order.id.toLowerCase().includes(keyword);

            const matchesStatus =

                statusFilter === "ALL"

                    ? true

                    : item.status === statusFilter;

            return matchesSearch && matchesStatus;

        });

    }, [

        returns,

        search,

        statusFilter,

    ]);

    function badge(status){

        switch(status){

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

    function openModal(item){

        setSelectedReturn(item);

        setModalOpen(true);

    }

    function closeModal(){

        setModalOpen(false);

        setSelectedReturn(null);

    }

    const summary = {

        requested: returns.filter(

            r=>r.status==="REQUESTED"

        ).length,

        approved: returns.filter(

            r=>r.status==="APPROVED"

        ).length,

        refunded: returns.filter(

            r=>r.status==="REFUNDED"

        ).length,

        rejected: returns.filter(

            r=>r.status==="REJECTED"

        ).length,

    };

  
      
if (loading) {

    return (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {[...Array(8)].map((_, index) => (

                <ProductSkeleton key={index} />

            ))}

        </div>

    );


}

        

    return(

        <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="mb-10">

                <h1 className="text-4xl font-bold">

                    My Returns

                </h1>

                <p className="text-slate-500 mt-2">

                    View and manage your return requests.

                </p>

            </div>

            {/* Summary */}

            <div className="grid lg:grid-cols-4 gap-5">

                <div className="bg-white rounded-2xl shadow border p-6">

                    <RotateCcw className="text-yellow-600"/>

                    <p className="text-slate-500 mt-4">

                        Requested

                    </p>

                    <h2 className="text-3xl font-bold">

                        {summary.requested}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow border p-6">

                    <CheckCircle2 className="text-blue-600"/>

                    <p className="text-slate-500 mt-4">

                        Approved

                    </p>

                    <h2 className="text-3xl font-bold">

                        {summary.approved}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow border p-6">

                    <Wallet className="text-green-600"/>

                    <p className="text-slate-500 mt-4">

                        Refunded

                    </p>

                    <h2 className="text-3xl font-bold">

                        {summary.refunded}

                    </h2>

                </div>

                <div className="bg-white rounded-2xl shadow border p-6">

                    <XCircle className="text-red-600"/>

                    <p className="text-slate-500 mt-4">

                        Rejected

                    </p>

                    <h2 className="text-3xl font-bold">

                        {summary.rejected}

                    </h2>

                </div>

            </div>

            {/* Search */}

            <div className="bg-white rounded-2xl shadow border p-6 mt-8">

                <div className="flex flex-col lg:flex-row gap-4">

                    <div className="relative flex-1">

                        <Search

                            size={18}

                            className="absolute left-4 top-4 text-slate-400"

                        />

                        <input

                            placeholder="Search returns..."

                            value={search}

                            onChange={(e)=>setSearch(e.target.value)}

                            className="w-full border rounded-xl pl-11 py-3"

                        />

                    </div>

                    <select

                        value={statusFilter}

                        onChange={(e)=>setStatusFilter(e.target.value)}

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
                     {/* Returns */}

                <div className="mt-8">

                    {

                        filteredReturns.length === 0 ?

                        (

                            <div className="bg-white rounded-3xl shadow border py-24 text-center">

                                <RotateCcw
                                    size={70}
                                    className="mx-auto text-slate-300"
                                />

                                <h2 className="text-2xl font-semibold mt-6">

                                    No Return Requests

                                </h2>

                                <p className="text-slate-500 mt-2">

                                    Your return requests will appear here.

                                </p>

                            </div>

                        )

                        :

                        (

                            <div className="grid xl:grid-cols-2 gap-6">

                                {

                                    filteredReturns.map((item)=>(

                                        <div

                                            key={item.id}

                                            className="bg-white rounded-3xl border shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"

                                        >

                                            <div className="p-6">

                                                <div className="flex justify-between items-start">

                                                    <div>

                                                        <p className="text-slate-500 text-sm">

                                                            Return ID

                                                        </p>

                                                        <h3 className="font-bold text-lg">

                                                            #

                                                            {

                                                                item.id.slice(-8)

                                                            }

                                                        </h3>

                                                    </div>

                                                    <span

                                                        className={`px-4 py-2 rounded-full text-xs font-semibold ${badge(item.status)}`}

                                                    >

                                                        {

                                                            item.status

                                                            .replace(/_/g," ")

                                                        }

                                                    </span>

                                                </div>

                                                <div className="mt-6 flex gap-5">

                                                    <Image

                                                        src={

                                                            item.order.orderItems[0]

                                                            .product.images[0]

                                                        }

                                                        className="w-28 h-28 rounded-2xl object-cover border"

                                                    />

                                                    <div className="flex-1">

                                                        <h2 className="font-semibold text-lg">

                                                            {

                                                                item.order.orderItems[0]

                                                                .product.name

                                                            }

                                                        </h2>

                                                        <p className="text-slate-500 mt-2">

                                                            Qty :

                                                            {

                                                                item.order.orderItems[0]

                                                                .quantity

                                                            }

                                                        </p>

                                                        <p className="text-slate-500">

                                                            Order #

                                                            {

                                                                item.order.id

                                                                .slice(-8)

                                                            }

                                                        </p>

                                                    </div>

                                                </div>

                                                <div className="grid grid-cols-2 gap-5 mt-6">

                                                    <div>

                                                        <p className="text-slate-500 text-sm">

                                                            Reason

                                                        </p>

                                                        <h4 className="font-medium mt-1">

                                                            {

                                                                item.reason

                                                            }

                                                        </h4>

                                                    </div>

                                                    <div>

                                                        <p className="text-slate-500 text-sm">

                                                            Refund

                                                        </p>

                                                        <h4 className="text-green-700 font-bold mt-1">

                                                            {currency}

                                                            {

                                                                item.refundAmount

                                                            }

                                                        </h4>

                                                    </div>

                                                    <div>

                                                        <p className="text-slate-500 text-sm">

                                                            Requested On

                                                        </p>

                                                        <div className="flex items-center gap-2 mt-1">

                                                            <Clock3

                                                                size={16}

                                                            />

                                                            {

                                                                new Date(

                                                                    item.createdAt

                                                                )

                                                                .toLocaleDateString()

                                                            }

                                                        </div>

                                                    </div>

                                                    <div>

                                                        <p className="text-slate-500 text-sm">

                                                            Products

                                                        </p>

                                                        <h4 className="font-medium mt-1">

                                                            {

                                                                item.order

                                                                .orderItems

                                                                .length

                                                            }

                                                            Item(s)

                                                        </h4>

                                                    </div>

                                                </div>

                                                <div className="mt-6 bg-slate-50 rounded-xl p-4">

                                                    <p className="text-slate-500 text-sm">

                                                        Description

                                                    </p>

                                                    <p className="mt-2">

                                                        {

                                                            item.description ||

                                                            "No additional description."

                                                        }

                                                    </p>

                                                </div>

                                                <div className="flex justify-end mt-6">

                                                    <button

                                                        onClick={()=>openModal(item)}

                                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white transition"

                                                    >

                                                        <Eye size={18}/>

                                                        View Details

                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    ))

                                }

                            </div>

                        )

                    }

                </div>

                {/* Details Modal */}

                {

                    modalOpen &&

                    selectedReturn &&

                    (

                        <div

                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5"

                            onClick={closeModal}

                        >

                            <div

                                onClick={(e)=>e.stopPropagation()}

                                className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"

                            >
                                                                <div className="flex justify-between items-center border-b p-7">

                                    <div>

                                        <h2 className="text-3xl font-bold">

                                            Return Details

                                        </h2>

                                        <p className="text-slate-500 mt-1">

                                            Return #

                                            {

                                                selectedReturn.id.slice(-8)

                                            }

                                        </p>

                                    </div>

                                    <span

                                        className={`px-4 py-2 rounded-full font-semibold ${badge(selectedReturn.status)}`}

                                    >

                                        {

                                            selectedReturn.status.replace(/_/g," ")

                                        }

                                    </span>

                                </div>

                                {/* Customer & Address */}

                                <div className="grid lg:grid-cols-2 gap-7 p-7">

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <h3 className="font-semibold text-lg mb-5">

                                            Customer

                                        </h3>

                                        <div className="space-y-3">

                                            <p>

                                                <span className="text-slate-500">

                                                    Name :

                                                </span>

                                                {" "}

                                                {

                                                    selectedReturn.user.name

                                                }

                                            </p>

                                            <p>

                                                <span className="text-slate-500">

                                                    Email :

                                                </span>

                                                {" "}

                                                {

                                                    selectedReturn.user.email

                                                }

                                            </p>

                                            <p>

                                                <span className="text-slate-500">

                                                    Phone :

                                                </span>

                                                {" "}

                                                {

                                                    selectedReturn.order.address.phone

                                                }

                                            </p>

                                        </div>

                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6">

                                        <h3 className="font-semibold text-lg mb-5">

                                            Shipping Address

                                        </h3>

                                        <div className="space-y-2">

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

                                </div>

                                {/* Products */}

                                <div className="px-7">

                                    <h3 className="text-xl font-semibold mb-5">

                                        Products

                                    </h3>

                                    <div className="space-y-5">

                                        {

                                            selectedReturn.order.orderItems.map((item)=>(

                                                <div

                                                    key={item.product.id}

                                                    className="border rounded-2xl p-5 flex gap-5"

                                                >

                                                    <image

                                                        src={item.product.images[0]}

                                                        className="h-24 w-24 rounded-xl object-cover border"

                                                        alt={item.product.name}

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

                                            ))

                                        }

                                    </div>

                                </div>

                                {/* Return & Refund */}

                                <div className="grid lg:grid-cols-2 gap-7 p-7">

                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">

                                        <h3 className="font-semibold mb-4">

                                            Return Information

                                        </h3>

                                        <p>

                                            <span className="text-slate-500">

                                                Reason :

                                            </span>

                                            {" "}

                                            {

                                                selectedReturn.reason

                                            }

                                        </p>

                                        <p className="mt-4 text-slate-600">

                                            {

                                                selectedReturn.description ||

                                                "No additional description."

                                            }

                                        </p>

                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">

                                        <h3 className="font-semibold mb-4">

                                            Refund Details

                                        </h3>

                                        <p className="text-slate-500">

                                            Refund Amount

                                        </p>

                                        <h2 className="text-4xl font-bold text-green-700 mt-2">

                                            {currency}

                                            {

                                                selectedReturn.refundAmount

                                            }

                                        </h2>

                                        <div className="mt-6 flex items-center gap-2 text-slate-500">

                                            <Clock3 size={18}/>

                                            {

                                                new Date(

                                                    selectedReturn.createdAt

                                                ).toLocaleString()

                                            }

                                        </div>

                                    </div>

                                </div>

                                {/* Timeline */}

                                <div className="px-7 pb-7">

                                    <h3 className="text-xl font-semibold mb-5">

                                        Return Timeline

                                    </h3>

                                    <div className="border rounded-2xl p-6 bg-slate-50">

                                        <div className="flex items-center gap-4">

                                            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">

                                                ✓

                                            </div>

                                            <div>

                                                <h4 className="font-semibold">

                                                    Return Request Submitted

                                                </h4>

                                                <p className="text-sm text-slate-500">

                                                    {

                                                        new Date(

                                                            selectedReturn.createdAt

                                                        ).toLocaleString()

                                                    }

                                                </p>

                                            </div>

                                        </div>

                                        <div className="ml-5 h-10 border-l-2 border-dashed border-slate-300"></div>

                                        <div className="flex items-center gap-4">

                                            <div

                                                className={`h-10 w-10 rounded-full flex items-center justify-center text-white

                                                ${

                                                    selectedReturn.status==="REQUESTED"

                                                    ?

                                                    "bg-yellow-500"

                                                    :

                                                    "bg-green-600"

                                                }`}

                                            >

                                                •

                                            </div>

                                            <div>

                                                <h4 className="font-semibold">

                                                    Current Status

                                                </h4>

                                                <p className="text-sm text-slate-500">

                                                    {

                                                        selectedReturn.status.replace(/_/g," ")

                                                    }

                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* Footer */}

                                <div className="border-t p-6 flex justify-end">

                                    <button

                                        onClick={closeModal}

                                        className="px-6 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition"

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