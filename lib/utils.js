import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
