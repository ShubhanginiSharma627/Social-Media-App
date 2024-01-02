import create from 'zustand'
import { persist } from 'zustand/middleware'

type UserState = {
    user: { id:string,username: string; email: string; picture: string } | null;
    setUser: (user: { id:string, username: string; email: string; picture: string }) => void;
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
