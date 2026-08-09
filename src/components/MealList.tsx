"use client";

import { useEffect, useState } from "react";
import { Prisma } from "../generated/prisma/client";
import { motion, AnimatePresence } from "motion/react";

type MealWithImages = Prisma.MealGetPayload<{
    include: { images: true }
}>;

interface MealListProps {
    meals: MealWithImages[];
}

export default function MealList({ meals }: MealListProps) {
    const [rotations, setRotations] = useState<number[]>([]);

    useEffect(() => {
        // Generate random rotations for each meal card
        const randRotations = meals.map(() => Math.random() * 6 - 3); // -3 to 3 degrees
        setRotations(randRotations);
    }, [meals]);

    return (
        <div className="w-full">
            <h2 className="text-4xl font-caveat font-bold mb-8 text-slate-800">Recent Meals</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                <AnimatePresence>
                    {meals.map((meal, index) => {
                        const rotation = rotations.length > 0 ? rotations[index] : 0;
                        return (
                            <motion.li 
                                layout
                                initial={{ opacity: 0, scale: 0.9, filter: "brightness(2) contrast(0.5)", rotate: rotation }}
                                animate={{ opacity: 1, scale: 1, filter: "brightness(1) contrast(1)", rotate: rotation }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                key={meal.id} 
                                className="h-fit bg-white p-4 pb-12 shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:z-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300 relative border border-slate-100 cursor-pointer w-full"
                                whileHover={{ scale: 1.02, rotate: 0, y: -10, transition: { duration: 0.2 } }}
                            >
                                {meal.images && meal.images.length > 0 ? (
                                    <div className="w-full aspect-square overflow-hidden bg-slate-100 mb-4 border border-slate-200">
                                        <img src={meal.images[0].url} alt={meal.name} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-square bg-slate-100 mb-4 border border-slate-200 flex flex-col items-center justify-center">
                                        <div className="w-32 h-32 rounded-full border-4 border-slate-200 flex items-center justify-center bg-white shadow-inner relative z-10 opacity-70">
                                            <div className="w-20 h-20 rounded-full border border-slate-100 flex items-center justify-center"></div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="px-2">
                                    <h3 className="text-3xl font-caveat font-bold text-slate-800 mb-2 leading-tight">{meal.name}</h3>
                                    {meal.note && <p className="font-caveat text-slate-600 text-2xl leading-relaxed mb-4 line-clamp-3 whitespace-pre-line break-words">{meal.note}</p>}
                                    
                                    <div className="mt-6 pt-4 border-t border-slate-300 border-dashed flex gap-4 text-center justify-between font-sans">
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cal</p>
                                            <p className="font-semibold text-slate-700 text-sm">{meal.calories}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pro</p>
                                            <p className="font-semibold text-slate-700 text-sm">{meal.protein}g</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Carb</p>
                                            <p className="font-semibold text-slate-700 text-sm">{meal.carbs}g</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fat</p>
                                            <p className="font-semibold text-slate-700 text-sm">{meal.fat}g</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>
        </div>
    );
}