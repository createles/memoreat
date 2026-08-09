"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

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

export async function createMeal(formData: FormData) {
    const image = formData.get("image") as File | null;
    let imageUrl = null;

    // Handle image uploads if provided
    if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now()}-${image.name}`;
        const filepath = path.join(process.cwd(), "public/uploads", filename);
        await writeFile(filepath, buffer);
        imageUrl = `/uploads/${filename}`;
    }

    try {
        await prisma.meal.create({
            data: {
                name: formData.get("name") as string,
                calories: Number(formData.get("calories")),
                protein: Number(formData.get("protein")),
                carbs: Number(formData.get("carbs")),
                fat: Number(formData.get("fat")),
                note: formData.get("note") as string,
                images: {
                    create: imageUrl ? { url: imageUrl } : undefined
                }
            },
            include: { images: true }
        })
        revalidatePath("/");
    } catch (error) {
        console.error("Error creating meal:", error);
        throw new Error("Failed to create meal");
    }
}
