import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStore } from "@/lib/auth";

export async function GET(req) {

    try {

        const store = await getCurrentStore(req);

        const orders = await prisma.order.findMany({

            where: {

                orderItems: {

                    some: {

                        product: {

                            storeId: store.id,

                        },

                    },

                },

            },

            include: {

                user: true,

                address: true,

           

                orderItems: {

                    include: {

                        product: true,

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