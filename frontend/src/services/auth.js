import axios from 'axios';
import apiClient from '../api/client';

// Service pour l'inscription initiale (sans token)
const publicClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/${import.meta.env.VITE_API_VERSION}`,
  timeout: 10000, // 10 secondes
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour gérer les erreurs réseau
publicClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      error.code = 'NETWORK_ERROR';
      error.message = 'Timeout de connexion';
    } else if (!error.response) {
      error.code = 'NETWORK_ERROR';
      error.message = 'Erreur de réseau';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  },
  
  // Inscription d'une nouvelle entreprise (employeur)
  async register(companyData) {
    const response = await publicClient.post('/auth/register', {
      company_name: companyData.companyName,
      company_email: companyData.companyEmail,
      industry: companyData.industry,
      company_size: companyData.companySize,
      admin_first_name: companyData.adminFirstName,
      admin_last_name: companyData.adminLastName,
      admin_email: companyData.adminEmail,
      admin_password: companyData.adminPassword
    });
    return response.data;
  },
  
  // Invitation d'utilisateurs par email
  async inviteUser(userData) {
    const response = await apiClient.post('/auth/invite', userData);
    return response.data;
  },
  
  // Accepter une invitation
  async acceptInvitation(token, password) {
    const response = await publicClient.post('/auth/accept-invitation', {
      token,
      password
    });
    return response.data;
  },
  
  // Réinitialisation de mot de passe
  async resetPassword(email) {
    const response = await publicClient.post('/auth/reset-password', { email });
    return response.data;
  },
  
  async confirmResetPassword(token, newPassword) {
    const response = await publicClient.post('/auth/confirm-reset', {
      token,
      new_password: newPassword
    });
    return response.data;
  },
  
  logout() {
    localStorage.removeItem('access_token');
  },
  
  async getCurrentUser() {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
  
  isAuthenticated() {
    return !!localStorage.getItem('access_token');
  }
};