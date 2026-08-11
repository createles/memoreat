"use server";

import { prisma } from "../lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadImageToCloudinary } from "../lib/cloudinary";

export async function getMeals() {
    try {
        return await prisma.meal.findMany({
            include: { images: true },
            orderBy: { createdAt: 'desc' }
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
        imageUrl = await uploadImageToCloudinary(buffer, filename);
    }

    try {
        const newMeal =await prisma.meal.create({
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
        return newMeal;
    } catch (error) {
        console.error("Error creating meal:", error);
        throw new Error("Failed to create meal");
    }
}

export async function deleteMeal(mealId: number) {
    // Protect seed data from global deletion
    if (mealId <= 8) {
        return; // Do not delete seed meals;
    }

    try {
        await prisma.meal.delete({
            where: { id: mealId }
        })
        revalidatePath("/");
    } catch (error) {
        console.error("Error deleting meal:", error);
        throw new Error("Failed to delete meal");
    }
}

export async function updateMeal(mealId: number, formData: FormData) {
    // Protect seed data from global updates
    if (mealId <= 8) {
        return; // Do not update seed meals;
    }
    
    const image = formData.get("image") as File | null;
    let imageUrl = null;

    // Handle image uploads if provided
    if (image && image.size > 0) {
        const buffer = Buffer.from(await image.arrayBuffer());
        const filename = `${Date.now()}-${image.name}`;
        imageUrl = await uploadImageToCloudinary(buffer, filename);
    }

    try {
        await prisma.meal.update({
            where: { id: mealId },
            data: {
                name: formData.get("name") as string,
                calories: Number(formData.get("calories")),
                protein: Number(formData.get("protein")),
                carbs: Number(formData.get("carbs")),
                fat: Number(formData.get("fat")),
                note: formData.get("note") as string,
                ...(imageUrl && {
                    images: {
                        deleteMany: {},
                        create: { url: imageUrl }
                    }
                })
            },
        })
        revalidatePath("/");
    } catch (error) {
        console.error("Error updating meal:", error);
        throw new Error("Failed to update meal");   
    }
}