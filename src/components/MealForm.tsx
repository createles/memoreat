"use client";

import { useState, useEffect } from "react";
import { createMeal, updateMeal } from "../actions/mealActions";
import { Prisma } from "../generated/prisma/client";
import { Camera, X, Image as ImageIcon } from "lucide-react";
import { saveMealToLocal } from "../lib/localIndex";

type MealWithImages = Prisma.MealGetPayload<{
    include: { images: true }
}>;

interface MealFormProps {
    mealToEdit?: MealWithImages | null;
    isOpenProp?: boolean;
    onClose?: () => void;
}

import { motion, AnimatePresence } from "motion/react";

const postItColors = ["bg-yellow-100", "bg-pink-100", "bg-green-100", "bg-blue-100"];

export default function MealForm({ mealToEdit, isOpenProp = false, onClose }: MealFormProps = {}) {
    const [isOpen, setIsOpen] = useState(isOpenProp);
    const [previewUrl, setPreviewUrl] = useState<string | null>(mealToEdit?.images?.[0]?.url || null);

    useEffect(() => {
        setIsOpen(isOpenProp);
        setPreviewUrl(mealToEdit?.images?.[0]?.url || null);
    }, [isOpenProp, mealToEdit]);


    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    
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
            <div className="fixed bottom-8 right-8 z-50 group">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-white px-3 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity font-sans shadow-lg pointer-events-none">
                    Log a meal
                </div>
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 bg-slate-800 text-white rounded-full shadow-2xl transition-colors hover:bg-slate-900 relative"
                    aria-label="Log Meal"
                >
                    <Camera className="w-8 h-8" />
                </motion.button>
            </div>

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
                            className="relative w-full max-w-lg z-10 py-4 sm:py-8 max-h-[100dvh] flex flex-col"
                        >
                            <button 
                                onClick={() => { setIsOpen(false); setTimeout(() => { setPreviewUrl(null); if (onClose) onClose(); }, 400); }}
                                className="absolute top-0 sm:-top-4 right-0 z-50 p-2 text-white hover:text-slate-200 bg-slate-800/50 rounded-full hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                            
                            <form encType="multipart/form-data" className="relative flex flex-col items-center w-full min-h-0 shrink" onSubmit={async (e) => {
                                // 1. Stop the browser from refreshing the page
                                e.preventDefault();

                                // 2. Grab the data from the form
                                const formData = new FormData(e.currentTarget);

                                // 3. Call our Server Actions manually and wait for them to finish
                                if (mealToEdit) {
                                    await updateMeal(mealToEdit.id, formData);
                                } else {
                                    const newMeal = await createMeal(formData);
                                    if (newMeal) {
                                        // 4. Save the ID to localStorage!
                                        saveMealToLocal(newMeal.id);
                                    }
                                }

                                // 5. Run your original animation and cleanup logic
                                setIsOpen(false);
                                setTimeout(() => {
                                    if(onClose) onClose();
                                    setPreviewUrl(null);
                                }, 400);}}>
                                <div className="text-center mb-2 sm:mb-6 w-full shrink-0">
                                    <h2 className="text-4xl sm:text-5xl font-caveat font-bold text-white drop-shadow-lg">{mealToEdit ? "Edit Memory" : "New Memory"}</h2>
                                </div>
                                
                                <motion.div 
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white p-2 sm:p-4 shadow-2xl border border-slate-200 relative group w-full shrink min-h-[20vh] max-h-[40vh] sm:max-h-none flex flex-col justify-center"
                                >
                                    {/* Image Upload Area mimicking a silhouette / plate */}
                                    <div className={`w-full aspect-[3/4] sm:aspect-square relative flex flex-col items-center justify-center overflow-hidden transition-colors cursor-pointer flex-1 ${!previewUrl ? 'bg-slate-100 border-2 border-dashed border-slate-300 group-hover:bg-slate-50' : 'bg-black'}`}>
                                        <input 
                                            type="file" 
                                            name="image" 
                                            id="image" 
                                            accept="image/*" 
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setPreviewUrl(URL.createObjectURL(file));
                                                }
                                            }}
                                        />
                                        
                                        {previewUrl ? (
                                            <img 
                                                src={previewUrl} 
                                                className="w-full h-full object-cover filter brightness-105 contrast-110 saturate-75 sepia-[0.15] transition-all duration-500 ease-out z-10 relative" 
                                                alt="Meal preview" 
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 sm:gap-4 scale-75 sm:scale-100">
                                                {/* Plate Silhouette */}
                                                <motion.div 
                                                    animate={{ scale: [1, 1.05, 1] }}
                                                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                                    className="w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-slate-200 flex items-center justify-center bg-white shadow-inner relative z-10"
                                                >
                                                    <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full border border-slate-100 flex items-center justify-center">
                                                    </div>
                                                </motion.div>

                                                {/* Add Image Button below silhouette */}
                                                <motion.div 
                                                    whileHover={{ scale: 1.05, rotate: -2 }}
                                                    className="bg-yellow-200 text-slate-800 px-4 py-2 mt-2 shadow-lg border border-black/5 flex items-center gap-2 font-caveat font-bold rotate-3 transition-colors z-10 relative text-xl sm:text-2xl cursor-pointer"
                                                >
                                                    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                                                    <span>Add Image</span>
                                                </motion.div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                                
                                {/* Inputs as post-its */}
                                <div className="w-full grid grid-cols-2 gap-3 sm:gap-6 px-1 sm:px-2 mt-2 sm:mt-4 relative z-20 shrink-0">
                                    {/* Name Post-it */}
                                    <div 
                                        className={`transform ${styles[0]?.color || 'bg-yellow-100'} p-3 sm:p-4 shadow-xl hover:shadow-2xl border border-black/10 flex flex-col -mt-8 sm:-mt-16 transition-all hover:-translate-y-2 hover:scale-[1.02] hover:z-30 focus-within:-translate-y-2 focus-within:scale-[1.02] focus-within:z-30 relative`}
                                        style={{ '--tw-rotate': `${styles[0]?.rotation || -1}deg` } as React.CSSProperties}
                                    >
                                        <label htmlFor="name" className="font-caveat font-bold text-xl sm:text-2xl text-slate-800 mb-1">Meal Name <span className="text-red-500">*</span></label>
                                        <input type="text" name="name" id="name" required className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-caveat text-lg sm:text-xl placeholder-slate-400" placeholder="E.g. Sunday Brunch" defaultValue={mealToEdit?.name || ""} />
                                    </div>

                                    {/* Macros Post-it */}
                                    <div 
                                        className={`transform ${styles[1]?.color || 'bg-pink-100'} p-3 sm:p-4 shadow-xl hover:shadow-2xl border border-black/10 grid grid-cols-2 gap-1 sm:gap-2 -mt-4 sm:-mt-8 transition-all hover:-translate-y-2 hover:scale-[1.02] hover:z-30 focus-within:-translate-y-2 focus-within:scale-[1.02] focus-within:z-30 relative`}
                                        style={{ '--tw-rotate': `${styles[1]?.rotation || 1}deg` } as React.CSSProperties}
                                    >
                                        <div className="flex flex-col">
                                            <label htmlFor="calories" className="font-caveat font-bold text-base sm:text-lg text-slate-800">Cals <span className="text-red-500">*</span></label>
                                            <input type="number" name="calories" id="calories" required className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-sans text-xs sm:text-sm" defaultValue={mealToEdit?.calories || ""} />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="protein" className="font-caveat font-bold text-base sm:text-lg text-slate-800">Pro (g)</label>
                                            <input type="number" name="protein" id="protein" className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-sans text-xs sm:text-sm" defaultValue={mealToEdit?.protein || ""} />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="carbs" className="font-caveat font-bold text-base sm:text-lg text-slate-800">Carb (g)</label>
                                            <input type="number" name="carbs" id="carbs" className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-sans text-xs sm:text-sm" defaultValue={mealToEdit?.carbs || ""} />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="fat" className="font-caveat font-bold text-base sm:text-lg text-slate-800">Fat (g)</label>
                                            <input type="number" name="fat" id="fat" className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-sans text-xs sm:text-sm" defaultValue={mealToEdit?.fat || ""} />
                                        </div>
                                    </div>
                                    
                                    {/* Notes Post-it */}
                                    <div 
                                        className={`transform ${styles[2]?.color || 'bg-blue-100'} p-3 sm:p-4 shadow-xl hover:shadow-2xl border border-black/10 col-span-2 -mt-2 sm:-mt-4 transition-all hover:-translate-y-2 hover:scale-[1.02] hover:z-30 focus-within:-translate-y-2 focus-within:scale-[1.02] focus-within:z-30 relative`}
                                        style={{ '--tw-rotate': `${styles[2]?.rotation || 0.5}deg` } as React.CSSProperties}
                                    >
                                        <label htmlFor="note" className="font-caveat font-bold text-xl sm:text-2xl text-slate-800 mb-1 block">Notes</label>
                                        <textarea name="note" id="note" rows={2} placeholder="How was it?" className="w-full bg-transparent border-b border-slate-400 focus:outline-none focus:border-slate-800 font-caveat text-xl sm:text-2xl resize-none" defaultValue={mealToEdit?.note || ""}></textarea>
                                    </div>
                                </div>

                                <div className="text-center mt-4 sm:mt-8 w-full relative z-30 shrink-0">
                                        <button 
                                        type="submit" 
                                        className="py-2.5 sm:py-3 px-6 sm:px-8 bg-slate-800 text-white font-bold rounded-lg shadow-xl font-sans tracking-widest uppercase text-sm sm:text-base hover:scale-105 active:scale-95 transition-transform"
                                    >
                                        {mealToEdit ? "Update Memory" : "Develop Photo"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}