import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {

    try {

        const user = await getCurrentUser(req);

        let cart = await prisma.cart.findUnique({

            where: {
                userId: user.id,
            },

            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },

        });

        if (!cart) {

            cart = await prisma.cart.create({

                data: {
                    userId: user.id,
                },

                include: {
                    items: true,
                },

            });

        }

        return NextResponse.json(cart);

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
                { message: "Product not found" },
                { status: 404 }
            );
        }

        let cart = await prisma.cart.findUnique({
            where: {
                userId: user.id,
            },
        });

        if (!cart) {

            cart = await prisma.cart.create({
                data: {
                    userId: user.id,
                },
            });

        }

        const existingItem = await prisma.cartItem.findFirst({

            where: {
                cartId: cart.id,
                productId,
            },

        });

        if (existingItem) {

            await prisma.cartItem.update({

                where: {
                    id: existingItem.id,
                },

                data: {
                    quantity: {
                        increment: 1,
                    },
                },

            });

        } else {

            await prisma.cartItem.create({

                data: {
                    cartId: cart.id,
                    productId,
                    quantity: 1,
                },

            });

        }

        return NextResponse.json({
            message: "Added to cart",
        });

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