"use server";

import { prisma } from "../lib/prisma";

export async function getMeals() {
    try {
        return await prisma.meal.findMany({
            include: { images: true }
        })
    } catch (error) {
        console.error("Error fetching meals:", error);
        throw new Error("Failed to fetch meals");
    }
}