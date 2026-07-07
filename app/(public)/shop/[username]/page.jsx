import { prisma } from "@/lib/prisma";
import Image from "@/components/Image";
<>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Store",
                name: store.name,
                description: store.description,
                image: store.logo,
                url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/${store.username}`,
                telephone: store.contact,
                email: store.email,
                address: {
                    "@type": "PostalAddress",
                    streetAddress: store.address,
                },
            }),
        }}
    />

    <div className="bg-white rounded-3xl border shadow-sm overflow-hidden mb-10">

        {/* Banner */}

        <div className="h-44 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500"></div>

        {/* Store Info */}

        <div className="px-10 pb-8">

            <div className="flex flex-col lg:flex-row items-center lg:items-end gap-8 -mt-20">

                {/* Logo */}

                <Image
                    src={store.logo}
                    alt={store.name}
                    className="w-36 h-36 rounded-full border-8 border-white bg-white object-cover shadow-xl"
                />

                <div className="flex-1">

                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center">

                        <div>

                            <h1 className="text-4xl font-bold">

                                {store.name}

                            </h1>

                            <p className="text-slate-600 mt-2">

                                {store.description}

                            </p>

                        </div>

                        <span className="mt-4 lg:mt-0 px-5 py-2 rounded-full bg-green-100 text-green-700 font-semibold">

                            {products.length} Products

                        </span>

                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mt-8 text-sm">

                        <div>

                            <p className="text-slate-500">

                                Email

                            </p>

                            <p className="font-medium">

                                {store.email}

                            </p>

                        </div>

                        <div>

                            <p className="text-slate-500">

                                Contact

                            </p>

                            <p className="font-medium">

                                {store.contact}

                            </p>

                        </div>

                        <div>

                            <p className="text-slate-500">

                                Address

                            </p>

                            <p className="font-medium">

                                {store.address}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

    {/* Products */}

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">

        {products.map(product => (

            <ProductCard
                key={product.id}
                product={product}
            />

        ))}

    </div>

</>

export async function generateMetadata({ params }) {

    const store = await prisma.store.findUnique({

        where: {

            username: params.username,

        },

    });

    if (!store) {

        return {

            title: "Store Not Found",

            description: "The requested store could not be found.",

        };

    }

    return {

        

        title: store.name,

        description: store.description,

        keywords: [

            store.name,

            "GoCart",

            "Online Store",

            "Marketplace",

        ],

        openGraph: {

            title: store.name,

            description: store.description,

            url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/${store.username}`,

            images: [

                {

                    url: store.logo,

                    width: 1200,

                    height: 630,

                },

            ],

        },

        twitter: {

            card: "summary_large_image",

            title: store.name,

            description: store.description,

            images: [

                store.logo,

            ],

        },

        alternates: {

            canonical:

                `${process.env.NEXT_PUBLIC_APP_URL}/shop/${store.username}`,

        },

    };



    

}
export async function generateMetadata({ params }) {

    const store = await prisma.store.findUnique({

        where: {

            username: params.username,

        },

    });

    if (!store) {

        return {

            title: "Store Not Found",

            description: "The requested store could not be found.",

        };

    }

    return {

        

        title: store.name,

        description: store.description,

        keywords: [

            store.name,

            "GoCart",

            "Online Store",

            "Marketplace",

        ],

        openGraph: {

            title: store.name,

            description: store.description,

            url: `${process.env.NEXT_PUBLIC_APP_URL}/shop/${store.username}`,

            images: [

                {

                    url: store.logo,

                    width: 1200,

                    height: 630,

                },

            ],

        },

        twitter: {

            card: "summary_large_image",

            title: store.name,

            description: store.description,

            images: [

                store.logo,

            ],

        },

        alternates: {

            canonical:

                `${process.env.NEXT_PUBLIC_APP_URL}/shop/${store.username}`,

        },

    };



    

}