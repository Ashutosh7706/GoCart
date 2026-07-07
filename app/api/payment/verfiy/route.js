import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { emailTemplates } from "@/lib/email/templates";

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

        const body = await req.json();

        const {

            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,

        } = body;

        // Verify Signature

        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(
                `${razorpay_order_id}|${razorpay_payment_id}`
            )
            .digest("hex");

       if (generatedSignature !== razorpay_signature) {

    await prisma.payment.update({

        where: {

            orderId,

        },

        data: {

            status: "FAILED",

        },

    });

    return NextResponse.json(
        {
            message: "Payment verification failed",
        },
        {
            status: 400,
        }
    );

}

        // Fetch Order

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
                {
                    message: "Order not found",
                },
                {
                    status: 404,
                }
            );

        }

        // Update Payment

        await prisma.payment.update({

            where: {

                orderId,

            },

            data: {

                transactionId: razorpay_payment_id,

                status: "SUCCESS",

            },

        });

        // Update Order

        await prisma.order.update({

            where: {

                id: orderId,

            },

            data: {

                isPaid: true,

            },

        });

await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {

    method: "POST",

    headers: {
        "Content-Type": "application/json",
    },

    body: JSON.stringify({

        to: user.email,

        subject: "Payment Successfull",

        html: emailTemplates. paymentSuccess(order) ,

    }),

});

        // Reduce Stock

        for (const item of order.orderItems) {

            const product = await prisma.product.findUnique({

                where: {

                    id: item.productId,

                },

            });

            if (!product) continue;

            const newStock = product.stock - item.quantity;

            await prisma.product.update({

                where: {

                    id: item.productId,

                },

                data: {

                    stock: Math.max(newStock, 0),

                    inStock: newStock > 0,

                },

            });

        }

        // Clear Cart

        const cart = await prisma.cart.findUnique({

            where: {

                userId: user.id,

            },

        });

        if (cart) {

            await prisma.cartItem.deleteMany({

                where: {

                    cartId: cart.id,

                },

            });

        }

await createNotification({

    userId:user.id,

    title:"Payment Successful",

    message:"Your payment has been received.",

    type:"PAYMENT",

    link:"/orders",

});

        return NextResponse.json({

            success: true,

            message: "Payment Verified Successfully",

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