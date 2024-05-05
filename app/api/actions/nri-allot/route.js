import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

async function getNriQuotas() {
  const nriQuotas = await prisma.quota.findMany({
    where: {
      name: "nri",
    },
    include: {
      course: true,
    },
  });

  return nriQuotas;
}
async function allotApplicants() {
  const nriQuotas = await getNriQuotas();
  let res = [];
  const applicants = await prisma.applicant.findMany({
    orderBy: {
      percentage: "desc",
    },
    include: {
      ApplicantChoice: {
        orderBy: {
          priority: "asc",
        },
        include: {
          quota: true,
        },
      },
    },
    where: {
      isNRI: true,
      alloted: false,
    },
  });
  console.log("step 1 ", applicants);

  for (const applicant of applicants) {
    for (const choice of applicant.ApplicantChoice) {
      const quota = nriQuotas.find((q) => q.courseId === choice.courseId);
      if (quota) {
        const allotments = await prisma.allotment.count({
          where: {
            quotaId: quota.id,
          },
        });

        if (allotments < quota.seats) {
          await prisma.applicant.update({
            where: {
              id: applicant.id,
            },
            data: {
              currentPriority: choice.priority,
            },
          });

          const allotment = await prisma.allotment.create({
            data: {
              quotaId: quota.id,
              applicantId: applicant.id,
              course_id: quota.courseId,
            },
            include: {
              applicant: true,
            },
          });
          res.push(allotment);
          break;
        }
      }
    }
  }
  return res;
}


export const GET = async (req) => {
  try {
    const allotments = await allotApplicants();
    return NextResponse.json({ allotments });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "error" }, { status: 400 });
  }
};
