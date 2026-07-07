"use client";

import {
    MapPin,
    User,
    Phone,
    Mail,
    Home,
} from "lucide-react";

export default function AddressCard({ address }) {

    if (!address) {

        return (

            <div className="bg-slate-50 rounded-2xl p-6">

                <p className="text-slate-500">

                    Address not available

                </p>

            </div>

        );

    }

    return (

        <div className="bg-slate-50 hover:bg-green-50 transition-all duration-300 rounded-2xl p-6 border border-transparent hover:border-green-200">

            <div className="flex items-center gap-3 mb-6">

                <MapPin
                    size={24}
                    className="text-green-600"
                />

                <h3 className="text-xl font-bold text-slate-800">

                    Delivery Address

                </h3>

            </div>

            <div className="space-y-5">

                <div className="flex items-start gap-3">

                    <User
                        size={18}
                        className="text-slate-400 mt-1"
                    />

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">

                            Customer

                        </p>

                        <p className="font-semibold text-slate-700">

                            {address.name}

                        </p>

                    </div>

                </div>

                <div className="flex items-start gap-3">

                    <Phone
                        size={18}
                        className="text-slate-400 mt-1"
                    />

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">

                            Phone

                        </p>

                        <p className="font-medium">

                            {address.phone}

                        </p>

                    </div>

                </div>

                <div className="flex items-start gap-3">

                    <Mail
                        size={18}
                        className="text-slate-400 mt-1"
                    />

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">

                            Email

                        </p>

                        <p className="break-all">

                            {address.email}

                        </p>

                    </div>

                </div>

                <div className="flex items-start gap-3">

                    <Home
                        size={18}
                        className="text-slate-400 mt-1"
                    />

                    <div>

                        <p className="text-xs uppercase tracking-wide text-slate-400">

                            Address

                        </p>

                        <p>

                            {address.street}

                        </p>

                        <p>

                            {address.city}, {address.state}

                        </p>

                        <p>

                            {address.country} - {address.zip}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}