"use client";

export default function Pagination({

    page,

    totalPages,

    onChange,

}) {

    if (!totalPages || totalPages <= 1) {

        return null;

    }

    return (

        <div className="flex justify-center gap-2 mt-10">

            <button

                disabled={page === 1}

                onClick={() => onChange(page - 1)}

                className="px-4 py-2 border rounded-lg disabled:opacity-50"

            >

                Previous

            </button>

            {

                Array.from(

                    {

                        length: totalPages,

                    }

                ).map((_, index) => (

                    <button

                        key={index}

                        onClick={() => onChange(index + 1)}

                        className={`px-4 py-2 rounded-lg

                        ${

                            page === index + 1

                                ? "bg-green-600 text-white"

                                : "border"

                        }`}

                    >

                        {index + 1}

                    </button>

                ))

            }

            <button

                disabled={page === totalPages}

                onClick={() => onChange(page + 1)}

                className="px-4 py-2 border rounded-lg disabled:opacity-50"

            >

                Next

            </button>

        </div>

    );

}