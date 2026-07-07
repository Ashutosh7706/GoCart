"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function CouponsPage() {

    const [coupons, setCoupons] = useState([]);

    const [form, setForm] = useState({
        code: "",
        description: "",
        discount: "",
        expiresAt: "",
        isPublic: true,
        forNewUser: false,
        forMember: false,
    });

    useEffect(() => {

        loadCoupons();

    }, []);

    async function loadCoupons() {

        const res = await fetch("/api/admin/coupons");

        const data = await res.json();

        if (res.ok) {

            setCoupons(data);

        }

    }

    async function createCoupon() {

        try {

            const res = await fetch("/api/admin/coupons", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                credentials: "include",

                body: JSON.stringify(form),

            });

            const data = await res.json();

            if (!res.ok) {

                throw new Error(data.message);

            }

            toast.success("Coupon Created");

            setForm({

                code: "",
                description: "",
                discount: "",
                expiresAt: "",
                isPublic: true,
                forNewUser: false,
                forMember: false,

            });

            loadCoupons();

        } catch (error) {

            toast.error(error.message);

        }

    }

    return (

        <div className="max-w-6xl mx-auto py-8">

            <h1 className="text-3xl font-bold mb-8">

                Coupon Management

            </h1>

            <div className="bg-white border rounded-xl p-6 mb-8">

                <div className="grid md:grid-cols-2 gap-4">

                    <input
                        placeholder="Coupon Code"
                        className="border rounded-lg p-3"
                        value={form.code}
                        onChange={(e)=>setForm({...form,code:e.target.value.toUpperCase()})}
                    />

                    <input
                        placeholder="Description"
                        className="border rounded-lg p-3"
                        value={form.description}
                        onChange={(e)=>setForm({...form,description:e.target.value})}
                    />

                    <input
                        type="number"
                        placeholder="Discount %"
                        className="border rounded-lg p-3"
                        value={form.discount}
                        onChange={(e)=>setForm({...form,discount:e.target.value})}
                    />

                    <input
                        type="datetime-local"
                        className="border rounded-lg p-3"
                        value={form.expiresAt}
                        onChange={(e)=>setForm({...form,expiresAt:e.target.value})}
                    />

                </div>

                <div className="flex gap-6 mt-5">

                    <label>

                        <input
                            type="checkbox"
                            checked={form.isPublic}
                            onChange={(e)=>setForm({...form,isPublic:e.target.checked})}
                        />

                        Public

                    </label>

                    <label>

                        <input
                            type="checkbox"
                            checked={form.forNewUser}
                            onChange={(e)=>setForm({...form,forNewUser:e.target.checked})}
                        />

                        New Users

                    </label>

                    <label>

                        <input
                            type="checkbox"
                            checked={form.forMember}
                            onChange={(e)=>setForm({...form,forMember:e.target.checked})}
                        />

                        Members

                    </label>

                </div>

                <button

                    onClick={createCoupon}

                    className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"

                >

                    Create Coupon

                </button>

            </div>

            <div className="bg-white border rounded-xl">

                <table className="w-full">

                    <thead>

                        <tr className="border-b">

                            <th className="p-4">Code</th>

                            <th>Description</th>

                            <th>Discount</th>

                            <th>Expiry</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            coupons.map(coupon=>(

                                <tr
                                    key={coupon.code}
                                    className="border-b"
                                >

                                    <td className="p-4">

                                        {coupon.code}

                                    </td>

                                    <td>

                                        {coupon.description}

                                    </td>

                                    <td>

                                        {coupon.discount}%

                                    </td>

                                    <td>

                                        {new Date(coupon.expiresAt).toLocaleDateString()}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}