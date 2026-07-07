'use client'

import { StarIcon, Heart } from 'lucide-react'
import Image from "@/components/Image";
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import {
    addWishlist,
    removeWishlist,
} from '@/lib/features/wishlist/wishlistSlice'

import { memo ,useMemo } from "react";
const ProductCard = ({ product }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'
    const dispatch = useDispatch();

const wishlist = useSelector(
    state => state.wishlist.items
);

const isWishlisted = wishlist.some(
    item => item.productId === product.id
);

    // calculate the average rating of the product
const rating = useMemo(() => {

    if (!product.rating.length) return 0;

    return Math.round(

        product.rating.reduce(

            (acc, curr) => acc  + curr.rating,

            0

        ) / product.rating.length

    );

}, [product.rating]);

const toggleWishlist = async (e) => {

    e.preventDefault();

    try {

        if (isWishlisted) {

            const res = await fetch(`/api/wishlist/${product.id}`, {

                method: "DELETE",

                credentials: "include",

            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            dispatch(removeWishlist(product.id));

            toast.success("Removed from wishlist");

        } else {

            const res = await fetch("/api/wishlist", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                credentials: "include",

                body: JSON.stringify({
                    productId: product.id,
                }),

            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            dispatch(addWishlist({
                productId: product.id,
            }));

            toast.success("Added to wishlist");

        }

    } catch (error) {

        toast.error(error.message);

    }

}   

    return (
        <Link href={`/product/${product.id}`} className=' group max-xl:mx-auto'>
<div className='relative bg-[#F5F5F5] h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center'>
    <button
    onClick={toggleWishlist}
    className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow hover:scale-110 transition"
>

    <Heart

        size={20}

        fill={isWishlisted ? "#ef4444" : "transparent"}

        className={
            isWishlisted
                ? "text-red-500"
                : "text-slate-500"
        }

    />

</button>
                <Image width={500} height={500} className='max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300' src={product.images[0]} alt="" />
            </div>
            <div className='flex justify-between gap-3 text-sm text-slate-800 pt-2 max-w-60'>
                <div>
                    <p>{product.name}</p>
                    <div className='flex'>
                        {Array(5).fill('').map((_, index) => (
                            <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={rating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                        ))}
                    </div>
                </div>
                <p>{currency}{product.price}</p>
            </div>
        </Link>
    )
}


export default memo(ProductCard);   