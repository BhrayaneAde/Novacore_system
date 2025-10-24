import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHRStore } from "../../store/useHRStore";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { ArrowLeft, Save, Upload } from "lucide-react";

const EmployeeCreate = () => {
  const navigate = useNavigate();
  const { addEmployee, employees } = useHRStore();
  
  const [formData, setFormData] = useState({
    // Informations professionnelles
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    salary: "",
    hireDate: new Date().toISOString().split("T")[0],
    
    // Informations personnelles
    birthDate: "",
    address: "",
    city: "",
    postalCode: "",
    socialSecurityNumber: "",
    iban: "",
    emergencyContact: "",
    emergencyPhone: "",
    maritalStatus: "",
  });
  
  const [errors, setErrors] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    
    // Validation champs requis
    if (!formData.name?.trim()) {
      newErrors.name = "Le nom est requis";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "L'email est requis";
    } else {
      // Validation email unique
      if (employees.some(emp => emp.email === formData.email)) {
        newErrors.email = "Cet email est déjà utilisé";
      }
      
      // Validation email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Format d'email invalide";
      }
    }
    
    if (!formData.role?.trim()) {
      newErrors.role = "Le poste est requis";
    }
    
    if (!formData.department) {
      newErrors.department = "Le département est requis";
    }
    
    if (!formData.salary) {
      newErrors.salary = "Le salaire est requis";
    } else if (isNaN(formData.salary) || formData.salary < 0) {
      newErrors.salary = "Le salaire doit être un nombre positif";
    }
    
    if (!formData.hireDate) {
      newErrors.hireDate = "La date d'embauche est requise";
    }
    
    // Validation téléphone
    const phoneRegex = /^\+?[0-9\s-]{10,}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Format de téléphone invalide";
    }
    
    // Validation code postal
    if (formData.postalCode && !/^[0-9]{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = "Le code postal doit contenir 5 chiffres";
    }
    
    // Validation numéro sécu
    if (formData.socialSecurityNumber && !/^[0-9\s]{15,}$/.test(formData.socialSecurityNumber)) {
      newErrors.socialSecurityNumber = "Format de numéro de sécurité sociale invalide";
    }
    
    // Validation IBAN
    if (formData.iban && !/^[A-Z]{2}[0-9]{2}[A-Z0-9\s]{4,}$/.test(formData.iban.replace(/\s/g, ''))) {
      newErrors.iban = "Format IBAN invalide";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    addEmployee({
      ...formData,
      salary: parseFloat(formData.salary),
      status: "active",
      avatar: avatarPreview || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    });
    navigate("/app/employees");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" icon={ArrowLeft} onClick={() => navigate("/app/employees")}>
            Retour
          </Button>
          <h1 className="text-3xl font-semibold tracking-tight">Nouvel employé</h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Photo de profil */}
          <Card title="Photo de profil">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Aperçu" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-sm">Aucune photo</span>
                )}
              </div>
              <div>
                <input
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  icon={Upload}
                  onClick={() => document.getElementById('avatar').click()}
                >
                  Choisir une photo
                </Button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG max 2MB</p>
              </div>
            </div>
          </Card>
          
          {/* Informations professionnelles */}
          <Card title="Informations professionnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Jean Dupont"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="jean.dupont@novacore.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Poste *
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.role ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Développeur Full Stack"
                />
                {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Département *
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.department ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner un département</option>
                  <option value="Développement">Développement</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Ventes">Ventes</option>
                  <option value="Support">Support</option>
                  <option value="Ressources Humaines">Ressources Humaines</option>
                </select>
                {errors.department && <p className="text-red-500 text-xs mt-1">{errors.department}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="+33 6 12 34 56 78"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salaire annuel (€) *
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.salary ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="50000"
                />
                {errors.salary && <p className="text-red-500 text-xs mt-1">{errors.salary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'embauche *
                </label>
                <input
                  type="date"
                  name="hireDate"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.hireDate ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.hireDate && <p className="text-red-500 text-xs mt-1">{errors.hireDate}</p>}
              </div>
            </div>
          </Card>
          
          {/* Informations personnelles */}
          <Card title="Informations personnelles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de naissance
                </label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Situation familiale
                </label>
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner</option>
                  <option value="single">Célibataire</option>
                  <option value="married">Marié(e)</option>
                  <option value="divorced">Divorcé(e)</option>
                  <option value="widowed">Veuf/Veuve</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123 Rue de la Paix"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Paris"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code postal
                </label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.postalCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="75001"
                />
                {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de sécurité sociale
                </label>
                <input
                  type="text"
                  name="socialSecurityNumber"
                  value={formData.socialSecurityNumber}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.socialSecurityNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="1 90 03 75 001 123 45"
                />
                {errors.socialSecurityNumber && <p className="text-red-500 text-xs mt-1">{errors.socialSecurityNumber}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IBAN
                </label>
                <input
                  type="text"
                  name="iban"
                  value={formData.iban}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.iban ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                />
                {errors.iban && <p className="text-red-500 text-xs mt-1">{errors.iban}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact d'urgence
                </label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Marie Dupont"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone d'urgence
                </label>
                <input
                  type="tel"
                  name="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+33 6 98 76 54 32"
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/app/employees")} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" icon={Save} className="flex-1" disabled={loading}>
              {loading ? 'Création...' : 'Créer l\'employé'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeCreate;
