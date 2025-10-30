import { useState } from 'react';
import Loader from '../../components/ui/Loader';
import { Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { authService } from '../../services';
import Toast from '../../components/ui/Toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await authService.resetPassword(email);
      
      if (response.success) {
        setToast({
          show: true,
          type: 'success',
          message: `✓ ${response.message}. Vérifiez votre boîte de réception et vos spams.`
        });
      } else {
        setToast({
          show: true,
          type: 'error',
          message: `⚠ ${response.message}. Vérifiez l'adresse saisie.`
        });
      }
    } catch (error) {
      console.error('Erreur reset:', error);
      setToast({
        show: true,
        type: 'error',
        message: '❌ Erreur de connexion. Vérifiez votre connexion internet.'
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{background: 'linear-gradient(135deg, #dbeafe 0%, #ffffff 50%, #fef3c7 100%)'}}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg" style={{background: 'linear-gradient(135deg, #f59e0b 0%, #055169 100%)'}}>
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">NovaCore</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Mot de passe oublié</h2>
          <p className="text-gray-600">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <Toast
            isVisible={toast.show}
            type={toast.type}
            message={toast.message}
            onClose={() => setToast({ show: false, type: '', message: '' })}
          />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={loading}
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              style={{background: 'linear-gradient(135deg, #f59e0b 0%, #055169 100%)'}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader size={20} className="mr-2" />
                  Envoi en cours...
                </div>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 font-medium transition-colors"
              style={{color: '#055169'}}
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;