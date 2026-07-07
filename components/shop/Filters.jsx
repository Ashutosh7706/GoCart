"use client";

export default function Filters({

    category,
    setCategory,

    min,
    setMin,

    max,
    setMax,

    rating,
    setRating,

    stock,
    setStock,

}) {

    const categories = [

        "Electronics",
        "Fashion",
        "Books",
        "Shoes",
        "Accessories",
        "Furniture",

    ];

    return (

        <div className="bg-white border rounded-xl p-5 h-fit">

            <h2 className="font-semibold text-lg mb-5">

                Filters

            </h2>

            {/* Category */}

            <div className="mb-6">

                <label className="font-medium">

                    Category

                </label>

                <select

                    value={category}

                    onChange={(e)=>setCategory(e.target.value)}

                    className="w-full mt-2 border rounded-lg p-2"

                >

                    <option value="">

                        All Categories

                    </option>

                    {

                        categories.map(item=>(

                            <option
                                key={item}
                                value={item}
                            >

                                {item}

                            </option>

                        ))

                    }

                </select>

            </div>

            {/* Price */}

            <div className="mb-6">

                <label className="font-medium">

                    Price Range

                </label>

                <div className="flex gap-2 mt-2">

                    <input

                        type="number"

                        placeholder="Min"

                        value={min}

                        onChange={(e)=>setMin(e.target.value)}

                        className="border rounded-lg p-2 w-full"

                    />

                    <input

                        type="number"

                        placeholder="Max"

                        value={max}

                        onChange={(e)=>setMax(e.target.value)}

                        className="border rounded-lg p-2 w-full"

                    />

                </div>

            </div>

            {/* Rating */}

            <div className="mb-6">

                <label className="font-medium">

                    Minimum Rating

                </label>

                <select

                    value={rating}

                    onChange={(e)=>setRating(e.target.value)}

                    className="w-full mt-2 border rounded-lg p-2"

                >

                    <option value="">

                        Any Rating

                    </option>

                    <option value="5">

                        5 Stars

                    </option>

                    <option value="4">

                        4 Stars & Above

                    </option>

                    <option value="3">

                        3 Stars & Above

                    </option>

                    <option value="2">

                        2 Stars & Above

                    </option>

                    <option value="1">

                        1 Star & Above

                    </option>

                </select>

            </div>

            {/* Stock */}

            <div>

                <label className="flex gap-2 items-center">

                    <input

                        type="checkbox"

                        checked={stock}

                        onChange={(e)=>setStock(e.target.checked)}

                    />

                    In Stock Only

                </label>

            </div>

        </div>

    );

}