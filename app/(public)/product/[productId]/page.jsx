import { prisma } from "@/lib/prisma";
import ProductClient from "./ProductClient";

export async function generateMetadata({ params }) {

    const product = await prisma.product.findUnique({

        where: {

            id: params.productId,

        },

        include: {

            store: true,

            rating: true,

        },

    });

    if (!product) {

        return {

            title: "Product Not Found",

            description: "The requested product does not exist.",

        };

    }

    return {

        title: product.name,

        description: product.description,

        keywords: [

            product.name,

            product.category,

            product.store.name,

            "GoCart",

        ],

        openGraph: {

            title: product.name,

            description: product.description,

            images: [

                {

                    url: product.images[0],

                    width: 1200,

                    height: 630,

                },

            ],

        },

        twitter: {

            card: "summary_large_image",

            title: product.name,

            description: product.description,

            images: [product.images[0]],

        },

    };

}

export default async function ProductPage({ params }) {

    const product = await prisma.product.findUnique({

        where: {

            id: params.productId,

        },

        include: {

            rating: true,

            store: true,

        },

    });

    if (!product) {

        return (

            <div className="flex justify-center py-20">

                Product not found

            </div>

        );

    }

    return (

        <>

            <script

                type="application/ld+json"

                dangerouslySetInnerHTML={{

                    __html: JSON.stringify({

                        "@context": "https://schema.org",

                        "@type": "Product",

                        name: product.name,

                        image: product.images,

                        description: product.description,

                        brand: {

                            "@type": "Brand",

                            name: product.store.name,

                        },

                        offers: {

                            "@type": "Offer",

                            price: product.price,

                            priceCurrency: "INR",

                            availability:

                                product.stock > 0

                                    ? "https://schema.org/InStock"

                                    : "https://schema.org/OutOfStock",

                        },

                    }),

                }}

            />

            <ProductClient

                initialProduct={product}

            />

        </>

    );

}