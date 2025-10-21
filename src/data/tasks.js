// Données des tâches journalières
export const tasks = [
  {
    id: 1,
    title: "Finaliser le rapport mensuel",
    description: "Compiler les données de performance et rédiger le rapport",
    assignedTo: 1, // Sophie Martin
    assignedBy: 3, // Thomas Dubois (Manager)
    departmentId: 2,
    priority: "urgent",
    status: "in_progress",
    estimatedHours: 4,
    actualHours: 2.5,
    dueDate: "2025-01-22T17:00:00",
    createdAt: "2025-01-20T09:00:00",
    startedAt: "2025-01-21T10:30:00",
    completedAt: null,
    tags: ["rapport", "mensuel", "performance"],
    comments: [
      {
        id: 1,
        userId: 1,
        message: "J'ai terminé la partie analyse, reste la rédaction",
        createdAt: "2025-01-21T14:30:00"
      }
    ]
  },
  {
    id: 2,
    title: "Révision design interface utilisateur",
    description: "Revoir les maquettes selon les retours client",
    assignedTo: 2, // Thomas Dubois
    assignedBy: 3, // Thomas Dubois (auto-assigné)
    departmentId: 2,
    priority: "important",
    status: "completed",
    estimatedHours: 6,
    actualHours: 5.5,
    dueDate: "2025-01-21T18:00:00",
    createdAt: "2025-01-19T14:00:00",
    startedAt: "2025-01-20T09:00:00",
    completedAt: "2025-01-21T16:30:00",
    tags: ["design", "ui", "client"],
    comments: []
  },
  {
    id: 3,
    title: "Préparer présentation client",
    description: "Créer les slides pour la réunion de demain",
    assignedTo: 1, // Sophie Martin
    assignedBy: 3, // Thomas Dubois
    departmentId: 2,
    priority: "urgent",
    status: "todo",
    estimatedHours: 3,
    actualHours: 0,
    dueDate: "2025-01-23T09:00:00",
    createdAt: "2025-01-22T08:00:00",
    startedAt: null,
    completedAt: null,
    tags: ["présentation", "client", "slides"],
    comments: []
  },
  {
    id: 4,
    title: "Tests utilisateur application mobile",
    description: "Effectuer les tests de la nouvelle version",
    assignedTo: 3, // Emma Rousseau
    assignedBy: 3, // Thomas Dubois
    departmentId: 2,
    priority: "normal",
    status: "in_review",
    estimatedHours: 8,
    actualHours: 7,
    dueDate: "2025-01-24T17:00:00",
    createdAt: "2025-01-18T10:00:00",
    startedAt: "2025-01-19T09:00:00",
    completedAt: "2025-01-22T16:00:00",
    tags: ["tests", "mobile", "qa"],
    comments: [
      {
        id: 2,
        userId: 3,
        message: "Tests terminés, en attente de validation",
        createdAt: "2025-01-22T16:00:00"
      }
    ]
  },
  {
    id: 5,
    title: "Mise à jour documentation API",
    description: "Documenter les nouveaux endpoints",
    assignedTo: 2, // Thomas Dubois
    assignedBy: 1, // Marie Lefebvre (Employer)
    departmentId: 1,
    priority: "normal",
    status: "todo",
    estimatedHours: 2,
    actualHours: 0,
    dueDate: "2025-01-25T12:00:00",
    createdAt: "2025-01-22T11:00:00",
    startedAt: null,
    completedAt: null,
    tags: ["documentation", "api", "technique"],
    comments: []
  }
];

export const taskStatuses = {
  todo: { 
    label: "À faire", 
    color: "gray", 
    bgColor: "bg-gray-100", 
    textColor: "text-gray-800",
    borderColor: "border-gray-300"
  },
  in_progress: { 
    label: "En cours", 
    color: "blue", 
    bgColor: "bg-blue-100", 
    textColor: "text-blue-800",
    borderColor: "border-blue-300"
  },
  in_review: { 
    label: "En révision", 
    color: "yellow", 
    bgColor: "bg-yellow-100", 
    textColor: "text-yellow-800",
    borderColor: "border-yellow-300"
  },
  completed: { 
    label: "Terminé", 
    color: "green", 
    bgColor: "bg-green-100", 
    textColor: "text-green-800",
    borderColor: "border-green-300"
  },
  cancelled: { 
    label: "Annulé", 
    color: "red", 
    bgColor: "bg-red-100", 
    textColor: "text-red-800",
    borderColor: "border-red-300"
  }
};

export const taskPriorities = {
  urgent: { 
    label: "Urgent", 
    color: "red", 
    bgColor: "bg-red-100", 
    textColor: "text-red-800",
    icon: "🔥"
  },
  important: { 
    label: "Important", 
    color: "orange", 
    bgColor: "bg-orange-100", 
    textColor: "text-orange-800",
    icon: "⚡"
  },
  normal: { 
    label: "Normal", 
    color: "blue", 
    bgColor: "bg-blue-100", 
    textColor: "text-blue-800",
    icon: "📋"
  },
  low: { 
    label: "Faible", 
    color: "gray", 
    bgColor: "bg-gray-100", 
    textColor: "text-gray-800",
    icon: "📝"
  }
};