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

export const POST = async (req) => {
  const formData = await req.json();
  const { message,action } = formData;
  const log = await prisma.log.create({
    data: {
      message,
      action
    },
  });
  return NextResponse.json(log);
};
