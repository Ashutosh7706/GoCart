"use client";

import { useEffect, useState } from "react";
import Image from "@/components/Image";
import { toast } from "react-hot-toast";

export default function StoreProducts() {

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {

        try {

            const res = await fetch("/api/store/products", {
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setProducts(data);

        } catch (error) {

            toast.error(error.message);

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    if (loading) {
          return (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {[...Array(8)].map((_, index) => (

                <ProductSkeleton key={index} />

            ))}

        </div>

    );
    }

    return (
        <div>

            <h1 className="text-2xl font-semibold mb-6">
                My Products
            </h1>

            <div className="space-y-5">

                {
                    products.map(product => (

                        <div
                            key={product.id}
                            className="border rounded-lg p-4 flex gap-4 items-center"
                        >

                            <Image
                                src={product.images[0]}
                                width={80}
                                height={80}
                                alt={product.name}
                                className="rounded"
                            />

                            <div className="flex-1">

                                <h2 className="font-semibold">
                                    {product.name}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {product.category}
                                </p>

                                <p className="mt-2">
                                    ₹ {product.price}
                                </p>

                            </div>

                        <button
    onClick={async () => {

        if (!confirm("Delete Product?")) return;

        const res = await fetch(
            `/api/store/products?id=${product.id}`,
            {
                method: "DELETE",
                credentials: "include",
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return toast.error(data.message);
        }

        toast.success("Deleted");

        fetchProducts();

    }}
    className="px-4 py-2 bg-red-500 text-white rounded"
>
    Delete
</button>

                        </div>

                    ))
                }

            </div>

        </div>
    );
}