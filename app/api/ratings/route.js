import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {
    try {

        const user = await getCurrentUser(req);

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const {
            orderId,
            productId,
            rating,
            review,
        } = body;

        const order = await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                orderItems: true,
            },
        });

        if (!order) {
            return NextResponse.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        if (order.userId !== user.id) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        const purchased = order.orderItems.find(
            item => item.productId === productId
        );

        if (!purchased) {
            return NextResponse.json(
                { message: "Product not found in this order" },
                { status: 400 }
            );
        }

        if (order.status !== "DELIVERED") {
            return NextResponse.json(
                { message: "Order not delivered yet" },
                { status: 400 }
            );
        }

        const existingRating = await prisma.rating.findFirst({
            where: {
                orderId,
                productId,
                userId: user.id,
            },
        });

        if (existingRating) {
            return NextResponse.json(
                { message: "You have already rated this product" },
                { status: 400 }
            );
        }

        const newRating = await prisma.rating.create({
            data: {
                rating,
                review,
                orderId,
                productId,
                userId: user.id,
            },
        });


await createNotification({

    userId:store.userId,

    title:"New Review",

    message:"A customer reviewed one of your products.",

    type:"REVIEW",

});


        return NextResponse.json(newRating);

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