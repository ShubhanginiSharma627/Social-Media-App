import create from 'zustand'
import { persist } from 'zustand/middleware'

const useBearStore = create(persist(
  (set) => ({
    isUserValid: false, // default state
    setIsUserValid: (isValid: any) => set({ isUserValid: isValid })
  }),
  {
    name: 'user-auth', // unique name for localStorage key
    getStorage: () => localStorage, // specify localStorage as the storage
  }
))

export default useBearStore;