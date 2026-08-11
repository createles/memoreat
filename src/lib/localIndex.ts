const STORAGE_KEY = "my_memoreat_ids";

// Get the meal IDs from local storage. If we're on the server, return an empty array.
export function getMealIdsFromLocal(): number[] {
    if (typeof window === "undefined") { // Prevents errors during server-side rendering
        return [];
    }
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
        return JSON.parse(data);
    } else {
        // First time user, initialize the seed meals.
        const seedIds = [1, 2, 3, 4, 5, 6, 7, 8]; //
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedIds));
        return seedIds;
    }
}

// Save a meal ID to local storage. If we're on the server, do nothing.
export function saveMealToLocal(id: number): void {
    if (typeof window === "undefined") { // Prevents errors during server-side rendering
        return;
    }
    const existingIds = getMealIdsFromLocal();
    if (!existingIds.includes(id)) {
        existingIds.push(id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingIds));
    }
}

// Remove a meal ID from local storage. If we're on the server, do nothing.
export function removeMealFromLocal(id: number): void {
    if (typeof window === "undefined") { // Prevents errors during server-side rendering
        return;
    }
    const existingIds = getMealIdsFromLocal();
    const newIds = existingIds.filter(existingId => existingId !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds));
}