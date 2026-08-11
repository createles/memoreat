"use client";

import { useEffect, useState } from "react";
import { Prisma } from "../generated/prisma/client";
import { motion, AnimatePresence } from "motion/react";
import { X, Edit2, Trash2 } from "lucide-react";
import { deleteMeal } from "../actions/mealActions";
import MealForm from "./MealForm";
import { getMealIdsFromLocal, removeMealFromLocal } from "../lib/localIndex";

type MealWithImages = Prisma.MealGetPayload<{
    include: { images: true }
}>;

interface MealListProps {
    meals: MealWithImages[];
}

export default function MealList({ meals }: MealListProps) {
    const [rotations, setRotations] = useState<number[]>([]);
    const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
    const [mealToEdit, setMealToEdit] = useState<MealWithImages | null>(null);
    const [mealToDelete, setMealToDelete] = useState<number | null>(null);
    const [displayMeals, setDisplayMeals] = useState<MealWithImages[]>([]); // State to hold the meals that are displayed based on local storage

    useEffect(() => {
        const myIds = getMealIdsFromLocal();
        const myFilteredMeals = meals.filter(meal => myIds.includes(meal.id));
        setDisplayMeals(myFilteredMeals);
    }, [meals]);

    useEffect(() => {
        // Generate random rotations for each meal card
        const randRotations = displayMeals.map(() => Math.random() * 6 - 3); // -3 to 3 degrees
        setRotations(randRotations);
    }, [displayMeals]);

    return (
        <div className="w-full">
            <h2 className="text-4xl font-caveat font-bold mb-8 text-slate-800">Recent Meals</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
                <AnimatePresence>
                    {displayMeals.map((meal, index) => {
                        const rotation = rotations.length > 0 ? rotations[index] : 0;
                        return (
                            <motion.li 
                                layoutId={`meal-card-${meal.id}`}
                                initial={{ opacity: 0, scale: 0.9, filter: "brightness(2) contrast(0.5)", rotate: rotation }}
                                animate={{ opacity: 1, scale: 1, filter: "brightness(1) contrast(1)", rotate: rotation }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                key={meal.id} 
                                onClick={() => setSelectedMealId(meal.id)}
                                className="h-fit bg-white p-4 pb-12 shadow-[0_10px_20px_rgba(0,0,0,0.05)] hover:z-10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-shadow duration-300 relative border border-slate-100 cursor-pointer w-full"
                                whileHover={{ scale: 1.02, rotate: 0, y: -10, transition: { duration: 0.2 } }}
                            >
                                {meal.images && meal.images.length > 0 ? (
                                    <div className="w-full aspect-square overflow-hidden bg-slate-100 mb-4 border border-slate-200 relative">
                                        <img src={meal.images[0].url} alt={meal.name} className="w-full h-full object-cover" />
                                        {meal.images[0].attribution && (
                                            <div className="absolute bottom-1 right-2 text-[10px] text-white/80 bg-black/40 px-1.5 py-0.5 rounded pointer-events-none">
                                                {meal.images[0].attribution}
                                            </div>
                                        )}
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
                                            <p className="font-semibold text-slate-700 text-sm">{meal.protein != null ? `${meal.protein}g` : "-"}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Carb</p>
                                            <p className="font-semibold text-slate-700 text-sm">{meal.carbs != null ? `${meal.carbs}g` : "-"}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fat</p>
                                            <p className="font-semibold text-slate-700 text-sm">{meal.fat != null ? `${meal.fat}g` : "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.li>
                        );
                    })}
                </AnimatePresence>
            </ul>

            <AnimatePresence>
                {selectedMealId && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setSelectedMealId(null)}
                    >
                        {displayMeals.filter(m => m.id === selectedMealId).map(meal => (
                            <motion.div 
                                layoutId={`meal-card-${meal.id}`}
                                key={`expanded-${meal.id}`}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white p-6 pb-20 shadow-2xl relative border border-slate-100 w-full max-w-lg"
                            >
                                <button 
                                    onClick={() => setSelectedMealId(null)}
                                    className="absolute -top-12 right-0 p-2 text-white hover:text-slate-200 bg-slate-800/50 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                                
                                {meal.images && meal.images.length > 0 ? (
                                    <div className="w-full aspect-square overflow-hidden bg-slate-100 mb-6 border border-slate-200 relative">
                                        <img src={meal.images[0].url} alt={meal.name} className="w-full h-full object-cover" />
                                        {meal.images[0].attribution && (
                                            <div className="absolute bottom-1 right-2 text-[10px] text-white/80 bg-black/40 px-1.5 py-0.5 rounded pointer-events-none">
                                                {meal.images[0].attribution}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full aspect-square bg-slate-100 mb-6 border border-slate-200 flex flex-col items-center justify-center">
                                         <div className="w-32 h-32 rounded-full border-4 border-slate-200 flex items-center justify-center bg-white shadow-inner relative z-10 opacity-70">
                                             <div className="w-20 h-20 rounded-full border border-slate-100 flex items-center justify-center"></div>
                                         </div>
                                    </div>
                                )}
                                
                                <div className="px-2">
                                    <h3 className="text-4xl font-caveat font-bold text-slate-800 mb-2 leading-tight">{meal.name}</h3>
                                    {meal.note && <p className="font-caveat text-slate-600 text-3xl leading-relaxed mb-6 whitespace-pre-line break-words">{meal.note}</p>}
                                    
                                    <div className="mt-6 pt-6 border-t border-slate-300 border-dashed flex gap-4 text-center justify-between font-sans">
                                        <div className="flex flex-col items-center">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Cal</p>
                                            <p className="font-semibold text-slate-700 text-lg">{meal.calories}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Pro</p>
                                            <p className="font-semibold text-slate-700 text-lg">{meal.protein != null ? `${meal.protein}g` : "-"}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Carb</p>
                                            <p className="font-semibold text-slate-700 text-lg">{meal.carbs != null ? `${meal.carbs}g` : "-"}</p>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Fat</p>
                                            <p className="font-semibold text-slate-700 text-lg">{meal.fat != null ? `${meal.fat}g` : "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Edit Post-it */}
                                    {meal.id > 8 && (
                                        <motion.div
                                            onClick={() => setMealToEdit(meal)}
                                            whileHover={{ y: -2, scale: 1.05 }}
                                            className="absolute -bottom-8 right-8 bg-yellow-200 p-4 shadow-lg border border-black/5 flex items-center justify-center rotate-3 cursor-pointer group"
                                        >
                                            <Edit2 className="w-6 h-6 text-slate-700 group-hover:text-slate-900" />
                                            <span className="ml-2 font-caveat text-xl font-bold text-slate-700 group-hover:text-slate-900">Edit</span>
                                        </motion.div>
                                    )}

                                {/* Delete Post-it */}
                                <motion.div 
                                    onClick={() => setMealToDelete(meal.id)}
                                    whileHover={{ y: -2, scale: 1.05 }}
                                    className="absolute -bottom-8 left-8 bg-red-200 p-4 shadow-lg border border-black/5 flex items-center justify-center -rotate-3 cursor-pointer group"
                                >
                                    <Trash2 className="w-6 h-6 text-slate-700 group-hover:text-slate-900" />
                                    <span className="ml-2 font-caveat text-xl font-bold text-slate-700 group-hover:text-slate-900">Delete</span>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Render MealForm for Editing */}
            {mealToEdit && (
                <MealForm 
                    mealToEdit={mealToEdit} 
                    isOpenProp={true} 
                    onClose={() => setMealToEdit(null)} 
                />
            )}

            {/* Render Delete Confirmation Modal */}
            <AnimatePresence>
                {mealToDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setMealToDelete(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white p-8 max-w-sm w-full shadow-2xl flex flex-col items-center text-center relative border border-slate-200"
                        >
                            <div className="bg-red-100 p-4 rounded-full mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-3xl font-caveat font-bold text-slate-800 mb-2">Delete Meal?</h3>
                            <p className="text-slate-600 font-sans mb-6">Are you sure you want to delete this meal? This action cannot be undone.</p>
                            <div className="flex gap-4 w-full">
                                <button 
                                    onClick={() => setMealToDelete(null)}
                                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold font-sans uppercase tracking-widest text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        // Always remove from local view first
                                        removeMealFromLocal(mealToDelete);
                                        // Server will ignore if meal.id in seed data range (1-8)
                                        deleteMeal(mealToDelete);
                                        setDisplayMeals(prev => prev.filter(meal => meal.id !== mealToDelete));
                                        setMealToDelete(null);
                                        setSelectedMealId(null);
                                    }}
                                    className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold font-sans uppercase tracking-widest text-sm transition-colors shadow-lg"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}