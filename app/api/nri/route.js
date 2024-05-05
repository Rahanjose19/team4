// pages/api/submitForm.js
import { prisma } from "@/lib/utils.js";
import { parse } from "next/dist/build/swc";
import { NextResponse } from "next/server";

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
              id: priorityList[i].course,
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

export const EDIT = async (req) => {
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
    id,
  } = formData.form;

  const priorityList = formData.priorityList;

  let dob = new Date(dateOfBirth);
  try {
    const result = await prisma.applicant.update({
      where: {
        id: id,
      },
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
      },
    });

    await prisma.applicantChoice.deleteMany({
      where: {
        applicantId: id,
      },
    });

    for (let i = 0; i < priorityList.length; i++) {
      await prisma.applicantChoice.create({
        data: {
          applicant: {
            connect: {
              id: id,
            },
          },
          course: {
            connect: {
              id: priorityList[i].course,
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

export const DELETE = async (req) => {
  const formData = await req.json();
  console.log(formData);
  const { id } = formData;
  try {
    await prisma.applicantChoice.deleteMany({
      where: {
        applicantId: id,
      },
    });

    await prisma.applicant.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "wrongggg" }, { status: 400 });
  }
};
