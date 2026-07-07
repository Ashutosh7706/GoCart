import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStore } from "@/lib/auth";
import { createNotification } from "@/lib/notification";
import { createRefund } from "@/lib/refund";

/* ============================================================
   GET : Fetch All Return Requests for Current Store
============================================================ */

export async function GET(req) {
    try {
        const store = await getCurrentStore(req);

        if (!store) {
            return NextResponse.json(
                {
                    message: "Store not found",
                },
                {
                    status: 404,
                }
            );
        }

        const returns = await prisma.returnRequest.findMany({
            where: {
                order: {
                    storeId: store.id,
                },
            },

            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },

                order: {
                    include: {
                        orderItems: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        name: true,
                                        images: true,
                                    },
                                },
                            },
                        },

                        address: true,

                        payment: true,
                    },
                },
            },

            orderBy: {
                createdAt: "desc",
            },
        });

        const summary = {
            total: returns.length,

            requested: returns.filter(
                (item) => item.status === "REQUESTED"
            ).length,

            approved: returns.filter(
                (item) => item.status === "APPROVED"
            ).length,

            rejected: returns.filter(
                (item) => item.status === "REJECTED"
            ).length,

            refunded: returns.filter(
                (item) => item.status === "REFUNDED"
            ).length,
        };

        return NextResponse.json({
            success: true,
            summary,
            returns,
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

/* ============================================================
   PUT : Update Return Request Status
============================================================ */

export async function PUT(req, { params }) {
    try {
        const store = await getCurrentStore(req);

        if (!store) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const { id } = params;

        const body = await req.json();

        const request = await prisma.returnRequest.findUnique({
            where: {
                id,
            },

            include: {
                user: true,

                order: {
                    include: {
                        payment: true,
                    },
                },
            },
        });

        if (!request) {
            return NextResponse.json(
                {
                    message: "Return request not found",
                },
                {
                    status: 404,
                }
            );
        }

        if (request.order.storeId !== store.id) {
            return NextResponse.json(
                {
                    message: "Forbidden",
                },
                {
                    status: 403,
                }
            );
        }

        const updatedRequest = await prisma.returnRequest.update({
            where: {
                id,
            },
            data: {
                status: body.status,
            },
        });

        /* ===========================================
           Razorpay Refund
        =========================================== */

        let refund = null;

        if (
            body.status === "REFUNDED" &&
            request.order.payment
        ) {
            if (
                request.order.payment.gateway === "RAZORPAY"
            ) {
                refund = await createRefund({
                    paymentId:
                        request.order.payment.transactionId,

                    amount:
                        request.refundAmount,
                });

                if (!refund.success) {
                    return NextResponse.json(
                        {
                            message: refund.error,
                        },
                        {
                            status: 400,
                        }
                    );
                }
            }

            await prisma.payment.update({
                where: {
                    orderId: request.order.id,
                },

                data: {
                    status: "REFUNDED",

                    refundId:
                        refund?.refund?.id ?? null,
                },
            });

            await prisma.order.update({
                where: {
                    id: request.order.id,
                },

                data: {
                    isPaid: false,
                },
            });
        }

        /* ===========================================
           Email Type
        =========================================== */

        let emailType = "";

        switch (body.status) {
            case "APPROVED":
                emailType = "RETURN_APPROVED";
                break;

            case "REJECTED":
                emailType = "RETURN_REJECTED";
                break;

            case "REFUNDED":
                emailType = "REFUND_COMPLETED";
                break;

            default:
                break;
        }

        /* ===========================================
           Notification Object
        =========================================== */

        let notification = {
            title: "Return Updated",

            message:
                "Your return request has been updated.",

            type: "SYSTEM",

            link: "/returns",
        };

        switch (body.status) {
            case "APPROVED":
                notification = {
                    title: "Return Approved",

                    message: `Your return request for Order #${request.order.id.slice(-8)} has been approved.`,

                    type: "SYSTEM",

                    link: "/returns",
                };
                break;

            case "REJECTED":
                notification = {
                    title: "Return Rejected",

                    message: `Your return request for Order #${request.order.id.slice(-8)} has been rejected.`,

                    type: "SYSTEM",

                    link: "/returns",
                };
                break;

            case "REFUNDED":
                notification = {
                    title: "Refund Completed",

                    message: `₹${request.refundAmount} has been refunded successfully.`,

                    type: "PAYMENT",

                    link: "/returns",
                };
                break;
        }

/* ===========================================
   Send Email (Don't Fail API if Email Fails)
=========================================== */

if (emailType) {
    try {
        const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            process.env.APP_URL ||
            "http://localhost:3000";

        await fetch(`${baseUrl}/api/email/send`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                email: request.user.email,
                name: request.user.name,
                orderId: request.order.id,
                amount: request.refundAmount,
                type: emailType,
            }),
        });
    } catch (error) {
        console.error("Email sending failed:", error);
    }
}

/* ===========================================
   Customer Notification
=========================================== */

await createNotification({
    userId: request.userId,

    title: notification.title,

    message: notification.message,

    type: notification.type,

    link: notification.link,
});

/* ===========================================
   Seller Notification
=========================================== */

if (body.status === "APPROVED") {
    await createNotification({
        userId: store.userId,

        title: "Return Approved",

        message: `You approved return request for Order #${request.order.id.slice(
            -8
        )}.`,

        type: "ORDER",

        link: "/store/returns",
    });
}

if (body.status === "REJECTED") {
    await createNotification({
        userId: store.userId,

        title: "Return Rejected",

        message: `You rejected return request for Order #${request.order.id.slice(
            -8
        )}.`,

        type: "ORDER",

        link: "/store/returns",
    });
}

if (body.status === "REFUNDED") {
    await createNotification({
        userId: store.userId,

        title: "Refund Completed",

        message: `Refund of ₹${request.refundAmount} has been completed successfully.`,

        type: "PAYMENT",

        link: "/store/returns",
    });
}

        return NextResponse.json({
            success: true,

            returnRequest: updatedRequest,

            emailType,

            notification,
        });
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