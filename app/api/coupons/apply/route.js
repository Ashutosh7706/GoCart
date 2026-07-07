import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req) {

    try {

        const user = await getCurrentUser(req);

        if (!user) {

            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );

        }

        const { code } = await req.json();

        const coupon = await prisma.coupon.findUnique({

            where: {
                code: code.trim().toUpperCase(),
            },

        });

        if (!coupon) {

            return NextResponse.json(
                {
                    message: "Invalid coupon",
                },
                {
                    status: 404,
                }
            );

        }

        if (coupon.expiresAt < new Date()) {

            return NextResponse.json(
                {
                    message: "Coupon expired",
                },
                {
                    status: 400,
                }
            );

        }

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

        const discount = (subTotal * coupon.discount) / 100;

        const shippingCharge = 50;

        const tax = (subTotal - discount) * 0.18;

        const total =
            subTotal -
            discount +
            shippingCharge +
            tax;

        return NextResponse.json({

            success: true,

            coupon,

            summary: {

                subTotal,

                discount,

                shippingCharge,

                tax,

                total,

            },

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