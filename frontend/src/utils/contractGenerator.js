// Générateur de contrats côté frontend
export const replaceVariables = (content, variables) => {
  return content.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
    return variables[varName] || `{{ ${varName} }}`;
  });
};

export const generateContract = (template, variables) => {
  if (!template) {
    throw new Error('Template non trouvé');
  }

  // Valide les variables requises
  const requiredVars = template.variables
    .filter(v => v.required)
    .map(v => v.key);
  
  const missingVars = requiredVars.filter(key => !variables[key]);
  
  if (missingVars.length > 0) {
    throw new Error(`Variables requises manquantes: ${missingVars.join(', ')}`);
  }

  // Génère le contenu final
  const finalContent = replaceVariables(template.content, variables);

  return {
    templateId: template.id,
    templateName: template.name,
    content: finalContent,
    variables,
    type: template.type,
    category: template.category
  };
};

export const validateVariables = (template, variables) => {
  if (!template) {
    return { valid: false, errors: { general: 'Template non trouvé' } };
  }

  const errors = {};

  template.variables.forEach(varDef => {
    const { key, required, type, options } = varDef;
    const value = variables[key];

    // Vérification des champs requis
    if (required && (!value || value === '')) {
      errors[key] = 'Ce champ est requis';
      return;
    }

    // Validation par type
    if (value && value !== '') {
      if (type === 'number') {
        if (isNaN(value)) {
          errors[key] = 'Doit être un nombre';
        }
      } else if (type === 'date') {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(value)) {
          errors[key] = 'Format de date invalide (YYYY-MM-DD)';
        }
      } else if (type === 'select' && options) {
        if (!options.includes(value)) {
          errors[key] = `Valeur non autorisée. Options: ${options.join(', ')}`;
        }
      }
    }
  });

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export const previewContract = (template, variables) => {
  try {
    const contract = generateContract(template, variables);
    return contract.content;
  } catch (error) {
    return `Erreur de génération: ${error.message}`;
  }
};

// Fonction pour formater les variables pour l'affichage
export const formatVariableValue = (value, type) => {
  if (!value) return '';
  
  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString('fr-FR');
    case 'number':
      return new Intl.NumberFormat('fr-FR').format(value);
    default:
      return value;
  }
};