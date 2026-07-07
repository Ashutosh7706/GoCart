import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

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

        // Stock Validation

        for (const item of cart.items) {

            if (!item.product.inStock || item.product.stock < item.quantity) {

                return NextResponse.json(
                    {
                        message: `${item.product.name} is out of stock`,
                    },
                    {
                        status: 400,
                    }
                );

            }

        }

        let subTotal = 0;

        cart.items.forEach(item => {

            subTotal += item.product.price * item.quantity;

        });

        const shippingCharge = 50;

        const tax = Number((subTotal * 0.18).toFixed(2));

        const total = subTotal + shippingCharge + tax;

        // Create Order in Database

        const order = await prisma.order.create({

            data: {

                userId: user.id,

                storeId: cart.items[0].product.storeId,

                addressId: body.addressId,

                paymentMethod: "RAZORPAY",

                subTotal,

                shippingCharge,

                tax,

                total,

                discount: 0,

                isPaid: false,

            },

        });

        // Create Order Items

        await prisma.orderItem.createMany({

            data: cart.items.map(item => ({

                orderId: order.id,

                productId: item.productId,

                quantity: item.quantity,

                price: item.product.price,

            })),

        });

        // Razorpay Order

        const razorpayOrder = await razorpay.orders.create({

            amount: Math.round(total * 100),

            currency: "INR",

            receipt: order.id,

            notes: {

                orderId: order.id,

                userId: user.id,

            },

        });

        // Payment Entry

        await prisma.payment.create({

            data: {

                orderId: order.id,

                gateway: "Razorpay",

                amount: total,

                status: "PENDING",

            },

        });

        return NextResponse.json({

            razorpayOrder,

            order,

            key: process.env.RAZORPAY_KEY_ID,

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