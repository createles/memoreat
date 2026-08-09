import { prisma } from "../src/lib/prisma";

async function main() {
    await prisma.meal.createMany({
        data: [
            { name: "Spaghetti Bolognese", calories: 850, protein: 35, carbs: 90, fat: 30, note: "Best served with grated Parmesan cheese."},
            { name: "Chicken Caesar Salad", calories: 400, protein: 25, carbs: 30, fat: 20, note: "Add extra dressing for more flavor." },
            { name: "Margherita Pizza", calories: 500, protein: 20, carbs: 60, fat: 25, note: "Best enjoyed hot and fresh." },
            { name: "Beef Tacos", calories: 350, protein: 25, carbs: 40, fat: 15, note: "Perfect for a quick lunch." },
            { name: "Grilled Salmon", calories: 450, protein: 40, carbs: 10, fat: 25, note: "High in omega-3 fatty acids." },
            { name: "Vegetable Stir Fry", calories: 200, protein: 10, carbs: 30, fat: 10, note: "Great as a healthy side dish." },
            { name: "Chocolate Lava Cake", calories: 300, protein: 5, carbs: 45, fat: 15, note: "Serve with vanilla ice cream." },
            { name: "Greek Yogurt Parfait", calories: 250, protein: 15, carbs: 35, fat: 5, note: "A healthy and delicious breakfast option." },
        ]
    })
    

    await prisma.meal.create({
        data: {
            name: "Avocado Toast",
            calories: 300,
            protein: 8,
            carbs: 30,
            fat: 20,
            note: "Add a poached egg for extra protein.",
            images: {
                create: {
                    url: "https://example.com/images/avocado-toast.jpg"
                }
            }
        }
    })

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