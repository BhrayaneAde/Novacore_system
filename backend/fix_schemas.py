#!/usr/bin/env python3
"""Script pour corriger tous les schémas Pydantic v2"""

import os
import glob

def fix_schema_file(filepath):
    """Corrige un fichier de schéma pour Pydantic v2"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remplacer orm_mode par from_attributes
    if 'class Config:' in content and 'orm_mode = True' in content:
        content = content.replace(
            '    class Config:\n        orm_mode = True',
            '    model_config = {"from_attributes": True}'
        )
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Corrigé: {filepath}")
        return True
    return False

def main():
    """Fonction principale"""
    schema_files = glob.glob('app/schemas/*.py')
    fixed_count = 0
    
    for filepath in schema_files:
        if fix_schema_file(filepath):
            fixed_count += 1
    
    print(f"\n🎉 {fixed_count} fichiers corrigés pour Pydantic v2")

if __name__ == "__main__":
    main()