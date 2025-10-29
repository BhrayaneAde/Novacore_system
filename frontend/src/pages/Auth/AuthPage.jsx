import { useState } from 'react';
import { Mail, Lock, Building2, Check, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import ThemeProvider from '../../components/ThemeProvider';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '', remember: false });
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: '',
    terms: false
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!loginData.email || !loginData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    const result = await login(loginData.email, loginData.password);
    
    if (result.success) {
      navigate('/app/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!registerData.firstName || !registerData.lastName || !registerData.company || !registerData.email || !registerData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    if (!registerData.terms) {
      setError('Veuillez accepter les conditions d\'utilisation');
      return;
    }

    console.log('Données d\'inscription:', registerData);
    navigate('/login?registered=true');
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div>
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="flex items-center space-x-2">
              <img src="/src/assets/NovaCoreR.png" alt="NovaCore" className="h-10" />
            </div>
          </div>
          
          <div className="space-y-8">
            <h1 className="text-5xl font-semibold text-white tracking-tight leading-tight">
              Gérez vos ressources<br/>humaines efficacement
            </h1>
            <p className="text-slate-300 text-lg leading-relaxed max-w-md">
              Une plateforme complète pour la gestion des employés, des congés, de la paie et bien plus encore.
            </p>
            
            <div className="space-y-4 pt-8">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-secondary-600/20 flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Gestion des employés</h3>
                  <p className="text-slate-400 text-sm">Centralisez toutes les informations de vos collaborateurs</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-secondary-600/20 flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Suivi des présences</h3>
                  <p className="text-slate-400 text-sm">Automatisez la gestion des congés et absences</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-secondary-600/20 flex items-center justify-center mt-1">
                  <Check className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Gestion de la paie</h3>
                  <p className="text-slate-400 text-sm">Simplifiez vos processus de rémunération</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-slate-400 text-sm">
            © 2025 NovaCore. Tous droits réservés.
          </div>
        </div>
      </div>

      {/* Right Side - Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <img src="/src/assets/NovaCoreR.png" alt="NovaCore" className="h-10" />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 bg-slate-200 rounded-lg p-1 mb-8">
            <button 
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'login' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Connexion
            </button>
            <button 
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'register' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Inscription
            </button>
          </div>

          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Bon retour parmi nous</h2>
                <p className="text-slate-600 mt-1">Connectez-vous à votre compte</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="vous@exemple.com" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 border-slate-300 rounded text-secondary-600 focus:ring-2 focus:ring-blue-600"
                      checked={loginData.remember}
                      onChange={(e) => setLoginData({...loginData, remember: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-slate-600">Se souvenir de moi</span>
                  </label>
                  <Link to="#" className="text-sm font-medium text-secondary-600 hover:text-secondary-700">Mot de passe oublié?</Link>
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-secondary-600 text-white py-2.5 rounded-lg font-medium hover:bg-secondary-700 transition-all shadow-sm hover:shadow flex items-center justify-center space-x-2"
                >
                  <span>{isLoading ? 'Connexion...' : 'Se connecter'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-50 text-slate-500">Ou continuer avec</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center space-x-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-slate-700">Google</span>
                </button>
                <button className="flex items-center justify-center space-x-2 py-2.5 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
                  <svg className="w-5 h-5" fill="#0078D4" viewBox="0 0 24 24">
                    <path d="M0 0v11.408h11.408V0zm12.594 0v11.408H24V0zM0 12.594V24h11.408V12.594zm12.594 0V24H24V12.594z"/>
                  </svg>
                  <span className="text-sm font-medium text-slate-700">Microsoft</span>
                </button>
              </div>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">Créer un compte</h2>
                <p className="text-slate-600 mt-1">Commencez votre essai gratuit de 14 jours</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Prénom</label>
                    <input 
                      type="text" 
                      placeholder="Jean" 
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({...registerData, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom</label>
                    <input 
                      type="text" 
                      placeholder="Dupont" 
                      className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({...registerData, lastName: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Entreprise</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building2 className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="Nom de votre entreprise" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      value={registerData.company}
                      onChange={(e) => setRegisterData({...registerData, company: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Adresse email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                      type="email" 
                      placeholder="vous@entreprise.com" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="w-5 h-5 text-slate-400" />
                    </div>
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Minimum 8 caractères avec majuscules et chiffres</p>
                </div>

                <div>
                  <label className="flex items-start">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 border-slate-300 rounded text-secondary-600 focus:ring-2 focus:ring-blue-600 mt-0.5"
                      checked={registerData.terms}
                      onChange={(e) => setRegisterData({...registerData, terms: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-slate-600">
                      J'accepte les <Link to="#" className="text-secondary-600 hover:text-secondary-700 font-medium">conditions d'utilisation</Link> et la <Link to="#" className="text-secondary-600 hover:text-secondary-700 font-medium">politique de confidentialité</Link>
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-secondary-600 text-white py-2.5 rounded-lg font-medium hover:bg-secondary-700 transition-all shadow-sm hover:shadow flex items-center justify-center space-x-2"
                >
                  <span>Créer mon compte</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-center text-sm text-slate-600">
                  Déjà un compte? 
                  <button 
                    type="button" 
                    onClick={() => setActiveTab('login')}
                    className="text-secondary-600 hover:text-secondary-700 font-medium ml-1"
                  >
                    Se connecter
                  </button>
                </p>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
    </ThemeProvider>
  );
};

export default AuthPage;