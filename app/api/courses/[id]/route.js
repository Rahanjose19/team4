import { NextResponse } from "next/server";
import { prisma } from "@/lib/utils.js";
export async function GET(req, context) {
  const { params } = context;
  console.log("\n\n\n\n params are \n\n\n", params);
  const res = await prisma.course.findUnique({
    where: {
      id: params.id,
    },
    include: {
      quotas: true,
    },
  });

  return NextResponse.json(res);
}

export async function PUT(req, context) {
  const { params } = context;
  const { quotas } = await req.json();

  let res = [];
  for (let i = 0; i < quotas.length; i++) {
    if (quotas[i].id) {
      const quota = await prisma.quota.update({
        where: {
          id: quotas[i].id,
        },
        data: {
          name: quotas[i].name,
          seats: parseInt(quotas[i].seats),
        },
      });
      res.push(quota);
    } else {
      const quota = await prisma.quota.create({
        data: {
          course: {
            connect: {
              id: params.id,
            },
          },
          name: quotas[i].name,
          seats: parseInt(quotas[i].seats),
        },
      });
      res.push(quota);
    }
  }
  return NextResponse.json(res);
}
