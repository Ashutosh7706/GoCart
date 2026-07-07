import { prisma } from "@/lib/prisma";

export async function getAllProducts() {
    return await prisma.product.findMany({
        include: {
            store: true,
            rating: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
}

export async function createProduct(data) {
    return await prisma.product.create({
        data,
    });
}