#!/usr/bin/env python3
"""
Script pour corriger tous les endpoints hr/employees vers employees/employees
"""

import os
import re

def fix_endpoints_in_file(file_path):
    """Corrige les endpoints dans un fichier"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remplacer hr/employees par employees/employees
        original_content = content
        content = content.replace('/hr/employees', '/employees/employees')
        
        # Si le contenu a changé, écrire le fichier
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Corrigé: {file_path}")
            return True
        return False
    except Exception as e:
        print(f"Erreur avec {file_path}: {e}")
        return False

def main():
    """Fonction principale"""
    frontend_src = "c:/Users/Guiyaz.YENOU/Documents/NovaCore/frontend/src"
    
    files_fixed = 0
    total_files = 0
    
    # Parcourir tous les fichiers .js et .jsx
    for root, dirs, files in os.walk(frontend_src):
        for file in files:
            if file.endswith(('.js', '.jsx')):
                file_path = os.path.join(root, file)
                total_files += 1
                if fix_endpoints_in_file(file_path):
                    files_fixed += 1
    
    print(f"\nRésumé:")
    print(f"   - Fichiers analysés: {total_files}")
    print(f"   - Fichiers corrigés: {files_fixed}")

if __name__ == "__main__":
    main()