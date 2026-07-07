import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
    try {

        const { searchParams } = new URL(req.url);

        const q = searchParams.get("q") || "";

        const category = searchParams.get("category") || "";

        const min = Number(searchParams.get("min")) || 0;

        const max = Number(searchParams.get("max")) || 999999999;

        const rating = Number(searchParams.get("rating")) || 0;

        const inStock = searchParams.get("stock");

        const sort = searchParams.get("sort") || "newest";

        const page = Number(searchParams.get("page")) || 1;

        const limit = 12;

        const skip = (page - 1) * limit;

        const where = {
            isPublished: true,

            name: {
                contains: q,
                mode: "insensitive",
            },

            price: {
                gte: min,
                lte: max,
            },
        };

        if (category) {

            where.category = category;

        }

        if (inStock === "true") {

            where.stock = {
                gt: 0,
            };

        }

        let orderBy = {
            createdAt: "desc",
        };

        switch (sort) {

            case "price-asc":

                orderBy = {
                    price: "asc",
                };

                break;

            case "price-desc":

                orderBy = {
                    price: "desc",
                };

                break;

            case "oldest":

                orderBy = {
                    createdAt: "asc",
                };

                break;

            default:

                orderBy = {
                    createdAt: "desc",
                };

        }

        let products = await prisma.product.findMany({

            where,

            include: {

                rating: true,

                store: {

                    select: {

                        id: true,

                        name: true,

                        username: true,

                    },

                },

            },

            orderBy,

            skip,

            take: limit,

        });

        if (rating > 0) {

            products = products.filter((product) => {

                if (product.rating.length === 0) return false;

                const avg =

                    product.rating.reduce(

                        (sum, item) => sum + item.rating,

                        0

                    ) / product.rating.length;

                return avg >= rating;

            });

        }

        const total = await prisma.product.count({

            where,

        });

        return NextResponse.json({

            products,

            pagination: {

                page,

                limit,

                total,

                totalPages,
                hasMore: page < Math.ceil(total / limit),

            },

        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(

            {

                message: error.message,

            },

            {

                status: 500,

            }

        );

    }
}