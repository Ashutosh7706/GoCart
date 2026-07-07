'use client'

import { useEffect } from 'react'
import Image from "@/components/Image";
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import {
    setWishlist,
    removeWishlist,
} from '@/lib/features/wishlist/wishlistSlice'
import { addToCart } from '@/lib/features/cart/cartSlice'
import { toast } from 'react-hot-toast'

export default function Wishlist() {

    const dispatch = useDispatch()

    const wishlist = useSelector(state => state.wishlist.items)

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    useEffect(() => {

        fetchWishlist()

    }, [])

    async function fetchWishlist() {

        try {

            const res = await fetch('/api/wishlist', {
                credentials: 'include',
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            dispatch(setWishlist(data))

        } catch (error) {

            toast.error(error.message)

        }

    }

    async function removeItem(productId) {

        try {

            const res = await fetch(`/api/wishlist/${productId}`, {

                method: 'DELETE',

                credentials: 'include',

            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message)
            }

            dispatch(removeWishlist(productId))

            toast.success('Removed from wishlist')

        } catch (error) {

            toast.error(error.message)

        }

    }

    function moveToCart(productId) {

        dispatch(addToCart({ productId }))

        toast.success('Added to cart')

    }

    if (wishlist.length === 0) {

        return (

            <div className="min-h-[70vh] flex flex-col justify-center items-center">

                <Heart
                    size={80}
                    className="text-slate-300"
                />

                <h1 className="text-3xl font-bold mt-6">

                    Your Wishlist is Empty

                </h1>

                <p className="text-slate-500 mt-3">

                    Save products to buy them later.

                </p>

                <Link
                    href="/shop"
                    className="mt-8 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                >

                    Continue Shopping

                </Link>

            </div>

        )

    }

    return (

        <div className="max-w-7xl mx-auto px-6 py-10">

            <div className="flex items-center gap-3 mb-8">

                <Heart
                    className="text-red-500"
                    fill="#ef4444"
                />

                <h1 className="text-3xl font-bold">

                    My Wishlist

                </h1>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

                {wishlist.map(item => {

                    const product = item.product

                    const rating = product.rating.length
                        ? Math.round(
                            product.rating.reduce(
                                (a, b) => a + b.rating,
                                0
                            ) / product.rating.length
                        )
                        : 0

                    return (

                        <div
                            key={product.id}
                            className="bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition"
                        >

                            <Link href={`/product/${product.id}`}>

                                <div className="bg-slate-100 h-56 flex items-center justify-center">

                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        width={220}
                                        height={220}
                                        className="object-contain max-h-44"
                                    />

                                </div>

                            </Link>

                            <div className="p-5">

                                <h2 className="font-semibold text-lg text-slate-800">

                                    {product.name}

                                </h2>

                                <p className="text-sm text-slate-500 mt-2">

                                    ⭐ {rating} / 5

                                </p>

                                <p className="text-2xl font-bold mt-3">

                                    {currency}{product.price}

                                </p>

                                <div className="flex gap-3 mt-6">

                                    <button

                                        onClick={() => moveToCart(product.id)}

                                        className="flex-1 flex justify-center items-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"

                                    >

                                        <ShoppingCart size={18} />

                                        Add to Cart

                                    </button>

                                    <button

                                        onClick={() => removeItem(product.id)}

                                        className="px-4 rounded-lg border hover:bg-red-50 text-red-600"

                                    >

                                        <Trash2 size={20} />

                                    </button>

                                </div>

                            </div>

                        </div>

                    )

                })}

            </div>

        </div>

    )

}