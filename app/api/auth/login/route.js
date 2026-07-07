import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createToken } from "@/lib/jwt";

export async function POST(req) {
    try {

        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return NextResponse.json(
                {
                    message: "Invalid email or password",
                },
                {
                    status: 401,
                }
            );
        }

        if (!user.password) {
            return NextResponse.json(
                {
                    message: "Password not set for this account",
                },
                {
                    status: 401,
                }
            );
        }

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return NextResponse.json(
                {
                    message: "Invalid email or password",
                },
                {
                    status: 401,
                }
            );
        }

        const token = createToken({
            id: user.id,
            role: user.role,
            email: user.email,
        });

        const response = NextResponse.json(
            {
                message: "Login successful",
                role: user.role,
            },
            {
                status: 200,
            }
        );

        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

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