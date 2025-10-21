import { create } from 'zustand';
import { appearanceConfig } from '../data/mockData';

export const useThemeStore = create((set) => ({
  darkMode: appearanceConfig.darkMode,
  primaryColor: appearanceConfig.branding.primaryColor,
  secondaryColor: appearanceConfig.branding.secondaryColor,
  companyName: appearanceConfig.branding.companyName,
  logoUrl: appearanceConfig.logo.url,
  fontFamily: appearanceConfig.theme.fontFamily,
  
  setDarkMode: (darkMode) => set({ darkMode }),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  setSecondaryColor: (secondaryColor) => set({ secondaryColor }),
  setCompanyName: (companyName) => set({ companyName }),
  setLogoUrl: (logoUrl) => set({ logoUrl }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  
  updateTheme: (theme) => set(theme),
}));