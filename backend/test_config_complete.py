#!/usr/bin/env python3
"""
Test complet de la configuration initiale de paie
"""
import requests
import json

def test_configuration_complete():
    """Tester que la configuration initiale est complète à 100%"""
    
    base_url = "http://localhost:8000/api/v1/payroll-config"
    
    tests = []
    
    # Test 1: Endpoint principal accessible
    try:
        response = requests.get(f"{base_url}/test", timeout=5)
        if response.status_code == 200:
            data = response.json()
            tests.append(("API Endpoint", True, f"Status: {data['status']}"))
        else:
            tests.append(("API Endpoint", False, f"Status code: {response.status_code}"))
    except Exception as e:
        tests.append(("API Endpoint", False, str(e)))
    
    # Test 2: Templates disponibles
    try:
        response = requests.get(f"{base_url}/templates", timeout=5)
        if response.status_code == 200:
            templates = response.json()
            template_count = len(templates)
            tests.append(("Templates", True, f"{template_count} templates disponibles"))
            
            # Vérifier que les types sont en majuscules
            all_uppercase = True
            for template_name, template_data in templates.items():
                for var in template_data.get('variables', []):
                    if var['type'] != var['type'].upper():
                        all_uppercase = False
                        break
            tests.append(("Types majuscules", all_uppercase, "Tous les types sont en majuscules" if all_uppercase else "Types en minuscules détectés"))
        else:
            tests.append(("Templates", False, f"Status code: {response.status_code}"))
    except Exception as e:
        tests.append(("Templates", False, str(e)))
    
    # Test 3: Barèmes fiscaux
    try:
        response = requests.get(f"{base_url}/tax-rates", timeout=5)
        if response.status_code == 200:
            tax_rates = response.json()
            tests.append(("Barèmes fiscaux", True, f"Barèmes disponibles: {list(tax_rates.keys())}"))
        else:
            tests.append(("Barèmes fiscaux", False, f"Status code: {response.status_code}"))
    except Exception as e:
        tests.append(("Barèmes fiscaux", False, str(e)))
    
    # Test 4: Vérifier les variables par template
    try:
        response = requests.get(f"{base_url}/templates", timeout=5)
        if response.status_code == 200:
            templates = response.json()
            
            # Vérifier PME
            pme_vars = len(templates.get('PME', {}).get('variables', []))
            tests.append(("Variables PME", pme_vars >= 5, f"{pme_vars} variables"))
            
            # Vérifier Grande Entreprise
            ge_vars = len(templates.get('Grande Entreprise', {}).get('variables', []))
            tests.append(("Variables GE", ge_vars >= 10, f"{ge_vars} variables"))
            
            # Vérifier ONG
            ong_vars = len(templates.get('ONG', {}).get('variables', []))
            tests.append(("Variables ONG", ong_vars >= 5, f"{ong_vars} variables"))
    except Exception as e:
        tests.append(("Variables templates", False, str(e)))
    
    # Affichage des résultats
    print("=== TEST CONFIGURATION INITIALE PAYROLL ===\n")
    
    passed = 0
    total = len(tests)
    
    for test_name, success, details in tests:
        status = "[PASS]" if success else "[FAIL]"
        print(f"{status} {test_name}: {details}")
        if success:
            passed += 1
    
    print(f"\n=== RÉSULTAT ===")
    print(f"Tests réussis: {passed}/{total}")
    
    if passed == total:
        print("[SUCCESS] CONFIGURATION INITIALE COMPLETE A 100% !")
        print("\n[INFO] Pret pour l'etape suivante: Parametrage des employes")
        return True
    else:
        print("[WARNING] Configuration incomplete")
        return False

if __name__ == "__main__":
    test_configuration_complete()