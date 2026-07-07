import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {
    try {

        const user = await getCurrentUser(req);

        const addresses = await prisma.address.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(addresses);

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

export async function POST(req) {
    try {

        const user = await getCurrentUser(req);

        const body = await req.json();

        const address = await prisma.address.create({
            data: {
                userId: user.id,
                name: body.name,
                email: body.email,
                street: body.street,
                city: body.city,
                state: body.state,
                zip: body.zip,
                country: body.country,
                phone: body.phone,
            },
        });

        return NextResponse.json(address);

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