/**
 * Moteur de calcul automatique de paie - Bénin
 * Calcule automatiquement brut, cotisations et coût total à partir du net souhaité
 */

// Barèmes IRPP Bénin 2024
const IRPP_BAREME = [
  { min: 0, max: 130000, taux: 0 },
  { min: 130001, max: 170000, taux: 0.05 },
  { min: 170001, max: 220000, taux: 0.10 },
  { min: 220001, max: 920000, taux: 0.15 },
  { min: 920001, max: 1840000, taux: 0.20 },
  { min: 1840001, max: Infinity, taux: 0.35 }
];

// Taux de cotisations
const TAUX_CNSS_EMPLOYE = 0.036; // 3.6%
const TAUX_CNSS_EMPLOYEUR = 0.165; // 16.5%

/**
 * Calcule l'IRPP selon le barème progressif béninois
 */
function calculerIRPP(salaireBrut) {
  let irpp = 0;
  let resteAImposer = salaireBrut;

  for (const tranche of IRPP_BAREME) {
    if (resteAImposer <= 0) break;

    const baseImposable = Math.min(resteAImposer, tranche.max - tranche.min + 1);
    if (salaireBrut > tranche.min) {
      irpp += baseImposable * tranche.taux;
    }
    resteAImposer -= baseImposable;
  }

  return Math.round(irpp);
}

/**
 * Calcule le salaire brut à partir du net souhaité (calcul inverse)
 */
function calculerBrutDepuisNet(netSouhaite, maxIterations = 10) {
  let brutEstime = netSouhaite * 1.4; // Estimation initiale
  let iteration = 0;

  while (iteration < maxIterations) {
    const cnssEmploye = Math.round(brutEstime * TAUX_CNSS_EMPLOYE);
    const irpp = calculerIRPP(brutEstime);
    const netCalcule = brutEstime - cnssEmploye - irpp;
    
    const ecart = netSouhaite - netCalcule;
    
    // Si l'écart est acceptable (moins de 100 F CFA)
    if (Math.abs(ecart) < 100) {
      return Math.round(brutEstime);
    }
    
    // Ajuster l'estimation
    brutEstime += ecart * 1.2;
    iteration++;
  }

  return Math.round(brutEstime);
}

/**
 * Primes par défaut selon le profil
 */
const PRIMES_PAR_PROFIL = {
  'assistant': {
    transport: 25000,
    fonction: 10000
  },
  'manager': {
    transport: 50000,
    fonction: 50000
  },
  'directeur': {
    transport: 75000,
    fonction: 100000
  },
  'default': {
    transport: 25000,
    fonction: 0
  }
};

/**
 * FONCTION PRINCIPALE : Calcule tout automatiquement
 */
export function calculerSalaireComplet(netSouhaite, profil = 'default') {
  // 1. Calculer le brut nécessaire
  const salaireBrut = calculerBrutDepuisNet(netSouhaite);
  
  // 2. Calculer les cotisations
  const cnssEmploye = Math.round(salaireBrut * TAUX_CNSS_EMPLOYE);
  const cnssEmployeur = Math.round(salaireBrut * TAUX_CNSS_EMPLOYEUR);
  const irpp = calculerIRPP(salaireBrut);
  
  // 3. Primes selon le profil
  const primes = PRIMES_PAR_PROFIL[profil] || PRIMES_PAR_PROFIL.default;
  const totalPrimes = Object.values(primes).reduce((sum, prime) => sum + prime, 0);
  
  // 4. Calculs finaux
  const brutTotal = salaireBrut + totalPrimes;
  const netReel = salaireBrut + totalPrimes - cnssEmploye - irpp;
  const coutTotal = brutTotal + cnssEmployeur;

  return {
    // Résultats principaux
    netAPayer: Math.round(netReel),
    salaireBrut: salaireBrut,
    coutTotal: Math.round(coutTotal),
    
    // Détail des variables
    variables: {
      salaireBase: salaireBrut,
      primeTransport: primes.transport,
      primeFonction: primes.fonction,
      cnssEmploye: cnssEmploye,
      cnssEmployeur: cnssEmployeur,
      irpp: irpp
    },
    
    // Informations complémentaires
    details: {
      brutAvecPrimes: brutTotal,
      totalPrimes: totalPrimes,
      totalCotisations: cnssEmploye + irpp,
      tauxGlobal: Math.round((coutTotal - netReel) / coutTotal * 100)
    }
  };
}

/**
 * Fonction utilitaire pour formater les montants
 */
export function formaterMontant(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' F CFA';
}

/**
 * Validation du salaire net
 */
export function validerSalaireNet(netSouhaite) {
  const errors = [];
  
  if (!netSouhaite || netSouhaite <= 0) {
    errors.push('Le salaire net doit être supérieur à 0');
  }
  
  if (netSouhaite < 50000) {
    errors.push('Le salaire net semble très faible (< 50 000 F CFA)');
  }
  
  if (netSouhaite > 5000000) {
    errors.push('Le salaire net semble très élevé (> 5 000 000 F CFA)');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
}