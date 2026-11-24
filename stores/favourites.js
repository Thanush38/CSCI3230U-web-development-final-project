import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFavouriteStore = create(
    persist(
        (set) => ({
            saved: [],

            toggle: (exercise) => 
                set((state) => ({
                    saved: state.saved.some((e) => e.id === exercise.id) 
                           ? state.saved.filter((e) => e.id !== exercise.id)
                           : [...state.saved, exercise],
                })),
            
            remove: (id) =>
                set((state) => ({
                    saved: state.saved.filter((e) => e.id !== id)
                })),

            clear: () => set({ saved: [] }),
        }),
        { name: 'exercises:favourites'},
    ),
);

// hack to experiment in the console
window.useFavouriteStore = useFavouriteStore;

export const useIsFavourite = (id) => useFavouriteStore((state) => state.saved.some((e) => e.id === id));

export const useFavouriteCount = () => useFavouriteStore((state) => state.saved.length);