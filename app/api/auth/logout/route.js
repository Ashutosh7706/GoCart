import { NextResponse } from "next/server";

export async function POST() {
    try {

        const response = NextResponse.json(
            {
                message: "Logged out successfully",
            },
            {
                status: 200,
            }
        );

        response.cookies.set({
            name: "token",
            value: "",
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            path: "/",
            expires: new Date(0),
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