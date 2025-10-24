import { create } from 'zustand';
import { setupService } from '../services';

// Valeurs par défaut
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

export const useThemeStore = create((set, get) => ({
  darkMode: defaultConfig.darkMode,
  primaryColor: defaultConfig.branding.primaryColor,
  secondaryColor: defaultConfig.branding.secondaryColor,
  companyName: defaultConfig.branding.companyName,
  logoUrl: defaultConfig.logo.url,
  fontFamily: defaultConfig.theme.fontFamily,
  isLoading: false,
  
  // Charger la configuration depuis l'API
  loadConfig: async () => {
    set({ isLoading: true });
    try {
      const config = await setupService.appearance.get();
      set({
        darkMode: config.darkMode || defaultConfig.darkMode,
        primaryColor: config.branding?.primaryColor || defaultConfig.branding.primaryColor,
        secondaryColor: config.branding?.secondaryColor || defaultConfig.branding.secondaryColor,
        companyName: config.branding?.companyName || defaultConfig.branding.companyName,
        logoUrl: config.logo?.url || defaultConfig.logo.url,
        fontFamily: config.theme?.fontFamily || defaultConfig.theme.fontFamily,
        isLoading: false
      });
    } catch (error) {
      console.error('Erreur lors du chargement de la configuration:', error);
      set({ isLoading: false });
    }
  },
  
  setDarkMode: async (darkMode) => {
    set({ darkMode });
    try {
      await setupService.appearance.update({ darkMode });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },
  
  setPrimaryColor: async (primaryColor) => {
    set({ primaryColor });
    try {
      await setupService.appearance.update({ branding: { ...get().branding, primaryColor } });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },
  
  setSecondaryColor: async (secondaryColor) => {
    set({ secondaryColor });
    try {
      await setupService.appearance.update({ branding: { ...get().branding, secondaryColor } });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },
  
  setCompanyName: async (companyName) => {
    set({ companyName });
    try {
      await setupService.appearance.update({ branding: { ...get().branding, companyName } });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },
  
  setLogoUrl: async (logoUrl) => {
    set({ logoUrl });
    try {
      await setupService.appearance.update({ logo: { url: logoUrl } });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },
  
  setFontFamily: async (fontFamily) => {
    set({ fontFamily });
    try {
      await setupService.appearance.update({ theme: { fontFamily } });
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },
  
  updateTheme: async (theme) => {
    set(theme);
    try {
      await setupService.appearance.update(theme);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  },
}));