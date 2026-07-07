import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { renderToStream } from "@react-pdf/renderer";
import InvoiceDocument from "@/components/invoice/InvoiceDocument";

export async function GET(req, { params }) {

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

        const { id } = params;

        const order = await prisma.order.findUnique({

            where: {
                id,
            },

            include: {

                address: true,

                payment: true,

                orderItems: {

                    include: {

                        product: true,

                    },

                },

                store: true,

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

        if (order.userId !== user.id) {

            return NextResponse.json(
                {
                    message: "Forbidden",
                },
                {
                    status: 403,
                }
            );

        }

        const stream = await renderToStream(

            <InvoiceDocument order={order} />

        );

        return new NextResponse(stream, {

            headers: {

                "Content-Type": "application/pdf",

                "Content-Disposition": `attachment; filename="Invoice-${order.id}.pdf"`,

            },

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