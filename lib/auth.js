import jwt from "jsonwebtoken";
import { prisma } from "./prisma";
import {cookies} from "next/headers";
export async function getCurrentUser(req) {

    const cookieStore = await cookies();

const token = cookieStore.get("token")?.value;

if (!token) {
    throw new Error("Unauthorized");
}
console.log("TOKEN:", token);  
    if (!token) {
        throw new Error("Unauthorized");
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    return decoded;
}

export async function getCurrentStore() {

    const user = await getCurrentUser();

    const store = await prisma.store.findUnique({
        where: {
            userId: user.id,
        },
    });

    if (!store) {
        throw new Error("Store not found");
    }

    return store;
}