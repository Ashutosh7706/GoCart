"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "@/components/Image";
export default function LoginPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            toast.success("Login Successful");
             setLoggedIn(true);
             
            if (data.role === "SELLER") {
                router.push("/store");
            } else {
                router.push("/");
            }

        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
            <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">

                <h1 className="text-3xl font-bold text-center">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Sign in to continue shopping on GoCart
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-sm text-indigo-600 hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 transition text-white py-3 rounded-lg font-semibold"
                    >
                        {loading ? "Logging In..." : "Login"}
                    </button>

                    <div className="flex items-center my-6">
                        <div className="flex-1 border-t"></div>

                        <span className="px-4 text-gray-500 text-sm">
                            OR
                        </span>

                        <div className="flex-1 border-t"></div>
                    </div>

                    {/* Google */}

                    <button
                        type="button"
                        disabled
                        className="w-full border rounded-lg py-3 flex items-center justify-center gap-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                    >
                        <Image
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        Continue with Google
                        <span className="text-xs">
                            (Coming Soon)
                        </span>
                    </button>

                    {/* GitHub */}

                    <button
                        type="button"
                        disabled
                        className="w-full border rounded-lg py-3 mt-3 flex items-center justify-center gap-3 bg-gray-100 text-gray-500 cursor-not-allowed"
                    >
                        <img
                            src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
                            alt="GitHub"
                            className="w-5 h-5"
                        />
                        Continue with GitHub
                        <span className="text-xs">
                            (Coming Soon)
                        </span>
                    </button>

                    <p className="text-center mt-6 text-sm text-gray-600">
                        Don't have an account?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="text-indigo-600 font-semibold hover:underline"
                        >
                            Sign Up
                        </button>
                    </p>

                </form>

            </div>
        </div>
    );
}