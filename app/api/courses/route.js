import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const GET = async (req) => {
  const courses = await prisma.course.findMany();
  return NextResponse.json(courses);
};
