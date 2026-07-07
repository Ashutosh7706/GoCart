import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStore } from "@/lib/auth";


export async function GET(req, { params }) {
    try {

        const store = await getCurrentStore(req);

        if (!store) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 }
            );
        }

        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        if (product.storeId !== store.id) {
            return NextResponse.json(
                { message: "Forbidden" },
                { status: 403 }
            );
        }

        return NextResponse.json(product);

    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req, { params }) {
    try {

        const store = await getCurrentStore(req);

        if (!store) {
            return NextResponse.json(
                { message: "Store not found" },
                { status: 404 }
            );
        }

        const { id } = await params;

        const body = await req.json();

        const product = await prisma.product.findUnique({
            where: {
                id,
            },
        });

        if (!product) {
            return NextResponse.json(
                { message: "Product not found" },
                { status:404 }
            );
        }

        if (product.storeId !== store.id) {
            return NextResponse.json(
                { message:"Forbidden" },
                { status:403 }
            );
        }

        const updatedProduct = await prisma.product.update({
            where:{
                id,
            },
            data:{
                name: body.name,
                description: body.description,
                category: body.category,
                mrp: Number(body.mrp),
                price: Number(body.price),
            },
        });

        return NextResponse.json(updatedProduct);

    } catch(error){

        return NextResponse.json(
            { message:error.message },
            { status:500 }
        );

    }
}