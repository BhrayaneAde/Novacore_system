// Données d'évaluation des employés
export const evaluations = [
  {
    id: 1,
    employeeId: 1, // Sophie Martin
    managerId: 3, // Thomas Dubois
    departmentId: 2,
    period: "2025-01", // Janvier 2025
    
    // Métriques automatiques (70%)
    automaticMetrics: {
      taskCompletion: 85, // % de tâches terminées
      deadlineRespect: 90, // % de délais respectés
      quality: 88, // % de tâches acceptées du 1er coup
      workload: 95, // % de charge de travail accomplie
      averageScore: 89.5 // Moyenne automatique
    },
    
    // Évaluation manuelle du manager (30%)
    manualEvaluation: {
      communication: 9, // /10
      teamwork: 8, // /10
      initiative: 7, // /10
      problemSolving: 9, // /10
      averageScore: 8.25 // Moyenne manuelle
    },
    
    // Score global (70% auto + 30% manuel)
    globalScore: 89.1, // (89.5 * 0.7) + (82.5 * 0.3)
    
    // Comparaison avec le mois précédent
    previousPeriod: {
      period: "2024-12",
      globalScore: 82.5,
      progression: 8.0, // +8%
      trend: "improvement" // improvement, stable, decline
    },
    
    // Commentaires et objectifs
    managerComments: "Excellente progression ce mois-ci. Sophie a montré une grande autonomie.",
    strengths: ["Respect des délais", "Qualité du travail", "Communication"],
    improvements: ["Prise d'initiative", "Propositions d'amélioration"],
    nextObjectives: [
      "Prendre en charge un projet en autonomie",
      "Mentorer un nouveau collègue",
      "Améliorer les compétences en présentation"
    ],
    
    createdAt: "2025-02-01T10:00:00",
    updatedAt: "2025-02-01T15:30:00"
  },
  {
    id: 2,
    employeeId: 2, // Thomas Dubois
    managerId: 1, // Marie Lefebvre (Employer évalue le manager)
    departmentId: 2,
    period: "2025-01",
    
    automaticMetrics: {
      taskCompletion: 92,
      deadlineRespect: 88,
      quality: 95,
      workload: 105, // Dépassement des objectifs
      averageScore: 95.0
    },
    
    manualEvaluation: {
      communication: 9,
      teamwork: 10,
      initiative: 9,
      problemSolving: 8,
      averageScore: 9.0
    },
    
    globalScore: 93.5,
    
    previousPeriod: {
      period: "2024-12",
      globalScore: 88.2,
      progression: 6.0,
      trend: "improvement"
    },
    
    managerComments: "Thomas excelle dans son rôle de manager. Équipe très performante sous sa direction.",
    strengths: ["Leadership", "Gestion d'équipe", "Qualité technique"],
    improvements: ["Délégation", "Planification long terme"],
    nextObjectives: [
      "Développer les compétences de l'équipe",
      "Optimiser les processus de travail",
      "Préparer la roadmap Q2"
    ],
    
    createdAt: "2025-02-01T11:00:00",
    updatedAt: "2025-02-01T16:00:00"
  },
  {
    id: 3,
    employeeId: 3, // Emma Rousseau
    managerId: 3, // Thomas Dubois
    departmentId: 3, // Marketing
    period: "2025-01",
    
    automaticMetrics: {
      taskCompletion: 75,
      deadlineRespect: 70,
      quality: 85,
      workload: 80,
      averageScore: 77.5
    },
    
    manualEvaluation: {
      communication: 7,
      teamwork: 8,
      initiative: 6,
      problemSolving: 7,
      averageScore: 7.0
    },
    
    globalScore: 75.8,
    
    previousPeriod: {
      period: "2024-12",
      globalScore: 82.1,
      progression: -7.7,
      trend: "decline"
    },
    
    managerComments: "Emma traverse une période difficile. Besoin d'accompagnement et de soutien.",
    strengths: ["Qualité technique", "Esprit d'équipe"],
    improvements: ["Gestion du temps", "Respect des délais", "Proactivité"],
    nextObjectives: [
      "Formation gestion du temps",
      "Suivi hebdomadaire avec le manager",
      "Réduction de la charge de travail temporaire"
    ],
    
    createdAt: "2025-02-01T12:00:00",
    updatedAt: "2025-02-01T17:00:00"
  }
];

// Calcul automatique des métriques basé sur les tâches
export const calculateAutomaticMetrics = (employeeId, period) => {
  // Cette fonction sera implémentée pour calculer automatiquement
  // les métriques basées sur les tâches de l'employé
  return {
    taskCompletion: 0,
    deadlineRespect: 0,
    quality: 0,
    workload: 0,
    averageScore: 0
  };
};

// Niveaux de performance
export const performanceLevels = {
  excellent: { min: 90, label: "Excellent", color: "green", icon: "🌟" },
  good: { min: 80, label: "Bon", color: "blue", icon: "👍" },
  average: { min: 70, label: "Moyen", color: "yellow", icon: "⚖️" },
  poor: { min: 60, label: "Faible", color: "orange", icon: "⚠️" },
  critical: { min: 0, label: "Critique", color: "red", icon: "🚨" }
};

export const getPerformanceLevel = (score) => {
  if (score >= 90) return performanceLevels.excellent;
  if (score >= 80) return performanceLevels.good;
  if (score >= 70) return performanceLevels.average;
  if (score >= 60) return performanceLevels.poor;
  return performanceLevels.critical;
};

// Calcul des statistiques par département
export const getDepartmentPerformanceStats = (departmentName, employees) => {
  const deptEvaluations = evaluations.filter(evaluation => {
    const employee = employees.find(emp => emp.id === evaluation.employeeId);
    return employee?.department === departmentName;
  });
  
  if (deptEvaluations.length === 0) return null;
  
  return {
    totalEvaluations: deptEvaluations.length,
    averageScore: Math.round(deptEvaluations.reduce((acc, evaluation) => acc + evaluation.globalScore, 0) / deptEvaluations.length),
    improvements: deptEvaluations.filter(evaluation => evaluation.previousPeriod?.trend === 'improvement').length,
    declines: deptEvaluations.filter(evaluation => evaluation.previousPeriod?.trend === 'decline').length,
    stable: deptEvaluations.filter(evaluation => evaluation.previousPeriod?.trend === 'stable').length,
    averageTaskCompletion: Math.round(deptEvaluations.reduce((acc, evaluation) => acc + evaluation.automaticMetrics.taskCompletion, 0) / deptEvaluations.length),
    averageDeadlineRespect: Math.round(deptEvaluations.reduce((acc, evaluation) => acc + evaluation.automaticMetrics.deadlineRespect, 0) / deptEvaluations.length),
    averageQuality: Math.round(deptEvaluations.reduce((acc, evaluation) => acc + evaluation.automaticMetrics.quality, 0) / deptEvaluations.length),
    topPerformers: deptEvaluations.filter(evaluation => evaluation.globalScore >= 90).length,
    needsImprovement: deptEvaluations.filter(evaluation => evaluation.globalScore < 70).length
  };
};