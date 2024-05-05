import { prisma } from "@/lib/utils.js";
import { NextResponse } from "next/server";

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
  const allotment = await prisma.allotment.deleteMany({
    where: {
      applicantId: id,
    },
  });
  const replaced = await replaceNRIAllotment(allotment.course_id, true);
  return replaced;
};

export const POST = async (req) => {
  const allotments = await req.json();
  console.log("step 1", allotments);
  const res = allotments.map(async (allotment) => {
    const existingUser = await prisma.applicant.findUnique({
      where: {
        id: allotment.applicantId,
      },
    });

    console.log("step 1 a ", allotment.applicantId, existingUser);
    if (existingUser) {
      console.log("step 2", "existingUser found");
      if (existingUser.isNRI) {
        const replaced = removeNRIallotment(allotment.applicantId);
        const allotment = await prisma.allotment.create({
          data: {
            quota: {
              connect: {
                id: allotment.quotaId,
              },
            },
            applicant: {
              connect: {
                id: allotment.applicantId,
              },
            },
            course_id: allotment.courseId,
          },
        });
        return { nriReplaced: "true", replaced, allotment };
      }

      const previousAllotment = await prisma.allotment.findFirst({
        where: {
          applicantId: allotment.applicantId,
        },
      });

      const updated = await prisma.allotment.updateMany({
        where: {
          applicantId: allotment.applicantId,
        },
        data: {
          quotaId: allotment.quotaId,
          course_id: allotment.courseId,
        },
      });
      return { nriReplaced: "false", previousAllotment, updated };
    }

    const newAllotment = await prisma.allotment.create({
      data: {
        applicant: {
          connectOrCreate: {
            where: { id: allotment.applicantId },
            create: {
              id: allotment.applicantId,
              applicationNo: allotment.applicationNo,
              name: allotment.name,
              email: allotment.email,
              dateOfBirth: new Date(allotment.dateOfBirth),
              district: allotment.district,
              state: allotment.state,
              street: allotment.street,
              school: allotment.school,
              graduationYear: parseInt(allotment.graduationYear),
              percentage: parseFloat(allotment.percentage),
              major: allotment.major,
              phone: allotment.phone,
              address: allotment.address,
              isNRI: false,
              currentPriority: parseInt(allotment.currentPriority),
            },
          },
        },
        quota: {
          connect: {
            id: allotment.quotaId,
          },
        },
        course_id: allotment.courseId,
      },

      include: {
        applicant: true,
      },
    });
    return { nriReplaced: null, newAllotment };
  });

  const result = await Promise.all(res);
  let nriReplaced = 0;
  let nriDisplaced = 0;
  let quotaChanged = 0;
  let newApplicants = 0;

  for (const allotment of result) {
    if (allotment.nriReplaced === "true") {
      nriReplaced++;
      nriDisplaced += allotment.replaced.length || 0;
    } else if (allotment.nriReplaced === "false") {
      quotaChanged++;
    } else {
      newApplicants++;
    }
  }

  await prisma.log.create({
    data: {
      message: `Allotments updated: ${
        nriReplaced + nriDisplaced + quotaChanged + newApplicants
      }`,
    },
  });
  await prisma.log.create({
    data: {
      message: `NRI Replaced: ${nriReplaced}`,
    },
  });
  await prisma.log.create({
    data: {
      message: `NRI Displaced: ${nriDisplaced}`,
    },
  });
  await prisma.log.create({
    data: {
      message: `Quota Changed: ${quotaChanged}`,
    },
  });
  await prisma.log.create({
    data: {
      message: `New Applicants: ${newApplicants}`,
    },
  });

  console.log("step 2", result);
  return NextResponse.json(result);
};
