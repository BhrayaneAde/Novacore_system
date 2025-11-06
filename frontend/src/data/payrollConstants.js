export const COMPANY_TYPES = {
  PME: { label: 'PME', description: 'Petite et Moyenne Entreprise', icon: '🏢' },
  GRANDE_ENTREPRISE: { label: 'Grande Entreprise', description: 'Plus de 250 employés', icon: '🏭' },
  SECTEUR_PUBLIC: { label: 'Secteur Public', description: 'Administration publique', icon: '🏛️' },
  ONG: { label: 'ONG', description: 'Organisation Non Gouvernementale', icon: '🤝' },
  BTP_INDUSTRIE: { label: 'BTP/Industrie', description: 'Bâtiment et Travaux Publics', icon: '🏗️' },
  BANQUE_ASSURANCE: { label: 'Banque/Assurance', description: 'Services financiers', icon: '🏦' }
};

export const VARIABLE_TYPES = {
  FIXE: 'FIXE',
  PRIME: 'PRIME',
  INDEMNITE: 'INDEMNITE',
  RETENUE: 'RETENUE',
  COTISATION: 'COTISATION',
  IMPOT: 'IMPOT'
};

export const CALCULATION_METHODS = {
  FIXED: 'fixed',
  PERCENTAGE: 'percentage',
  FORMULA: 'formula',
  PROGRESSIVE: 'progressive'
};

export const PAYROLL_STATUS = {
  DRAFT: 'draft',
  CALCULATED: 'calculated',
  VALIDATED: 'validated',
  PAID: 'paid'
};

export const VARIABLE_TYPE_LABELS = {
  [VARIABLE_TYPES.FIXE]: 'Salaire fixe',
  [VARIABLE_TYPES.PRIME]: 'Prime',
  [VARIABLE_TYPES.INDEMNITE]: 'Indemnité',
  [VARIABLE_TYPES.RETENUE]: 'Retenue',
  [VARIABLE_TYPES.COTISATION]: 'Cotisation',
  [VARIABLE_TYPES.IMPOT]: 'Impôt'
};

export const VARIABLE_TYPE_COLORS = {
  [VARIABLE_TYPES.FIXE]: 'bg-gradient-to-r from-blue-50 to-teal-50 text-teal-800 border border-teal-200',
  [VARIABLE_TYPES.PRIME]: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-800 border border-amber-200',
  [VARIABLE_TYPES.INDEMNITE]: 'bg-gradient-to-r from-purple-50 to-indigo-50 text-purple-800 border border-purple-200',
  [VARIABLE_TYPES.RETENUE]: 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200',
  [VARIABLE_TYPES.COTISATION]: 'bg-gradient-to-r from-orange-50 to-amber-50 text-orange-800 border border-orange-200',
  [VARIABLE_TYPES.IMPOT]: 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 border border-slate-200'
};

export const CALCULATION_METHOD_LABELS = {
  [CALCULATION_METHODS.FIXED]: 'Montant fixe',
  [CALCULATION_METHODS.PERCENTAGE]: 'Pourcentage',
  [CALCULATION_METHODS.FORMULA]: 'Formule',
  [CALCULATION_METHODS.PROGRESSIVE]: 'Barème progressif'
};

export const DEFAULT_PERIODS = [
  { value: '2024-01', label: 'Janvier 2024' },
  { value: '2024-02', label: 'Février 2024' },
  { value: '2024-03', label: 'Mars 2024' },
  { value: '2024-04', label: 'Avril 2024' },
  { value: '2024-05', label: 'Mai 2024' },
  { value: '2024-06', label: 'Juin 2024' },
  { value: '2024-07', label: 'Juillet 2024' },
  { value: '2024-08', label: 'Août 2024' },
  { value: '2024-09', label: 'Septembre 2024' },
  { value: '2024-10', label: 'Octobre 2024' },
  { value: '2024-11', label: 'Novembre 2024' },
  { value: '2024-12', label: 'Décembre 2024' }
];

export const PERMISSIONS = {
  PAYROLL_CONFIG: 'payroll_config',
  PAYROLL_CALCULATE: 'payroll_calculate',
  PAYROLL_VALIDATE: 'payroll_validate',
  PAYROLL_VIEW: 'payroll_view'
};

export const USER_ROLES = {
  EMPLOYER: 'employer',
  HR_ADMIN: 'hr_admin',
  HR_USER: 'hr_user',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.EMPLOYER]: [
    PERMISSIONS.PAYROLL_CONFIG,
    PERMISSIONS.PAYROLL_CALCULATE,
    PERMISSIONS.PAYROLL_VALIDATE,
    PERMISSIONS.PAYROLL_VIEW
  ],
  [USER_ROLES.HR_ADMIN]: [
    PERMISSIONS.PAYROLL_CONFIG,
    PERMISSIONS.PAYROLL_CALCULATE,
    PERMISSIONS.PAYROLL_VALIDATE,
    PERMISSIONS.PAYROLL_VIEW
  ],
  [USER_ROLES.HR_USER]: [
    PERMISSIONS.PAYROLL_CALCULATE,
    PERMISSIONS.PAYROLL_VIEW
  ],
  [USER_ROLES.MANAGER]: [
    PERMISSIONS.PAYROLL_VIEW
  ],
  [USER_ROLES.EMPLOYEE]: [
    PERMISSIONS.PAYROLL_VIEW
  ]
};