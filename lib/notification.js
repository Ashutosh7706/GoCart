import { prisma } from "./prisma";

export async function createNotification({

    userId,

    title,

    message,

    type,

    link,

}){

    return prisma.notification.create({

        data:{

            userId,

            title,

            message,

            type,

            link,

        }

    });

}