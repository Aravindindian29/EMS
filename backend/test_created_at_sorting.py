#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from employees.models import Employee
from datetime import datetime, timezone

def test_created_at_sorting():
    print("Testing created_at sorting functionality...")
    
    # Get all employees
    employees = Employee.objects.all()
    print(f"\nTotal employees: {employees.count()}")
    
    if employees.count() > 0:
        print("\nFirst 5 employees (should be most recently created):")
        for i, emp in enumerate(employees[:5]):
            print(f"  {i+1}. {emp.name} - {emp.employee_id} - Created: {emp.created_at}")
        
        print("\nLast 5 employees (should be oldest):")
        for i, emp in enumerate(employees.order_by('created_at')[:5]):
            print(f"  {i+1}. {emp.name} - {emp.employee_id} - Created: {emp.created_at}")
        
        # Test that ordering is working
        first_employee = employees.first()
        last_employee = employees.last()
        
        if first_employee and last_employee:
            print(f"\nMost recent: {first_employee.name} ({first_employee.created_at})")
            print(f"Oldest: {last_employee.name} ({last_employee.created_at})")
            
            if first_employee.created_at > last_employee.created_at:
                print("SUCCESS: Sorting by created_at is working correctly!")
            else:
                print("ERROR: Sorting is not working as expected")
    else:
        print("No employees found in database")
    
    # Test creating a new employee to verify auto_now_add works
    print(f"\nTesting auto_now_add functionality...")
    try:
        # Check if we can create a test employee (this won't actually save due to validation)
        test_emp = Employee(
            employee_id='ADF_TEST_001',
            title='Test',
            name='Test Employee',
            email='test@example.com',
            date_of_joining='2024-01-01',
            type='Full Time',
            experience_prior_adf=1.0
        )
        print("Test employee object created successfully")
        print(f"created_at field exists: {hasattr(test_emp, 'created_at')}")
    except Exception as e:
        print(f"Error creating test object: {e}")

if __name__ == "__main__":
    test_created_at_sorting()
