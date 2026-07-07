'use client'

import { useEffect } from "react";
import { useDispatch } from "react-redux";



import Banner from "@/components/Banner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { loadWishlist } from "@/lib/loadWishlist";
import { setWishlist } from "@/lib/features/wishlist/wishlistSlice";

export default function PublicLayout({ children }) {

    const dispatch = useDispatch();

    useEffect(() => {

        loadWishlist(dispatch, setWishlist);

    }, [dispatch]);

    return (
        <>
            <Banner />
            <Navbar />
            {children}
            <Footer />
        </>
    );
}