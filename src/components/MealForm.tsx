"use client";

import { useState, useEffect } from "react";
import { createMeal } from "../actions/mealActions";
import { Camera, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const postItColors = ["bg-yellow-100", "bg-pink-100", "bg-green-100", "bg-blue-100"];

export default function MealForm() {
    const [isOpen, setIsOpen] = useState(false);
    
    // Randomize post-it colors and rotations once on mount (client-side)
    const [styles, setStyles] = useState<{ color: string; rotation: number }[]>([]);
    
    useEffect(() => {
        if (isOpen) {
            setStyles(Array(6).fill(0).map(() => ({
                color: postItColors[Math.floor(Math.random() * postItColors.length)],
                rotation: Math.random() * 4 - 2
            })));
        }
    }, [isOpen]);

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="fixed bottom-8 right-8 z-50 p-4 bg-slate-800 text-white rounded-full shadow-2xl transition-colors hover:bg-slate-900"
                aria-label="Log Meal"
            >
                <Camera className="w-8 h-8" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-md overflow-y-auto"
                    >
                        {/* Viewfinder Circle Expanding Effect */}
                        <motion.div
                            initial={{ clipPath: 'circle(0% at 90% 90%)' }}
                            animate={{ clipPath: 'circle(150% at 50% 50%)' }}
                            exit={{ clipPath: 'circle(0% at 90% 90%)' }}
                            transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute inset-0 bg-transparent"
                        />

                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ delay: 0.2, duration: 0.5, type: "spring", bounce: 0.4 }}
                            className="relative w-full max-w-lg z-10 pt-16 pb-32"
                        >
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-0 z-50 p-2 text-white hover:text-slate-200 bg-slate-800/50 rounded-full hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <form action={createMeal} encType="multipart/form-data" className="relative space-y-6 flex flex-col items-center" onSubmit={() => setIsOpen(false)}>
                                <div className="text-center mb-6 w-full">
                                    <h2 className="text-5xl font-caveat font-bold text-white drop-shadow-lg">New Memory</h2>
                                </div>
                                
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white p-4 pb-4 shadow-2xl border border-slate-200 relative group w-full"
                                >
                                    {/* Image Upload Area mimicking a silhouette / plate */}
                                    <div className="w-full aspect-square bg-slate-100 border-2 border-dashed border-slate-300 relative flex flex-col items-center justify-center overflow-hidden transition-colors group-hover:bg-slate-50 cursor-pointer">
                                        <input type="file" name="image" id="image" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
                                        
                                        {/* Plate Silhouette */}
                                        <motion.div 
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                            className="w-48 h-48 rounded-full border-4 border-slate-200 flex items-center justify-center bg-white shadow-inner relative z-10"
                                        >
                                            <div className="w-32 h-32 rounded-full border border-slate-100 flex items-center justify-center">
                                                {/* Add Image Button inside silhouette */}
                                                <div className="bg-slate-800 text-white px-4 py-2 rounded-full flex items-center gap-2 font-sans font-bold shadow-md group-hover:bg-slate-700 transition-colors">
                                                    <ImageIcon className="w-4 h-4" />
                                                    <span>Add Image</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                {/* Inputs as post-its */}
                                <div className="w-full grid grid-cols-2 gap-6 px-2 mt-4 relative z-20">
                                    {/* Name Post-it */}
                                    <div 
                                        className={`${styles[0]?.color || 'bg-yellow-100'} p-4 shadow-lg border border-black/5 flex flex-col -mt-16`}
                                        style={{ transform: `rotate(${styles[0]?.rotation || -1}deg)` }}
                                    >
                                        <label htmlFor="name" className="font-caveat font-bold text-2xl text-slate-800 mb-1">Meal Name</label>
                                        <input type="text" name="name" id="name" required className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-caveat text-xl placeholder-slate-400" placeholder="E.g. Sunday Brunch" />
                                    </div>

                                    {/* Macros Post-it */}
                                    <div 
                                        className={`${styles[1]?.color || 'bg-pink-100'} p-4 shadow-lg border border-black/5 grid grid-cols-2 gap-2 -mt-8`}
                                        style={{ transform: `rotate(${styles[1]?.rotation || 1}deg)` }}
                                    >
                                        <div className="flex flex-col">
                                            <label htmlFor="calories" className="font-caveat font-bold text-lg text-slate-800">Cals</label>
                                            <input type="number" name="calories" id="calories" required className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-sans text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="protein" className="font-caveat font-bold text-lg text-slate-800">Pro (g)</label>
                                            <input type="number" name="protein" id="protein" required className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-sans text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="carbs" className="font-caveat font-bold text-lg text-slate-800">Carb (g)</label>
                                            <input type="number" name="carbs" id="carbs" required className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-sans text-sm" />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="fat" className="font-caveat font-bold text-lg text-slate-800">Fat (g)</label>
                                            <input type="number" name="fat" id="fat" required className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-sans text-sm" />
                                        </div>
                                    </div>
                                    
                                    {/* Notes Post-it */}
                                    <div 
                                        className={`${styles[2]?.color || 'bg-blue-100'} p-4 shadow-lg border border-black/5 col-span-2 -mt-4`}
                                        style={{ transform: `rotate(${styles[2]?.rotation || 0.5}deg)` }}
                                    >
                                        <label htmlFor="note" className="font-caveat font-bold text-2xl text-slate-800 mb-1 block">Notes</label>
                                        <textarea name="note" id="note" rows={2} placeholder="How was it?" className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-caveat text-2xl resize-none"></textarea>
                                    </div>
                                </div>

                                <div className="text-center mt-8 w-full absolute -bottom-16">
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        type="submit" 
                                        className="py-3 px-8 bg-slate-800 text-white font-bold rounded-lg shadow-xl font-sans tracking-widest uppercase"
                                    >
                                        Develop Photo
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}