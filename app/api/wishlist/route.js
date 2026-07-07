import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
    try {

        const user = await getCurrentUser(req);

        const wishlist = await prisma.wishlist.findMany({
            where: {
                userId: user.id,
            },
            include: {
                product: {
                    include: {
                        store: {
                            select: {
                                id: true,
                                name: true,
                                logo: true,
                            },
                        },
                        rating: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(wishlist);

    } catch (error) {

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

export async function POST(req) {
    try {

        const user = await getCurrentUser(req);

        const { productId } = await req.json();

        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        if (!product) {
            return NextResponse.json(
                {
                    message: "Product not found",
                },
                {
                    status: 404,
                }
            );
        }

        const exists = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        if (exists) {
            return NextResponse.json(
                {
                    message: "Already in wishlist",
                },
                {
                    status: 400,
                }
            );
        }

        const wishlist = await prisma.wishlist.create({
            data: {
                userId: user.id,
                productId,
            },
        });

        return NextResponse.json(wishlist);

    } catch (error) {

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