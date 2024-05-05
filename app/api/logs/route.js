import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async (req) => {
    const logs = await prisma.log.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    return NextResponse.json(logs);
}

