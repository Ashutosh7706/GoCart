import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
    try {

        const user = await getCurrentUser(req);

        const orders = await prisma.order.findMany({
            where: {
                userId: user.id,
            },
            include: {
                orderItems: {
                    include: {
                        product: true,
                    },
                },
                address: true,
                payment: true,
                store: {
                    select: {
                        id: true,
                        name: true,
                        logo: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(orders);

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