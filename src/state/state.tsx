import create from 'zustand'
import { persist } from 'zustand/middleware'
type BearStore = {
  isUserValid: boolean; // Type for isUserValid
  setIsUserValid: (isValid: boolean) => void; // Type for setIsUserValid action
};
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