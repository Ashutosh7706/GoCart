import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentStore } from "@/lib/auth";

export async function GET(req) {

    try {

        const store = await getCurrentStore(req);

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const monthStart = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        // Products

        const totalProducts = await prisma.product.count({

            where: {

                storeId: store.id,

            },

        });

        const lowStockProducts = await prisma.product.findMany({

            where: {

                storeId: store.id,

                stock: {

                    lte: 5,

                },

            },

            orderBy: {

                stock: "asc",

            },

            take: 5,

        });

        // Orders

        const totalOrders = await prisma.order.count({

            where: {

                storeId: store.id,

            },

        });

        const pendingOrders = await prisma.order.count({

            where: {

                storeId: store.id,

                status: {

                    in: [

                        "ORDER_PLACED",

                        "PROCESSING",

                    ],

                },

            },

        });

        // Revenue

        const allOrders = await prisma.order.findMany({

            where: {

                storeId: store.id,

                isPaid: true,

            },

        });

        const todayOrders = await prisma.order.findMany({

            where: {

                storeId: store.id,

                isPaid: true,

                createdAt: {

                    gte: today,

                },

            },

        });

        const monthOrders = await prisma.order.findMany({

            where: {

                storeId: store.id,

                isPaid: true,

                createdAt: {

                    gte: monthStart,

                },

            },

        });

        const totalRevenue = allOrders.reduce(

            (sum, order) => sum + order.total,

            0

        );

        const todayRevenue = todayOrders.reduce(

            (sum, order) => sum + order.total,

            0

        );

        const monthRevenue = monthOrders.reduce(

            (sum, order) => sum + order.total,

            0

        );

        // Recent Orders

        const recentOrders = await prisma.order.findMany({

            where: {

                storeId: store.id,

            },

            include: {

                user: true,

            },

            orderBy: {

                createdAt: "desc",

            },

            take: 5,

        });

        // Best Selling Products

        const bestSelling = await prisma.orderItem.groupBy({

            by: ["productId"],

            _sum: {

                quantity: true,

            },

            orderBy: {

                _sum: {

                    quantity: "desc",

                },

            },

            take: 5,

        });

        const bestProducts = await Promise.all(

            bestSelling.map(async item => {

                const product = await prisma.product.findUnique({

                    where: {

                        id: item.productId,

                    },

                });

                return {

                    ...product,

                    sold: item._sum.quantity,

                };

            })

        );

const monthlyAnalytics = [];

for (let i = 11; i >= 0; i--) {

    const start = new Date();

    start.setMonth(start.getMonth() - i);

    start.setDate(1);

    start.setHours(0,0,0,0);

    const end = new Date(start);

    end.setMonth(end.getMonth()+1);

    const monthlyOrders = await prisma.order.findMany({

        where:{

            storeId:store.id,

            createdAt:{
                gte:start,
                lt:end,
            },

            isPaid:true,

        }

    });

    monthlyAnalytics.push({

        month:start.toLocaleString("default",{

            month:"short",

        }),

        revenue:monthlyOrders.reduce(

            (sum,o)=>sum+o.total,

            0

        ),

        orders:monthlyOrders.length,

    });

}

        return NextResponse.json({

            revenue: {

                today: todayRevenue,

                month: monthRevenue,

                total: totalRevenue,

            },

            orders: {

                total: totalOrders,

                pending: pendingOrders,

            },

            products: {

                total: totalProducts,

                lowStock: lowStockProducts,

            },

        monthlyAnalytics,

            bestProducts,

            recentOrders,

        });

    }

    catch (error) {

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