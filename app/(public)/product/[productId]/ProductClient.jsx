"use client";

import ProductDescription from "@/components/ProductDescription";
import ProductDetails from "@/components/ProductDetails";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function ProductClient({ initialProduct }) {

    const [product, setProduct] = useState(initialProduct);

    const products = useSelector((state) => state.product.list);

    useEffect(() => {

      if (products.length > 0) {

    const latestProduct = products.find(

        (item) => item.id === initialProduct.id

    );

    if (latestProduct) {

        setProduct(latestProduct);

    }

}
        window.scrollTo({

            top: 0,

            behavior: "smooth",

        });

    }, [products, initialProduct]);

    if (!product) {

        return (

            <div className="flex justify-center items-center min-h-[60vh]">

                <div className="text-center">

                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent mx-auto"></div>

                    <p className="mt-4 text-slate-500">

                        Loading Product...

                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="mx-6">

            <div className="max-w-7xl mx-auto">

                {/* Breadcrumb */}

                <div className="text-gray-600 text-sm mt-8 mb-5">

                    Home

                    {" / "}

                    Products

                    {" / "}

                    {product.category}

                    {" / "}

                    <span className="font-medium text-slate-800">

                        {product.name}

                    </span>

                </div>

                {/* Product Details */}

                <ProductDetails

                    product={product}

                />

                {/* Description */}

                <ProductDescription

                    product={product}

                />

            </div>

        </div>

    );

}