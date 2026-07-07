import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ======================================
// UPDATE ADDRESS
// PUT /api/address/:id
// ======================================

export async function PUT(req, { params }) {

    try {

        const user = await getCurrentUser(req);
         console.log("Current User:", user);
        if (!user) {

            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        }

        const { id } = params;

        const body = await req.json();

        const address = await prisma.address.findFirst({

            where: {
                id,
                userId: user.id,
            },

        });

        if (!address) {

            return NextResponse.json(
                { message: "Address not found" },
                { status: 404 }
            );

        }

        const updatedAddress = await prisma.address.update({

            where: {
                id,
            },

            data: {

                name: body.name,
                email: body.email,
                phone: body.phone,

                street: body.street,
                city: body.city,
                state: body.state,
                zip: body.zip,
                country: body.country,

            },

        });

        return NextResponse.json(updatedAddress);

    } catch (error) {

        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );

    }

}

// ======================================
// DELETE ADDRESS
// DELETE /api/address/:id
// ======================================

export async function DELETE(req, { params }) {

    try {

        const user = await getCurrentUser(req);

        if (!user) {

            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );

        }

        const { id } = params;

        const address = await prisma.address.findFirst({

            where: {
                id,
                userId: user.id,
            },

        });

        if (!address) {

            return NextResponse.json(
                { message: "Address not found" },
                { status: 404 }
            );

        }

        const orderExists = await prisma.order.findFirst({

            where: {
                addressId: id,
            },

        });

        if (orderExists) {

            return NextResponse.json(
                {
                    message:
                        "Cannot delete an address used in an order.",
                },
                {
                    status: 400,
                }
            );

        }

        await prisma.address.delete({

            where: {
                id,
            },

        });

        return NextResponse.json({

            message: "Address deleted successfully",

        });

    } catch (error) {

        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );

    }

}