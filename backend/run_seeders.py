#!/usr/bin/env python3
"""
Script to run all seeders for the NovaCore application
"""

import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from seed_departments import seed_departments
from seed_performance import seed_performance_data

def main():
    """Run all seeders"""
    print("Starting database seeding...")
    
    try:
        print("\n1. Seeding departments...")
        seed_departments()
        
        print("\n2. Seeding performance data...")
        seed_performance_data()
        
        print("\n✅ All seeders completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Error running seeders: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()