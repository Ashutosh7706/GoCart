'use client'
import { Suspense, useState, useEffect } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import SearchBar from "@/components/shop/SearchBar"
import Filters from "@/components/shop/Filters"
import SortDropdown from "@/components/shop/SortDropdown"
import Pagination from "@/components/shop/Pagination"
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import {

    useRef,

} from "react";
function ShopContent() {

    const [products, setProducts] = useState([]);

    const [hasMore, setHasMore] = useState(true);

    const [loading, setLoading] = useState(true);

    const [query, setQuery] = useState("");

    const [category, setCategory] = useState("");

    const [min, setMin] = useState("");

    const [max, setMax] = useState("");

    const [loadingMore, setLoadingMore] = useState(false);

    const [rating, setRating] = useState("");

    const [stock, setStock] = useState(false);

    const [sort, setSort] = useState("newest");

    const [page, setPage] = useState(1);
    // get query params ?search=abc
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()
    const loaderRef = useRef(null);
    useEffect(() => {

        loadProducts();

    }, [page]);

    useEffect(() => {

        setPage(1);
        loadProducts();

    }, [

        query,

        category,

        min,

        max,

        rating,

        stock,

        sort,

    ]);

    useEffect(() => {

        if (!loaderRef.current)

            return;

        const observer = new IntersectionObserver(

            entries => {

                if (

                    entries[0].isIntersecting

                    &&

                    hasMore

                    &&

                    !loading

                ) {

                    setPage(prev => prev + 1);

                }

            },

            {

                threshold: 1,

            }

        );

        observer.observe(loaderRef.current);

        return () => observer.disconnect();

    }, [loading, hasMore]);

    useEffect(() => {
    if (search) {
        setQuery(search);
    }
}, [search]);

    async function loadProducts() {

         if (page === 1) {
        setLoading(true);
    } else {
        setLoadingMore(true);
    }

        try {

            const params = new URLSearchParams({

                q: query,

                category,

                min,

                max,

                rating,

                sort,

                page,

                limit: 12,

            });
              if(stock){
                    params.append("stock","true");
                }

            const res = await fetch(

                `/api/products/search?${params}`

            );

            const data = await res.json();

            if (page === 1) {

                setProducts(data.products);

            }

            else {

                setProducts(prev => [

                    ...prev,

                    ...data.products,

                ]);

            }

            setHasMore(

                data.pagination.hasMore

            );

        }

        catch (error) {

            console.log(error);

        }

        finally {

               if (page === 1) {
            setLoading(false);
        } else {
            setLoadingMore(false);
        }

        }

    }

    return (
        <div className="max-w-7xl mx-auto px-5 py-8">

            <SearchBar

                value={query}

                onChange={setQuery}

            />

            <div className="grid lg:grid-cols-4 gap-8 mt-6">

                <Filters

                    category={category}

                    setCategory={setCategory}

                    min={min}

                    max={max}

                    setMin={setMin}

                    setMax={setMax}

                    rating={rating}

                    setRating={setRating}

                    stock={stock}

                    setStock={setStock}

                />

                <div className="lg:col-span-3">

                    <SortDropdown

                        sort={sort}

                        setSort={setSort}

                    />

                    {
                        loading

                            ?

                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                                {[...Array(8)].map((_, index) => (

                                    <ProductSkeleton key={index} />

                                ))}

                            </div>

                            :

                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8 mt-6">

                                {

                                    products.map(product => (

                                        <ProductCard

                                            key={product.id}

                                            product={product}

                                        />

                                    ))

                                }

                            </div>



                    }

                 <div ref={loaderRef} className="py-8">

    {loadingMore && hasMore && (

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {Array.from({ length: 8 }).map((_, index) => (

                <ProductSkeleton key={index} />

            ))}

        </div>

    )}

    {!loading && !hasMore && (

        <div className="text-center text-slate-400 py-8">

            🎉 You've reached the end.

        </div>

    )}

</div>

                </div>

            </div>

        </div>
    )
}


export default function Shop() {
    return (
        <Suspense fallback={<div>Loading shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}