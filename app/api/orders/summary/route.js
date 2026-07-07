import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {

    try {

        const user = await getCurrentUser(req);

        const cart = await prisma.cart.findUnique({
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

        if (!cart || cart.items.length === 0) {
            return NextResponse.json(
                {
                    message: "Cart is empty",
                },
                {
                    status: 400,
                }
            );
        }

        let subTotal = 0;

        cart.items.forEach(item => {
            subTotal += item.product.price * item.quantity;
        });

        const shippingCharge = 50;

        const tax = subTotal * 0.18;

        const total = subTotal + shippingCharge + tax;

        return NextResponse.json({
            subTotal,
            shippingCharge,
            tax,
            total,
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