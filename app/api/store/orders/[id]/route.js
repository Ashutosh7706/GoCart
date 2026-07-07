import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStore } from "@/lib/auth";
import { emailTemplates } from "@/lib/email/templates";
import { createNotification } from "@/lib/notification";
export async function PUT(req, context) {

    try {

        const store = await getCurrentStore(req);

        const { id } =await  context.params;

        const body = await req.json();

        const order = await prisma.order.findUnique({

            where: {
                id,
            },

            include: {
                 
                 user: {
                  select: {
                        email: true,
                  }, 
                 },

                orderItems: {

                    include: {

                        product: true,

                    },

                },

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

        const sellerOwnsOrder = order.orderItems.some(

            (item) => item.product.storeId === store.id

        );

        if (!sellerOwnsOrder) {

            return NextResponse.json(
                {
                    message: "Forbidden",
                },
                {
                    status: 403,
                }
            );

        }

        const updatedOrder = await prisma.order.update({

            where: {
                id,
            },

            data: {
                status: body.status,
            },

        });

        const response = NextResponse.json(updatedOrder);

   fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {

    method: "POST",

    headers: {
        "Content-Type": "application/json",
    },

    body: JSON.stringify({

        to: order.user.email,

        subject: "Order Status Update",

        html: emailTemplates.orderStatus(updatedOrder.status),

    }),

}).catch(console.error);

      
  createNotification({

    userId:order.userId,

    title:"Order Updated",

    message:`Order is now ${body.status.replace(/_/g," ")}`,

    type:"SHIPPING",

    link:"/orders",

}).catch(console.error);



        return response;

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