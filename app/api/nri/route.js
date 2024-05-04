// pages/api/submitForm.js
import { PrismaClient } from "@prisma/client";
import { parse } from "next/dist/build/swc";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req) => {
  const formData = await req.json();
  console.log(formData);
  const {
    name,
    email,
    dateOfBirth,
    district,
    state,
    street,
    school,
    graduationYear,
    percentage,
    major,
    phone,
    address,
    applicationNo,
  } = formData.form;

  const priorityList = formData.priorityList;

  let dob = new Date(dateOfBirth);
  try {
    const result = await prisma.applicant.create({
      data: {
        name,
        dateOfBirth: dob,
        email,
        district,
        state,
        street,
        school,
        graduationYear: parseInt(graduationYear),
        percentage: parseFloat(percentage),
        major,
        phone,
        address,
        applicationNo,
        isNRI: true,
      },
    });

    for (let i = 0; i < priorityList.length; i++) {
      await prisma.applicantChoice.create({
        data: {
          applicant: {
            connect: {
              id: result.id,
            },
          },
          course: {
            connect: {
              id: priorityList[i],
            },
          },
          priority: i + 1,
        },
      });
    }
    return NextResponse.json({ message: result }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "wrongggg" }, { status: 400 });
  }
};

export const GET = async (req) => {
  const applicants = await prisma.applicant.findMany({
    where: {
      isNRI: true,
    },
    orderBy: {
      percentage: "desc",
    },
  });
  return NextResponse.json(applicants);
};
