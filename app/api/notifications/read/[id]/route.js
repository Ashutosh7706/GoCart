import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req,{params}){

    try{

        await prisma.notification.update({

            where:{

                id:params.id,

            },

            data:{

                isRead:true,

            }

        });

        return NextResponse.json({

            success:true

        });

    }

    catch(error){

        return NextResponse.json({

            message:error.message

        },{

            status:500

        });

    }

}