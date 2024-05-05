import { PrismaClient } from "@prisma/client";
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

const replaceNRIAllotment = async (courseId, repeat = false, memo = []) => {
  const quota = await prisma.quota.findFirst({
    where: {
      courseId: courseId,
      name: "nri",
    },
    include: {
      course: true,
    },
  });
  console.log("step 1", quota);

  if (quota) {
    const allotments = await prisma.allotment.count({
      where: {
        quotaId: quota.id,
      },
    });

    console.log("step 2", allotments);

    if (allotments < quota.seats) {
      const applicants = await prisma.applicant.findMany({
        where: {
          ApplicantChoice: {
            some: {
              courseId: courseId,
            },
          },
        },
        orderBy: {
          percentage: "desc",
        },
        include: {
          ApplicantChoice: {
            where: {
              courseId: courseId,
            },
            orderBy: {
              priority: "asc",
            },
          },
        },
      });
      console.log("step 3", JSON.stringify(applicants));
      for (const applicant of applicants) {
        const choice = applicant.ApplicantChoice[0];

        if (
          !applicant.currentPriority ||
          (choice && applicant.currentPriority > choice.priority)
        ) {
          console.log("step 4 inside if");
          await prisma.applicant.update({
            where: {
              id: applicant.id,
            },
            data: {
              currentPriority: choice.priority,
            },
          });
          const delAllotment = await prisma.allotment.deleteMany({
            where: {
              applicantId: applicant.id,
            },
          });

          const allotment = await prisma.allotment.create({
            data: {
              quotaId: quota.id,
              applicantId: applicant.id,
              course_id: quota.courseId,
            },
          });

          memo.push(allotment);
          if (!delAllotment) {
            return memo;
          }

          return replaceNRIAllotment(delAllotment.course_id, repeat, memo);
        } else return memo;
      }
    }
    return memo;
  }
};

const removeNRIallotment = async (id) => {
  const allotment = await prisma.allotment.delete({
    where: {
      id: id,
    },
  });
  await replaceNRIAllotment(allotment.course_id, true);
  return allotment;
};
replaceNRIAllotment("cs", true).then((allotment) => {
  console.log(allotment);
});

// export const GET = async (req) => {
//   return NextResponse.json({ message: "Hello" });
// };
