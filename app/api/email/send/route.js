import { NextResponse } from "next/server";
import { Resend } from "resend";
import {

    returnRequestEmail,

    returnApprovedEmail,

    returnRejectedEmail,

    refundCompletedEmail,

} from "@/lib/emailTemplates/refundTemplates";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {

    try {

        const body = await req.json();

        const {
            to,
            subject,
            html,
        } = body;

        if (!to || !subject || !html) {

            return NextResponse.json(
                {
                    message: "Missing required fields",
                },
                {
                    status: 400,
                }
            );

        }

   

        let html1 = "";

switch (body.type) {

    case "RETURN_REQUEST":

        html1 = returnRequestEmail(

            body.name,

            body.orderId

        );

        break;

    case "RETURN_APPROVED":

        html1 = returnApprovedEmail(

            body.name,

            body.orderId

        );

        break;

    case "RETURN_REJECTED":

        html1 = returnRejectedEmail(

            body.name,

            body.orderId

        );

        break;

    case "REFUND_COMPLETED":

        html1 = refundCompletedEmail(

            body.name,

            body.orderId,

            body.amount

        );

        break;

}


     const email = await resend.emails.send({

            from: process.env.EMAIL_FROM,

            to,

            subject,

            html1,

        });
        return NextResponse.json({

            success: true,

            email,

        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            {
                status: 500,
            }
        );

    }

}