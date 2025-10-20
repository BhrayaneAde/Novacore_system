// 👥 Employés
export const employees = [
  {
    id: 1,
    name: "Sophie Martin",
    email: "sophie.martin@novacore.com",
    role: "Développeuse Full Stack",
    department: "Développement",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    hireDate: "2022-03-15",
    salary: 55000,
    phone: "+33 6 12 34 56 78",
    // Informations personnelles complètes
    birthDate: "1990-05-12",
    address: "45 Avenue des Champs-Élysées",
    city: "Paris",
    postalCode: "75008",
    socialSecurityNumber: "2 90 05 75 001 123 45",
    iban: "FR76 1234 5678 9012 3456 7890 123",
    emergencyContact: "Paul Martin",
    emergencyPhone: "+33 6 11 22 33 44",
    maritalStatus: "married",
    companyId: 1, // Appartient à TechCorp
    managerId: null, // Pas de manager
    documents: [
      { id: 1, name: "Contrat de travail", type: "contract", uploadDate: "2022-03-15", url: "/docs/contract_1.pdf" },
      { id: 2, name: "CV", type: "cv", uploadDate: "2022-03-10", url: "/docs/cv_1.pdf" }
    ]
  },
  {
    id: 2,
    name: "Thomas Dubois",
    email: "thomas.dubois@novacore.com",
    role: "Designer UI/UX",
    department: "Design",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    hireDate: "2021-06-20",
    salary: 48000,
    phone: "+33 6 23 45 67 89",
    birthDate: "1988-11-03",
    address: "12 Rue de Rivoli",
    city: "Lyon",
    postalCode: "69001",
    socialSecurityNumber: "1 88 11 69 001 234 56",
    iban: "FR76 2345 6789 0123 4567 8901 234",
    emergencyContact: "Claire Dubois",
    emergencyPhone: "+33 6 22 33 44 55",
    maritalStatus: "single",
    companyId: 1,
    managerId: 1, // Manager: Sophie Martin
    documents: [
      { id: 3, name: "Contrat de travail", type: "contract", uploadDate: "2021-06-20", url: "/docs/contract_2.pdf" }
    ]
  },
  {
    id: 3,
    name: "Emma Rousseau",
    email: "emma.rousseau@novacore.com",
    role: "Chef de Projet",
    department: "Marketing",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    hireDate: "2020-01-10",
    salary: 62000,
    phone: "+33 6 34 56 78 90",
    birthDate: "1985-08-22",
    address: "78 Boulevard Saint-Germain",
    city: "Paris",
    postalCode: "75006",
    socialSecurityNumber: "2 85 08 75 006 345 67",
    iban: "FR76 3456 7890 1234 5678 9012 345",
    emergencyContact: "Marc Rousseau",
    emergencyPhone: "+33 6 33 44 55 66",
    maritalStatus: "married",
    companyId: 1,
    managerId: null,
    documents: [
      { id: 4, name: "Contrat de travail", type: "contract", uploadDate: "2020-01-10", url: "/docs/contract_3.pdf" },
      { id: 5, name: "Diplôme Master", type: "diploma", uploadDate: "2020-01-08", url: "/docs/diploma_3.pdf" }
    ]
  },
  {
    id: 4,
    name: "Lucas Bernard",
    email: "lucas.bernard@novacore.com",
    role: "Développeur Backend",
    department: "Développement",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    hireDate: "2023-02-01",
    salary: 52000,
    phone: "+33 6 45 67 89 01",
    birthDate: "1992-12-15",
    address: "23 Rue de la République",
    city: "Marseille",
    postalCode: "13001",
    socialSecurityNumber: "1 92 12 13 001 456 78",
    iban: "FR76 4567 8901 2345 6789 0123 456",
    emergencyContact: "Julie Bernard",
    emergencyPhone: "+33 6 44 55 66 77",
    maritalStatus: "single",
    companyId: 1,
    managerId: 1, // Manager: Sophie Martin
    documents: [
      { id: 6, name: "Contrat de travail", type: "contract", uploadDate: "2023-02-01", url: "/docs/contract_4.pdf" }
    ]
  },
  {
    id: 5,
    name: "Marie Lefebvre",
    email: "marie.lefebvre@novacore.com",
    role: "Responsable RH",
    department: "Ressources Humaines",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop",
    hireDate: "2019-09-15",
    salary: 58000,
    phone: "+33 6 56 78 90 12",
    birthDate: "1983-04-07",
    address: "56 Avenue Montaigne",
    city: "Paris",
    postalCode: "75008",
    socialSecurityNumber: "2 83 04 75 008 567 89",
    iban: "FR76 5678 9012 3456 7890 1234 567",
    emergencyContact: "Pierre Lefebvre",
    emergencyPhone: "+33 6 55 66 77 88",
    maritalStatus: "married",
    companyId: 1,
    managerId: null, // RH, pas de manager direct
    documents: [
      { id: 7, name: "Contrat de travail", type: "contract", uploadDate: "2019-09-15", url: "/docs/contract_5.pdf" },
      { id: 8, name: "Certification RH", type: "certification", uploadDate: "2019-09-10", url: "/docs/cert_5.pdf" }
    ]
  },
  {
    id: 6,
    name: "Pierre Moreau",
    email: "pierre.moreau@novacore.com",
    role: "Commercial Senior",
    department: "Ventes",
    status: "on_leave",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    hireDate: "2021-11-05",
    salary: 54000,
    phone: "+33 6 67 89 01 23",
    birthDate: "1987-09-30",
    address: "34 Rue du Faubourg Saint-Honoré",
    city: "Paris",
    postalCode: "75008",
    socialSecurityNumber: "1 87 09 75 008 678 90",
    iban: "FR76 6789 0123 4567 8901 2345 678",
    emergencyContact: "Anne Moreau",
    emergencyPhone: "+33 6 66 77 88 99",
    maritalStatus: "divorced",
    companyId: 1,
    managerId: 3, // Manager: Emma Rousseau
    documents: [
      { id: 9, name: "Contrat de travail", type: "contract", uploadDate: "2021-11-05", url: "/docs/contract_6.pdf" }
    ]
  },
];

// 📄 Types de documents
export const documentTypes = [
  { value: "contract", label: "Contrat de travail", icon: "📄" },
  { value: "cv", label: "CV", icon: "📋" },
  { value: "diploma", label: "Diplôme", icon: "🎓" },
  { value: "certification", label: "Certification", icon: "🏆" },
  { value: "id", label: "Pièce d'identité", icon: "🆔" },
  { value: "medical", label: "Certificat médical", icon: "🏥" },
  { value: "other", label: "Autre", icon: "📎" }
];

// 📅 Présences et congés
export const attendanceRecords = [
  { id: 1, employeeId: 1, date: "2025-10-20", status: "present", checkIn: "08:45", checkOut: "17:30" },
  { id: 2, employeeId: 2, date: "2025-10-20", status: "present", checkIn: "09:00", checkOut: "18:00" },
  { id: 3, employeeId: 3, date: "2025-10-20", status: "present", checkIn: "08:30", checkOut: "17:15" },
  { id: 4, employeeId: 4, date: "2025-10-20", status: "remote", checkIn: "09:15", checkOut: "17:45" },
  { id: 5, employeeId: 5, date: "2025-10-20", status: "present", checkIn: "08:50", checkOut: "17:20" },
  { id: 6, employeeId: 6, date: "2025-10-20", status: "leave", checkIn: null, checkOut: null },
];

export const leaveRequests = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Sophie Martin",
    type: "vacation",
    startDate: "2025-11-15",
    endDate: "2025-11-22",
    days: 6,
    status: "pending",
    reason: "Vacances familiales",
    requestDate: "2025-10-10",
  },
  {
    id: 2,
    employeeId: 3,
    employeeName: "Emma Rousseau",
    type: "sick",
    startDate: "2025-10-18",
    endDate: "2025-10-19",
    days: 2,
    status: "approved",
    reason: "Maladie",
    requestDate: "2025-10-17",
  },
  {
    id: 3,
    employeeId: 4,
    employeeName: "Lucas Bernard",
    type: "vacation",
    startDate: "2025-12-20",
    endDate: "2025-12-31",
    days: 10,
    status: "pending",
    reason: "Congés de fin d'année",
    requestDate: "2025-10-15",
  },
];

// 💰 Paie
export const payrollRecords = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Sophie Martin",
    month: "Octobre 2025",
    baseSalary: 55000,
    bonus: 2000,
    deductions: 12500,
    netSalary: 44500,
    status: "processed",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Thomas Dubois",
    month: "Octobre 2025",
    baseSalary: 48000,
    bonus: 1500,
    deductions: 10800,
    netSalary: 38700,
    status: "processed",
  },
  {
    id: 3,
    employeeId: 3,
    employeeName: "Emma Rousseau",
    month: "Octobre 2025",
    baseSalary: 62000,
    bonus: 3000,
    deductions: 14500,
    netSalary: 50500,
    status: "pending",
  },
];

// 🎯 Performance
export const performanceReviews = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Sophie Martin",
    period: "Q3 2025",
    rating: 4.5,
    goals: [
      { title: "Livrer le projet X", status: "completed", progress: 100 },
      { title: "Mentorer 2 juniors", status: "in_progress", progress: 75 },
      { title: "Certification React", status: "completed", progress: 100 },
    ],
    feedback: "Excellent travail sur le projet X. Continue le mentorat.",
    reviewDate: "2025-10-01",
  },
  {
    id: 2,
    employeeId: 2,
    employeeName: "Thomas Dubois",
    period: "Q3 2025",
    rating: 4.0,
    goals: [
      { title: "Refonte UI Dashboard", status: "completed", progress: 100 },
      { title: "Design System v2", status: "in_progress", progress: 60 },
    ],
    feedback: "Très bon travail sur la refonte. Accélérer le Design System.",
    reviewDate: "2025-10-05",
  },
];

// 👔 Recrutement
export const jobOpenings = [
  {
    id: 1,
    title: "Développeur Full Stack Senior",
    department: "Développement",
    location: "Paris / Remote",
    type: "CDI",
    status: "open",
    applicants: 12,
    postedDate: "2025-09-15",
  },
  {
    id: 2,
    title: "Designer UI/UX",
    department: "Design",
    location: "Lyon",
    type: "CDI",
    status: "open",
    applicants: 8,
    postedDate: "2025-10-01",
  },
  {
    id: 3,
    title: "Chef de Projet Marketing",
    department: "Marketing",
    location: "Paris",
    type: "CDD",
    status: "closed",
    applicants: 15,
    postedDate: "2025-08-20",
  },
];

export const candidates = [
  {
    id: 1,
    name: "Alice Dupont",
    email: "alice.dupont@email.com",
    phone: "+33 6 11 22 33 44",
    position: "Développeur Full Stack Senior",
    status: "interview",
    appliedDate: "2025-10-05",
    experience: "5 ans",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Marc Lambert",
    email: "marc.lambert@email.com",
    phone: "+33 6 22 33 44 55",
    position: "Développeur Full Stack Senior",
    status: "screening",
    appliedDate: "2025-10-12",
    experience: "7 ans",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "Julie Petit",
    email: "julie.petit@email.com",
    phone: "+33 6 33 44 55 66",
    position: "Designer UI/UX",
    status: "offer",
    appliedDate: "2025-10-08",
    experience: "4 ans",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
  },
];

// 🏢 Entreprises (Multi-tenant)
export const companies = [
  {
    id: 1,
    name: "TechCorp",
    email: "admin@techcorp.com",
    plan: "premium",
    maxEmployees: -1, // illimité
    createdDate: "2023-01-15",
    settings: {
      timezone: "Europe/Paris",
      currency: "EUR",
      language: "fr"
    },
    isActive: true
  },
  {
    id: 2,
    name: "StartupHub",
    email: "admin@startuphub.com",
    plan: "basic",
    maxEmployees: 50,
    createdDate: "2024-03-20",
    settings: {
      timezone: "Europe/Paris",
      currency: "EUR",
      language: "fr"
    },
    isActive: true
  }
];

// 👤 Utilisateurs (Employeurs, RH, Employés)
export const users = [
  {
    id: 1,
    email: "admin@techcorp.com",
    password: "hashed_password", // En production: hashé
    firstName: "Marie",
    lastName: "Lefebvre",
    role: "employer",
    companyId: 1,
    isActive: true,
    createdDate: "2023-01-15",
    lastLogin: "2025-01-20T09:00:00",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    email: "hr@techcorp.com",
    password: "hashed_password",
    firstName: "Sophie",
    lastName: "Martin",
    role: "hr_admin",
    companyId: 1,
    isActive: true,
    createdDate: "2023-02-01",
    lastLogin: "2025-01-20T08:30:00",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    email: "thomas.dubois@techcorp.com",
    password: "hashed_password",
    firstName: "Thomas",
    lastName: "Dubois",
    role: "employee",
    companyId: 1,
    employeeId: 2, // Lien vers l'employé
    isActive: true,
    createdDate: "2023-06-20",
    lastLogin: "2025-01-19T17:45:00",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  }
];

// 🔐 Rôles et Permissions
export const roles = {
  employer: {
    name: "Employeur",
    description: "Propriétaire de l'entreprise avec tous les droits",
    permissions: ["*"], // Tous les droits
    color: "purple"
  },
  hr_admin: {
    name: "Administrateur RH",
    description: "Gestion complète des ressources humaines",
    permissions: [
      "employees.manage",
      "employees.view",
      "payroll.manage",
      "payroll.view",
      "performance.manage",
      "recruitment.manage",
      "reports.view",
      "documents.manage",
      "settings.hr",
      "workflows.manage",
      "timetracking.manage",
      "goals.manage",
      "assets.manage"
    ],
    color: "blue"
  },
  hr_user: {
    name: "Utilisateur RH",
    description: "Gestion limitée des RH",
    permissions: [
      "employees.view",
      "employees.edit",
      "attendance.manage",
      "leaves.manage",
      "documents.view"
    ],
    color: "green"
  },
  manager: {
    name: "Manager",
    description: "Gestion de son équipe",
    permissions: [
      "team.view",
      "team.performance",
      "leaves.approve",
      "reports.team"
    ],
    color: "orange"
  },
  employee: {
    name: "Employé",
    description: "Accès à ses données personnelles",
    permissions: [
      "profile.view",
      "profile.edit",
      "payslips.view",
      "leaves.request",
      "documents.own"
    ],
    color: "gray"
  }
};

// 🏢 Départements
export const departments = [
  {
    id: 1,
    name: "Développement",
    manager: "Sophie Martin",
    employees: 45,
    budget: 450000,
    performance: "+12%",
    companyId: 1
  },
  {
    id: 2,
    name: "Design",
    manager: "Thomas Dubois",
    employees: 18,
    budget: 180000,
    performance: "+8%",
    companyId: 1
  },
  {
    id: 3,
    name: "Marketing",
    manager: "Emma Rousseau",
    employees: 32,
    budget: 320000,
    performance: "+15%",
    companyId: 1
  },
  {
    id: 4,
    name: "Ventes",
    manager: "Pierre Moreau",
    employees: 28,
    budget: 280000,
    performance: "-3%",
    companyId: 1
  },
  {
    id: 5,
    name: "Support",
    manager: "Marie Lefebvre",
    employees: 24,
    budget: 240000,
    performance: "+5%",
    companyId: 1
  }
];

// 📊 Historique des modifications employés
export const employeeHistory = [
  {
    id: 1,
    employeeId: 1,
    action: "salary_change",
    oldValue: "52000",
    newValue: "55000",
    date: "2024-01-15",
    modifiedBy: "Marie Lefebvre",
    reason: "Augmentation annuelle"
  },
  {
    id: 2,
    employeeId: 1,
    action: "role_change",
    oldValue: "Développeuse Junior",
    newValue: "Développeuse Full Stack",
    date: "2023-06-01",
    modifiedBy: "Marie Lefebvre",
    reason: "Promotion"
  },
  {
    id: 3,
    employeeId: 3,
    action: "department_change",
    oldValue: "Ventes",
    newValue: "Marketing",
    date: "2023-03-15",
    modifiedBy: "Marie Lefebvre",
    reason: "Réorganisation interne"
  }
];

// 🤝 Documents partagés
export const sharedDocuments = [
  {
    id: 1,
    documentId: 1,
    ownerId: 1,
    sharedWithIds: [2, 3],
    permissions: "read",
    shareDate: "2025-01-20",
    expiryDate: "2025-02-20",
    message: "Voici le modèle de contrat pour référence",
    isActive: true,
    accessLog: [
      { employeeId: 2, action: "viewed", date: "2025-01-21T10:30:00" },
      { employeeId: 3, action: "downloaded", date: "2025-01-22T14:15:00" }
    ],
    comments: [
      {
        id: 1,
        employeeId: 2,
        employeeName: "Thomas Dubois",
        message: "Très utile, merci pour le partage !",
        date: "2025-01-21T11:00:00"
      }
    ]
  },
  {
    id: 2,
    documentId: 8,
    ownerId: 5,
    sharedWithIds: [1, 2, 3, 4],
    permissions: "download",
    shareDate: "2025-01-18",
    expiryDate: "2025-03-18",
    message: "Procédure d'onboarding mise à jour",
    isActive: true,
    accessLog: [
      { employeeId: 1, action: "viewed", date: "2025-01-19T09:00:00" },
      { employeeId: 2, action: "downloaded", date: "2025-01-19T09:30:00" }
    ],
    comments: []
  }
];

// 📢 Notifications de partage
export const shareNotifications = [
  {
    id: 1,
    employeeId: 2,
    type: "document_shared",
    title: "Document partagé avec vous",
    message: "Sophie Martin a partagé 'Contrat de travail' avec vous",
    shareId: 1,
    date: "2025-01-20T16:00:00",
    read: false
  },
  {
    id: 2,
    employeeId: 1,
    type: "share_expiring",
    title: "Partage expirant bientôt",
    message: "Votre partage 'Contrat de travail' expire dans 3 jours",
    shareId: 1,
    date: "2025-01-17T09:00:00",
    read: true
  }
];

// 🎯 Groupes de partage prédéfinis
export const shareGroups = [
  {
    id: "my_team",
    name: "Mon équipe",
    description: "Membres de mon équipe directe"
  },
  {
    id: "my_department",
    name: "Mon département",
    description: "Tous les membres du département"
  },
  {
    id: "managers",
    name: "Managers",
    description: "Tous les managers"
  },
  {
    id: "all_employees",
    name: "Tous les employés",
    description: "Tous les employés de l'entreprise"
  }
];

// 🚀 Workflows d'Onboarding/Offboarding
export const workflowTemplates = [
  {
    id: 1,
    name: "Onboarding Développeur",
    type: "onboarding",
    department: "Développement",
    tasks: [
      {
        id: 1,
        title: "Préparer le poste de travail",
        description: "Configurer ordinateur, écrans, clavier",
        assignedTo: "IT",
        dueDate: -2,
        category: "equipment",
        mandatory: true
      },
      {
        id: 2,
        title: "Créer les accès système",
        description: "GitHub, Slack, outils de développement",
        assignedTo: "IT",
        dueDate: -1,
        category: "access",
        mandatory: true
      },
      {
        id: 3,
        title: "Tour des bureaux et présentations",
        description: "Présenter l'équipe et les espaces",
        assignedTo: "Manager",
        dueDate: 0,
        category: "integration",
        mandatory: true
      }
    ]
  }
];

// ⏰ Time Tracking
export const timeEntries = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Sophie Martin",
    date: "2025-01-20",
    startTime: "09:00",
    endTime: "17:30",
    breakDuration: 60,
    totalHours: 7.5,
    project: "NovaCore Development",
    description: "Développement module RH",
    status: "approved"
  }
];

// 🎯 Objectifs et KPIs
export const goals = [
  {
    id: 1,
    employeeId: 1,
    employeeName: "Sophie Martin",
    title: "Livrer le module RH v2.0",
    description: "Développer et déployer la nouvelle version",
    category: "project",
    priority: "high",
    startDate: "2025-01-01",
    dueDate: "2025-03-31",
    progress: 65,
    status: "in_progress"
  }
];

// 📦 Actifs d'entreprise
export const companyAssets = [
  {
    id: 1,
    name: "MacBook Pro 16\" M2",
    category: "laptop",
    serialNumber: "MBP2023001",
    purchaseDate: "2023-03-15",
    purchasePrice: 2499,
    assignedTo: 1,
    assignedToName: "Sophie Martin",
    status: "assigned",
    condition: "excellent"
  }
];
