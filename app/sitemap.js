import { prisma } from "@/lib/prisma";

export default async function sitemap() {

    const products = await prisma.product.findMany({

        select: {

            id: true,

            updatedAt: true,

        },

    });

    const stores = await prisma.store.findMany({

        select: {

            username: true,

            updatedAt: true,

        },

    });

    const urls = [

        {

            url: process.env.NEXT_PUBLIC_APP_URL,

            lastModified: new Date(),

        },

        {

            url: `${process.env.NEXT_PUBLIC_APP_URL}/shop`,

            lastModified: new Date(),

        },

    ];

    products.forEach((product)=>{

        urls.push({

            url:

            `${process.env.NEXT_PUBLIC_APP_URL}/product/${product.id}`,

            lastModified:

            product.updatedAt,

        });

    });

    stores.forEach((store)=>{

        urls.push({

            url:

            `${process.env.NEXT_PUBLIC_APP_URL}/shop/${store.username}`,

            lastModified:

            store.updatedAt,

        });

    });

    return urls;

}