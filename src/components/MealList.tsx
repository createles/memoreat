"use client";

import { Prisma } from "../generated/prisma/client";

type MealWithImages = Prisma.MealGetPayload<{
    include: { images: true }
}>;

interface MealListProps {
    meals: MealWithImages[];
}

export default function MealList({ meals }: MealListProps) {
    return (
        <div>
            <h2>Meal List</h2>
            <ul>
                {meals.map((meal) => (
                    <li key={meal.id}>
                        <h3>{meal.name}</h3>
                        <p>Calories: {meal.calories}</p>
                        <p>Protein: {meal.protein}g</p>
                        <p>Carbs: {meal.carbs}g</p>
                        <p>Fat: {meal.fat}g</p>
                        <p>Note: {meal.note}</p>
                        {meal.images && meal.images.length > 0 && (
                            <div>
                                <h4>Images:</h4>
                                <ul>
                                    {meal.images.map((image) => (
                                        <li key={image.id}>
                                            <img src={image.url} alt={meal.name} width="200" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}