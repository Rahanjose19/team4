import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils.js";
export const GET = async (req) => {
  const courses = await prisma.course.findMany();
  return NextResponse.json(courses);
};
