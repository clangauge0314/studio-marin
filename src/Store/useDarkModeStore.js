import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useDarkModeStore = create(
  persist(
    (set) => ({
      dark: false,
      setDark: (isDark) => set({ dark: isDark }),
      toggleDark: () => set((state) => ({ dark: !state.dark })),
    }),
    {
      name: 'dark-mode-storage', 
    }
  )
)

export default useDarkModeStore
