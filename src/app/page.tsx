import { getMeals } from "../actions/mealActions";
import MealList from "../components/MealList";
import MealForm from "../components/MealForm";

export default async function HomePage() {
  const meals = await getMeals();

  return (
    <>
      <nav className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#fdfcf8]/80 border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Memoreat
          </h1>
          <p className="text-sm font-medium text-slate-500">My Food Scrapbook</p>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto p-6 md:p-12 space-y-12 w-full pb-32">
        <div className="w-full">
          <MealList meals={meals} />
        </div>
      </main>

      <MealForm />
    </>
  )
}
