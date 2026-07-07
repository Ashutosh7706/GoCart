import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {

    const coupons = await prisma.coupon.findMany({

        orderBy:{
            createdAt:"desc",
        }

    });

    return NextResponse.json(coupons);

}

export async function POST(req){

    try{

        const user=await getCurrentUser(req);

        if(user.role!=="ADMIN"){

            return NextResponse.json({

                message:"Unauthorized"

            },{

                status:401

            });

        }

        const body=await req.json();

        const coupon=await prisma.coupon.create({

            data:{

                code:body.code.toUpperCase(),

                description:body.description,

                discount:Number(body.discount),

                expiresAt:new Date(body.expiresAt),

                isPublic:body.isPublic,

                forNewUser:body.forNewUser,

                forMember:body.forMember,

            }

        });

        return NextResponse.json(coupon);

    }

    catch(error){

        return NextResponse.json({

            message:error.message

        },{

            status:500

        });

    }

}