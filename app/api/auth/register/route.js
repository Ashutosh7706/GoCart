import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { emailTemplates } from "@/lib/email/templates";

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });


await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/email/send`, {

    method: "POST",

    headers: {
        "Content-Type": "application/json",
    },

    body: JSON.stringify({

        to: user.email,

        subject: "Welcome to GoCart",

        html: emailTemplates.welcome(user.name),

    }),

});

        return NextResponse.json(
            {
                message: "User Registered",
                user,
            },
            { status: 201 }
        );
  


    } catch (error) {
        return NextResponse.json(
            { message: error.message },
            { status: 500 }
        );
    }
}   

