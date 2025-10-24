import { useState } from 'react';
import { authService, usersService, tasksService } from '../services';

export default function TestConnection() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await authService.login('admin@techcorp.com', 'NovaCore123');
      setResult('✅ Connexion réussie: ' + JSON.stringify(response, null, 2));
    } catch (error) {
      setResult('❌ Erreur login: ' + error.message);
    }
    setLoading(false);
  };

  const testAPI = async () => {
    setLoading(true);
    try {
      const users = await usersService.getAll();
      setResult('✅ API Users: ' + JSON.stringify(users.data, null, 2));
    } catch (error) {
      setResult('❌ Erreur API: ' + error.message);
    }
    setLoading(false);
  };

  const testCurrentUser = async () => {
    setLoading(true);
    try {
      const user = await authService.getCurrentUser();
      setResult('✅ Utilisateur actuel: ' + JSON.stringify(user, null, 2));
    } catch (error) {
      setResult('❌ Erreur utilisateur: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Test de Connexion Backend</h2>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testLogin}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Test...' : 'Tester Login'}
        </button>
        
        <button 
          onClick={testCurrentUser}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 ml-2"
        >
          {loading ? 'Test...' : 'Utilisateur Actuel'}
        </button>
        
        <button 
          onClick={testAPI}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 ml-2"
        >
          {loading ? 'Test...' : 'Tester API Users'}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h3 className="font-semibold mb-2">Résultat:</h3>
        <pre className="whitespace-pre-wrap text-sm overflow-auto max-h-96">
          {result || 'Aucun test effectué'}
        </pre>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Comptes de test disponibles:</strong></p>
        <ul className="list-disc ml-6">
          <li>admin@techcorp.com / NovaCore123 (employer)</li>
          <li>hr@techcorp.com / NovaCore123 (hr_admin)</li>
          <li>manager@techcorp.com / NovaCore123 (manager)</li>
          <li>employee@techcorp.com / NovaCore123 (employee)</li>
        </ul>
      </div>
    </div>
  );
}