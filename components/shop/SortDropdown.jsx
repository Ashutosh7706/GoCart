"use client";

export default function SortDropdown({

    sort,

    setSort,

}) {

    return (

        <div className="flex justify-end">

            <select

                value={sort}

                onChange={(e)=>setSort(e.target.value)}

                className="border rounded-lg px-4 py-2"

            >

                <option value="newest">

                    Newest

                </option>

                <option value="oldest">

                    Oldest

                </option>

                <option value="price-asc">

                    Price : Low to High

                </option>

                <option value="price-desc">

                    Price : High to Low

                </option>

            </select>

        </div>

    );

}