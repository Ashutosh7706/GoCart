import { NextResponse } from "next/server";
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

        for (const item of cart.items) {

            if (!item.product.inStock || item.product.stock <= 0) {

                return NextResponse.json(
                    {
                        message: `${item.product.name} is out of stock`,
                    },
                    {
                        status: 400,
                    }
                );

            }

            if (item.quantity > item.product.stock) {

                return NextResponse.json(
                    {
                        message: `Only ${item.product.stock} unit(s) of ${item.product.name} available.`,
                    },
                    {
                        status: 400,
                    }
                );

            }

        }

        let subTotal = 0;

        cart.items.forEach((item) => {
            subTotal += item.product.price * item.quantity;
        });

        const shippingCharge = 50;
        const tax = subTotal * 0.18;
        const total = subTotal + shippingCharge + tax;

        const order = await prisma.order.create({
            data: {
                userId: user.id,
                storeId: cart.items[0].product.storeId,
                addressId: body.addressId,
                paymentMethod: body.paymentMethod,
                subTotal,
                shippingCharge,
                tax,
                total,
                discount: body.coupon?.discount || 0,

                isCouponUsed: !!body.coupon,

                coupon: body.coupon || {},
                isPaid: false,
            },
        });


await createNotification({

    userId:user.id,

    title:"Order Placed",

    message:`Order #${order.id} placed successfully.`,

    type:"ORDER",

    link:"/orders",

});

        await prisma.orderItem.createMany({
            data: cart.items.map((item) => ({
                orderId: order.id,
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
            })),
        });

        for (const item of cart.items) {

            const updatedProduct = await prisma.product.update({

                where: {
                    id: item.productId,
                },

                data: {
                    stock: {
                        decrement: item.quantity,
                    },
                },

            });

            if (updatedProduct.stock <= 0) {

                await prisma.product.update({

                    where: {
                        id: item.productId,
                    },

                    data: {
                        stock: 0,
                        inStock: false,
                    },

                });

            }

        }
        await prisma.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });


        await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({

                to: user.email,

                subject: "Your GoCart Order has been Placed 🎉",

                html: emailTemplates.orderPlaced(order),

            }),

        });

        return NextResponse.json({
            message: "Order placed successfully",
            order,
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
