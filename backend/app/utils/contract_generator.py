import re
from typing import Dict, Any
from app.schemas.contract_templates import get_template_by_id

def replace_variables(content: str, variables: Dict[str, Any]) -> str:
    """
    Remplace les variables {{variableName}} dans le contenu du contrat
    """
    def replace_match(match):
        var_name = match.group(1)
        return str(variables.get(var_name, f"{{{{ {var_name} }}}}"))
    
    # Remplace toutes les variables {{variableName}}
    return re.sub(r'\{\{(\w+)\}\}', replace_match, content)

def generate_contract(template_id: int, variables: Dict[str, Any]) -> Dict[str, Any]:
    """
    Génère un contrat complet à partir d'un template et des variables
    """
    template = get_template_by_id(template_id)
    if not template:
        raise ValueError(f"Template avec ID {template_id} non trouvé")
    
    # Valide les variables requises
    required_vars = [var["key"] for var in template["variables"] if var["required"]]
    missing_vars = [var for var in required_vars if var not in variables]
    
    if missing_vars:
        raise ValueError(f"Variables requises manquantes: {', '.join(missing_vars)}")
    
    # Génère le contenu final
    final_content = replace_variables(template["content"], variables)
    
    return {
        "template_id": template_id,
        "template_name": template["name"],
        "content": final_content,
        "variables": variables,
        "type": template["type"],
        "category": template["category"]
    }

def validate_variables(template_id: int, variables: Dict[str, Any]) -> Dict[str, Any]:
    """
    Valide les variables selon le template
    """
    template = get_template_by_id(template_id)
    if not template:
        raise ValueError(f"Template avec ID {template_id} non trouvé")
    
    errors = {}
    
    for var_def in template["variables"]:
        key = var_def["key"]
        value = variables.get(key)
        
        # Vérification des champs requis
        if var_def["required"] and (value is None or value == ""):
            errors[key] = "Ce champ est requis"
            continue
        
        # Validation par type
        if value is not None and value != "":
            if var_def["type"] == "number":
                try:
                    float(value)
                except (ValueError, TypeError):
                    errors[key] = "Doit être un nombre"
            
            elif var_def["type"] == "date":
                # Validation basique du format date
                if not re.match(r'\d{4}-\d{2}-\d{2}', str(value)):
                    errors[key] = "Format de date invalide (YYYY-MM-DD)"
            
            elif var_def["type"] == "select" and "options" in var_def:
                if value not in var_def["options"]:
                    errors[key] = f"Valeur non autorisée. Options: {', '.join(var_def['options'])}"
    
    return {"valid": len(errors) == 0, "errors": errors}

def preview_contract(template_id: int, variables: Dict[str, Any]) -> str:
    """
    Génère un aperçu du contrat avec les variables remplies
    """
    try:
        contract = generate_contract(template_id, variables)
        return contract["content"]
    except ValueError as e:
        return f"Erreur de génération: {str(e)}"