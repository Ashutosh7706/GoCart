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

        if (!code) {

            return NextResponse.json(
                {
                    message: "Coupon code is required",
                },
                {
                    status: 400,
                }
            );

        }

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
                    message: "Coupon has expired",
                },
                {
                    status: 400,
                }
            );

        }

        if (coupon.forNewUser) {

            const orders = await prisma.order.count({

                where: {
                    userId: user.id,
                },

            });

            if (orders > 0) {

                return NextResponse.json(
                    {
                        message: "Coupon is only for new users",
                    },
                    {
                        status: 400,
                    }
                );

            }

        }

        return NextResponse.json({

            success: true,

            coupon,

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