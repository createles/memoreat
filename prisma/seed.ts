import { prisma } from "../src/lib/prisma";

async function main() {
    const meals = [
        { name: "Spaghetti Bolognese", calories: 850, protein: 35, carbs: 90, fat: 30, note: "Best served with grated Parmesan cheese.", images: { create: { url: "/images/mr_wdh-LzVx9R3W2LY-unsplash.jpg", attribution: "Photo by 王 大洪 on Unsplash" } } },
        { name: "Chicken Caesar Salad", calories: 400, protein: 25, carbs: 30, fat: 20, note: "Add extra dressing for more flavor.", images: { create: { url: "/images/you-le-4V1TfWW8PtI-unsplash.jpg", attribution: "Photo by You Le on Unsplash" } } },
        { name: "Margherita Pizza", calories: 500, protein: 20, carbs: 60, fat: 25, note: "Best enjoyed hot and fresh.", images: { create: { url: "/images/chad-montano-MqT0asuoIcU-unsplash.jpg", attribution: "Photo by Chad Montano on Unsplash" } } },
        { name: "Beef Tacos", calories: 350, protein: 25, carbs: 40, fat: 15, note: "Perfect for a quick lunch.", images: { create: { url: "/images/alma-agencia-d-n5jDzmKMT8w-unsplash.jpg", attribution: "Photo by Alma Agencia on Unsplash" } } },
        { name: "Grilled Salmon", calories: 450, protein: 40, carbs: 10, fat: 25, note: "High in omega-3 fatty acids.", images: { create: { url: "/images/to-uyen-6xlFlaPQfM0-unsplash.jpg", attribution: "Photo by To Uyen on Unsplash" } } },
        { name: "Vegetable Stir Fry", calories: 200, protein: 10, carbs: 30, fat: 10, note: "Great as a healthy side dish.", images: { create: { url: "/images/carlos-fernandez-w3awZjfVa6w-unsplash.jpg", attribution: "Photo by Carlos Fernandez on Unsplash" } } },
        { name: "Chocolate Lava Cake", calories: 300, protein: 5, carbs: 45, fat: 15, note: "Serve with vanilla ice cream.", images: { create: { url: "/images/max-griss-Pzjez86SsvQ-unsplash.jpg", attribution: "Photo by Max Griss on Unsplash" } } },
        { name: "Greek Yogurt Parfait", calories: 250, protein: 15, carbs: 35, fat: 5, note: "A healthy and delicious breakfast option.", images: { create: { url: "/images/maanji-96-E7xSWS51ak4-unsplash.jpg", attribution: "Photo by Maanji on Unsplash" } } },
    ];

    // Wipe the existing data before seeding
    await prisma.meal.deleteMany({});
    
    for (const meal of meals) {
        await prisma.meal.create({
            data: meal
        });
    }

    await prisma.$disconnect();
}

main()
    .then(() => {
        console.log("Seeding completed successfully.");
        process.exit(0);
    })
    .catch((error) => {
        console.error("Error during seeding:", error);
        process.exit(1);
    });