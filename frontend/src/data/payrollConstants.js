export const COMPANY_TYPES = {
  PME: 'PME',
  GRANDE_ENTREPRISE: 'Grande Entreprise',
  SECTEUR_PUBLIC: 'Secteur Public',
  ONG: 'ONG',
  BTP_INDUSTRIE: 'BTP/Industrie',
  BANQUE_ASSURANCE: 'Banque/Assurance'
};

export const VARIABLE_TYPES = {
  FIXE: 'fixe',
  PRIME: 'prime',
  INDEMNITE: 'indemnite',
  RETENUE: 'retenue',
  COTISATION: 'cotisation',
  IMPOT: 'impot'
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
  [VARIABLE_TYPES.FIXE]: 'bg-blue-100 text-blue-800',
  [VARIABLE_TYPES.PRIME]: 'bg-green-100 text-green-800',
  [VARIABLE_TYPES.INDEMNITE]: 'bg-purple-100 text-purple-800',
  [VARIABLE_TYPES.RETENUE]: 'bg-red-100 text-red-800',
  [VARIABLE_TYPES.COTISATION]: 'bg-orange-100 text-orange-800',
  [VARIABLE_TYPES.IMPOT]: 'bg-gray-100 text-gray-800'
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