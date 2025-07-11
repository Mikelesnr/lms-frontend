import { create } from "zustand";

export const useLessonStore = create((set) => ({
  lessons: {}, // lesson_id: lesson object

  setLesson: (id, lesson) =>
    set((state) => ({
      lessons: { ...state.lessons, [id]: lesson },
    })),

  getLesson: (id) => get().lessons[id] || null, // fallback if not cached
}));
