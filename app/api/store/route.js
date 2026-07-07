import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// GET all stores
export async function GET() {
    try {
        const stores = await prisma.store.findMany();

        return NextResponse.json(stores);

    } catch (error) {

        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

// CREATE STORE
export async function POST(req) {
    try {

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const {
            name,
            username,
            description,
            address,
            email,
            contact,
            logo,
        } = await req.json();

        const existingStore = await prisma.store.findUnique({
            where: {
                userId: decoded.id,
            },
        });

        if (existingStore) {
            return NextResponse.json(
                { message: "Store already exists" },
                { status: 400 }
            );
        }

        const usernameExists = await prisma.store.findUnique({
            where: {
                username,
            },
        });

        if (usernameExists) {
            return NextResponse.json(
                { message: "Username already exists" },
                { status: 400 }
            );
        }

        const store = await prisma.store.create({
            data: {
                userId: decoded.id,
                name,
                username,
                description,
                address,
                email,
                contact,
                logo,
                status: "APPROVED",
                isActive: true,
            },
        });

        return NextResponse.json(
            {
                message: "Store created successfully",
                store,
            },
            {
                status: 201,
            }
        );

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