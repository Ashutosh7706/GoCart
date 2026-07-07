import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStore } from "@/lib/auth";

// ==========================
// GET ALL PRODUCTS
// ==========================
export async function GET() {
    try {
        const products = await prisma.product.findMany({
            where: {
                isPublished: true,
                inStock: true,
            },
            include: {
                store: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        logo: true,
                    },
                },
                rating: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json(products);

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

// ==========================
// CREATE PRODUCT
// ==========================
export async function POST(req) {
    try {

        // Logged in store
        const store = await getCurrentStore(req);

        const {
            name,
            description,
            mrp,
            price,
            category,
            images,
        } = await req.json();

        if (!name || !description || !category) {
            return NextResponse.json(
                {
                    message: "All fields are required",
                },
                {
                    status: 400,
                }
            );
        }

        if (!images || images.length === 0) {
            return NextResponse.json(
                {
                    message: "Please upload at least one image",
                },
                {
                    status: 400,
                }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                mrp: Number(mrp),
                price: Number(price),
                category,
                images,

                storeId: store.id,

                stock: 100,

                sku: `SKU-${Date.now()}`,

                inStock: true,

                isPublished: true,
            },
        });

        return NextResponse.json(
            {
                message: "Product created successfully",
                product,
            },
            {
                status: 201,
            }
        );

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