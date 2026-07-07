import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req) {

    try {

        const user = await getCurrentUser(req);

        const notifications = await prisma.notification.findMany({

            where:{

                userId:user.id,

            },

            orderBy:{

                createdAt:"desc",

            }

        });

        return NextResponse.json(notifications);

    }

    catch(error){

        return NextResponse.json({

            message:error.message

        },{

            status:500

        });

    }

}