"use client";

import { createMeal } from "../actions/mealActions";

export default function MealForm() {
    return (
        <form action={createMeal} encType="multipart/form-data">
            <div>
                <label htmlFor="name">Name:</label>
                <input type="text" name="name" id="name" required />
            </div>
            <div>
                <label htmlFor="calories">Calories:</label>
                <input type="number" name="calories" id="calories" required />
            </div>
            <div>
                <label htmlFor="protein">Protein (g):</label>
                <input type="number" name="protein" id="protein" required />
            </div>
            <div>
                <label htmlFor="carbs">Carbs (g):</label>
                <input type="number" name="carbs" id="carbs" required />
            </div>
            <div>
                <label htmlFor="fat">Fat (g):</label>
                <input type="number" name="fat" id="fat" required />
            </div>
            <div>
                <label htmlFor="note">Note:</label>
                <textarea name="note" id="note" placeholder="Enter any notes about the meal..."></textarea>
            </div>
            <div>
                <label htmlFor="image">Image:</label>
                <input type="file" name="image" id="image" accept="image/*" />
            </div>
            <button type="submit">Add Meal</button>
        </form>
    )
}