import create from 'zustand'
import { persist } from 'zustand/middleware'

type UserState = {
    user: { username: string; email: string; image: string } | null;
    setUser: (user: { username: string; email: string; image: string }) => void;
    clearUser: () => void;
  }

  const useUserStore = create<UserState>(persist(
    (set) => ({
      user: null, // Initially no user is logged in
      setUser: (user: any) => set({ user }), // Now user includes an image
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // unique name for your user storage
      getStorage: () => localStorage, // by default, 'localStorage' is used
    }
  ) as any);

export default useUserStore;
