import { prisma } from "@/lib/utils.js";
import { NextResponse } from "next/server";

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
  let logs=[];
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
              alloted: true,
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
          logs.push(allotment.applicant.name +"(" +allotment.applicantId + ")"+ " alloted to " + allotment.course_id)
          res.push(allotment);
          break;
        }
      }
    }
  }
  if (res.length) {
    await prisma.log.create({
      data: {
        message: "Alloted " + res.length + " NRI applicants , " + logs.join(","),
      },
    });
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
