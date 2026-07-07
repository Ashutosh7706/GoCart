import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(req, { params }) {

    try {

        const user = await getCurrentUser(req);

        const { productId } = params;

        const wishlist = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        if (!wishlist) {

            return NextResponse.json(
                {
                    message: "Wishlist item not found",
                },
                {
                    status: 404,
                }
            );

        }

        await prisma.wishlist.delete({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId,
                },
            },
        });

        return NextResponse.json({
            message: "Removed from wishlist",
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