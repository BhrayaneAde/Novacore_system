import { create } from 'zustand';
import { appearanceConfig } from '../data/mockData';

// Valeurs par défaut au cas où appearanceConfig serait undefined
const defaultConfig = {
  darkMode: false,
  branding: {
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    companyName: 'TechCorp'
  },
  logo: {
    url: ''
  },
  theme: {
    fontFamily: 'Inter'
  }
};

const config = appearanceConfig || defaultConfig;

export const useThemeStore = create((set) => ({
  darkMode: config.darkMode || false,
  primaryColor: config.branding?.primaryColor || '#3B82F6',
  secondaryColor: config.branding?.secondaryColor || '#1E40AF',
  companyName: config.branding?.companyName || 'TechCorp',
  logoUrl: config.logo?.url || '',
  fontFamily: config.theme?.fontFamily || 'Inter',
  
  setDarkMode: (darkMode) => set({ darkMode }),
  setPrimaryColor: (primaryColor) => set({ primaryColor }),
  setSecondaryColor: (secondaryColor) => set({ secondaryColor }),
  setCompanyName: (companyName) => set({ companyName }),
  setLogoUrl: (logoUrl) => set({ logoUrl }),
  setFontFamily: (fontFamily) => set({ fontFamily }),
  
  updateTheme: (theme) => set(theme),
}));