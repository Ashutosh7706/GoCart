"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { X, MapPin, Loader2 } from "lucide-react";

export default function AddressModal({
    open,
    address,
    onClose,
    onSuccess,
}) {

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "India",
    });

    useEffect(() => {

        if (address) {

            setFormData({
                name: address.name || "",
                email: address.email || "",
                phone: address.phone || "",
                street: address.street || "",
                city: address.city || "",
                state: address.state || "",
                zip: address.zip || "",
                country: address.country || "India",
            });

        } else {

            setFormData({
                name: "",
                email: "",
                phone: "",
                street: "",
                city: "",
                state: "",
                zip: "",
                country: "India",
            });

        }

    }, [address, open]);

    if (!open) return null;

    function handleChange(e) {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    }

    async function getCurrentLocation() {

        if (!navigator.geolocation) {

            toast.error("Geolocation is not supported.");

            return;

        }

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                try {

                    const { latitude, longitude } =
                        position.coords;

                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
                    );

                    const data = await res.json();

                    setFormData((prev) => ({
                        ...prev,
                        street: data.address.road || "",
                        city:
                            data.address.city ||
                            data.address.town ||
                            data.address.village ||
                            "",
                        state: data.address.state || "",
                        zip: data.address.postcode || "",
                        country:
                            data.address.country || "India",
                    }));

                    toast.success(
                        "Location detected successfully."
                    );

                } catch {

                    toast.error(
                        "Unable to fetch address."
                    );

                }

            },

            () => {

                toast.error(
                    "Location permission denied."
                );

            }

        );

    }

    async function saveAddress() {

        if (
            !formData.name ||
            !formData.phone ||
            !formData.street ||
            !formData.city ||
            !formData.state ||
            !formData.zip
        ) {

            toast.error(
                "Please fill all required fields."
            );

            return;

        }

        try {

            setLoading(true);

            let res;

            if (address) {

                res = await fetch(
                    `/api/address/${address.id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials: "include",

                        body: JSON.stringify(formData),
                    }
                );

            } else {

                res = await fetch("/api/address", {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    credentials: "include",

                    body: JSON.stringify(formData),
                });

            }

            const data = await res.json();

            if (!res.ok) {

                throw new Error(data.message);

            }

            toast.success(
                address
                    ? "Address Updated Successfully"
                    : "Address Added Successfully"
            );

            onSuccess();

            onClose();

        } catch (error) {

            toast.error(error.message);

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl">

                <div className="flex items-center justify-between border-b px-6 py-4">

                    <div className="flex items-center gap-2">

                        <MapPin
                            size={22}
                            className="text-green-600"
                        />

                        <h2 className="text-xl font-semibold">

                            {address
                                ? "Edit Address"
                                : "Add New Address"}

                        </h2>

                    </div>

                    <button
                        onClick={onClose}
                        className="hover:bg-slate-100 rounded-full p-2"
                    >

                        <X size={20} />

                    </button>

                </div>

                <div className="p-6 space-y-4">

                    <div className="grid md:grid-cols-2 gap-4">

                        <input
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border rounded-lg p-3 w-full"
                        />

                        <input
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border rounded-lg p-3 w-full"
                        />

                        <input
                            name="phone"
                            placeholder="Phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="border rounded-lg p-3 w-full"
                        />

                        <input
                            name="zip"
                            placeholder="PIN Code"
                            value={formData.zip}
                            onChange={handleChange}
                            className="border rounded-lg p-3 w-full"
                        />

                    </div>

                    <input
                        name="street"
                        placeholder="Street Address"
                        value={formData.street}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                    />

                    <div className="grid md:grid-cols-3 gap-4">

                        <input
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleChange}
                            className="border rounded-lg p-3 w-full"
                        />

                        <input
                            name="state"
                            placeholder="State"
                            value={formData.state}
                            onChange={handleChange}
                            className="border rounded-lg p-3 w-full"
                        />

                        <input
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleChange}
                            className="border rounded-lg p-3 w-full"
                        />

                    </div>

                    <button
                        onClick={getCurrentLocation}
                        className="text-green-600 font-medium flex items-center gap-2"
                    >

                        <MapPin size={18} />

                        Use Current Location

                    </button>

                </div>

                <div className="border-t px-6 py-4 flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-6 py-2 border rounded-lg"
                    >

                        Cancel

                    </button>

                    <button
                        disabled={loading}
                        onClick={saveAddress}
                        className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                    >

                        {loading && (
                            <Loader2
                                className="animate-spin"
                                size={18}
                            />
                        )}

                        {address
                            ? "Update Address"
                            : "Save Address"}

                    </button>

                </div>

            </div>

        </div>

    );

}