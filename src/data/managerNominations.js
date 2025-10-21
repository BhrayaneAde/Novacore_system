// Données pour les nominations de managers
export const managerNominations = [
  {
    id: 1,
    proposedManagerId: 3, // Thomas Dubois
    departmentId: 2,
    proposedBy: 2, // Sophie Martin (HR Admin)
    proposedAt: "2025-01-15T10:30:00",
    status: "approved",
    approvedBy: 1, // Marie Lefebvre (Employer)
    approvedAt: "2025-01-15T14:20:00",
    reason: "Excellente expertise technique et leadership naturel",
    comments: "Approuvé - Thomas a démontré ses capacités de leadership"
  },
  {
    id: 2,
    proposedManagerId: 4, // Pierre Moreau
    departmentId: 4,
    proposedBy: 1, // Marie Lefebvre (Employer)
    proposedAt: "2025-01-18T09:15:00",
    status: "pending",
    reason: "Expérience commerciale solide, bon relationnel client",
    comments: null
  },
  {
    id: 3,
    proposedManagerId: 1, // Sophie Martin pour un autre département
    departmentId: 3,
    proposedBy: 2, // Auto-proposition RH
    proposedAt: "2025-01-20T16:45:00",
    status: "rejected",
    rejectedBy: 1,
    rejectedAt: "2025-01-20T18:30:00",
    reason: "Volonté d'élargir les responsabilités RH",
    comments: "Refusé - Sophie doit se concentrer sur ses fonctions RH actuelles"
  }
];

export const nominationStatuses = {
  pending: { label: "En attente", color: "yellow", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
  approved: { label: "Approuvé", color: "green", bgColor: "bg-green-100", textColor: "text-green-800" },
  rejected: { label: "Refusé", color: "red", bgColor: "bg-red-100", textColor: "text-red-800" },
  cancelled: { label: "Annulé", color: "gray", bgColor: "bg-gray-100", textColor: "text-gray-800" }
};