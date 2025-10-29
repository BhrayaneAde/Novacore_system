import { useState } from 'react';
import { setupService, emailService } from '../services';

export default function CompanySetup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState({
    companyName: '',
    companyEmail: '',
    industry: '',
    companySize: '',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPassword: '',
    plan: 'basic'
  });
  
  const [inviteUsers, setInviteUsers] = useState([
    { email: '', firstName: '', lastName: '', role: 'employee', department: '' }
  ]);

  const handleSetupCompany = async () => {
    setLoading(true);
    try {
      const result = await setupService.setupCompany(companyData);
      console.log('✅ Entreprise créée:', result);
      setStep(2);
    } catch (error) {
      console.error('❌ Erreur setup:', error);
    }
    setLoading(false);
  };

  const handleInviteUsers = async () => {
    setLoading(true);
    try {
      const result = await setupService.bulkInviteUsers(inviteUsers);
      console.log('✅ Invitations envoyées:', result);
      setStep(3);
    } catch (error) {
      console.error('❌ Erreur invitations:', error);
    }
    setLoading(false);
  };

  const addUserInvite = () => {
    setInviteUsers([...inviteUsers, { 
      email: '', firstName: '', lastName: '', role: 'employee', department: '' 
    }]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Configuration NovaCore</h2>
      
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">1. Informations de l'entreprise</h3>
          
          <input
            type="text"
            placeholder="Nom de l'entreprise"
            value={companyData.companyName}
            onChange={(e) => setCompanyData({...companyData, companyName: e.target.value})}
            className="w-full p-3 border rounded"
          />
          
          <input
            type="email"
            placeholder="Email de l'entreprise"
            value={companyData.companyEmail}
            onChange={(e) => setCompanyData({...companyData, companyEmail: e.target.value})}
            className="w-full p-3 border rounded"
          />
          
          <select
            value={companyData.industry}
            onChange={(e) => setCompanyData({...companyData, industry: e.target.value})}
            className="w-full p-3 border rounded"
          >
            <option value="">Secteur d'activité</option>
            <option value="tech">Technologie</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Santé</option>
            <option value="retail">Commerce</option>
            <option value="other">Autre</option>
          </select>
          
          <h3 className="text-lg font-semibold mt-6">Administrateur principal</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Prénom"
              value={companyData.adminFirstName}
              onChange={(e) => setCompanyData({...companyData, adminFirstName: e.target.value})}
              className="p-3 border rounded"
            />
            <input
              type="text"
              placeholder="Nom"
              value={companyData.adminLastName}
              onChange={(e) => setCompanyData({...companyData, adminLastName: e.target.value})}
              className="p-3 border rounded"
            />
          </div>
          
          <input
            type="email"
            placeholder="Email administrateur"
            value={companyData.adminEmail}
            onChange={(e) => setCompanyData({...companyData, adminEmail: e.target.value})}
            className="w-full p-3 border rounded"
          />
          
          <input
            type="password"
            placeholder="Mot de passe"
            value={companyData.adminPassword}
            onChange={(e) => setCompanyData({...companyData, adminPassword: e.target.value})}
            className="w-full p-3 border rounded"
          />
          
          <button
            onClick={handleSetupCompany}
            disabled={loading}
            className="w-full bg-secondary-500 text-white p-3 rounded hover:bg-secondary-600 disabled:opacity-50"
          >
            {loading ? 'Configuration...' : 'Créer l\'entreprise'}
          </button>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">2. Inviter des utilisateurs</h3>
          <p className="text-gray-600">Invitez vos employés - ils recevront un email avec leurs accès</p>
          
          {inviteUsers.map((user, index) => (
            <div key={index} className="grid grid-cols-2 gap-2 p-4 border rounded">
              <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) => {
                  const updated = [...inviteUsers];
                  updated[index].email = e.target.value;
                  setInviteUsers(updated);
                }}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Prénom"
                value={user.firstName}
                onChange={(e) => {
                  const updated = [...inviteUsers];
                  updated[index].firstName = e.target.value;
                  setInviteUsers(updated);
                }}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nom"
                value={user.lastName}
                onChange={(e) => {
                  const updated = [...inviteUsers];
                  updated[index].lastName = e.target.value;
                  setInviteUsers(updated);
                }}
                className="p-2 border rounded"
              />
              <select
                value={user.role}
                onChange={(e) => {
                  const updated = [...inviteUsers];
                  updated[index].role = e.target.value;
                  setInviteUsers(updated);
                }}
                className="p-2 border rounded"
              >
                <option value="employee">Employé</option>
                <option value="manager">Manager</option>
                <option value="hr_admin">RH Admin</option>
              </select>
            </div>
          ))}
          
          <button
            onClick={addUserInvite}
            className="w-full bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            + Ajouter un utilisateur
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => setStep(3)}
              className="flex-1 bg-gray-300 text-gray-700 p-3 rounded"
            >
              Passer cette étape
            </button>
            <button
              onClick={handleInviteUsers}
              disabled={loading}
              className="flex-1 bg-green-500 text-white p-3 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer les invitations'}
            </button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="text-center space-y-4">
          <h3 className="text-lg font-semibold text-green-600">🎉 Configuration terminée !</h3>
          <p>Votre entreprise est maintenant configurée sur NovaCore.</p>
          <p className="text-sm text-gray-600">
            Les invitations ont été envoyées par email aux utilisateurs.
          </p>
          <button
            onClick={() => window.location.href = '/login'}
            className="bg-secondary-500 text-white px-6 py-3 rounded hover:bg-secondary-600"
          >
            Accéder à NovaCore
          </button>
        </div>
      )}
    </div>
  );
}