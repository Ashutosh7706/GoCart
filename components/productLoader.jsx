"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setProduct } from "@/lib/features/product/productSlice";

export default function ProductLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();

        console.log(data);

        dispatch(setProduct(data));
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    }

    loadProducts();
  }, [dispatch]);

  return null;
}