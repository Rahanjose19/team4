import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils.js";

export const GET = async (req) => {
  const logs = await prisma.log.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(logs);
};
