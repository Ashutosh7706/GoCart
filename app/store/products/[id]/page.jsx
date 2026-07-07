"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";

export default function EditProduct() {

    const { id } = useParams();

    const router = useRouter();

    const [loading, setLoading] = useState(true);

    const [product, setProduct] = useState({
        name: "",
        description: "",
        category: "",
        mrp: 0,
        price: 0,
    });

    useEffect(() => {

        fetchProduct();

    }, []);

    async function fetchProduct() {

        try {

            const res = await fetch(
                `/api/store/products/${id}`,
                {
                    credentials: "include",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            setProduct(data);

        } catch (err) {

            toast.error(err.message);

        } finally {

            setLoading(false);

        }
    }

    async function handleSubmit(e) {

        e.preventDefault();

        const res = await fetch(
            `/api/store/products/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(product),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return toast.error(data.message);
        }

        toast.success("Product Updated");

        router.push("/store/products");
    }

    if (loading) 
    return (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {[...Array(8)].map((_, index) => (

                <ProductSkeleton key={index} />

            ))}

        </div>

        )
    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-5 max-w-lg"
        >

            <input
                className="border p-3 w-full"
                value={product.name}
                onChange={(e)=>
                    setProduct({
                        ...product,
                        name:e.target.value
                    })
                }
            />

            <textarea
                className="border p-3 w-full"
                rows={5}
                value={product.description}
                onChange={(e)=>
                    setProduct({
                        ...product,
                        description:e.target.value
                    })
                }
            />

            <input
                className="border p-3 w-full"
                type="number"
                value={product.mrp}
                onChange={(e)=>
                    setProduct({
                        ...product,
                        mrp:e.target.value
                    })
                }
            />

            <input
                className="border p-3 w-full"
                type="number"
                value={product.price}
                onChange={(e)=>
                    setProduct({
                        ...product,
                        price:e.target.value
                    })
                }
            />

            <button
                className="bg-black text-white px-6 py-3 rounded"
            >
                Save Changes
            </button>

        </form>
    );
}