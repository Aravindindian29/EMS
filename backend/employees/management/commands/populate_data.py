from django.core.management.base import BaseCommand
from employees.models import User, Team, Employee
from datetime import date, timedelta
import random

class Command(BaseCommand):
    help = 'Populate database with sample employee data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')
        
        User.objects.all().delete()
        Team.objects.all().delete()
        Employee.objects.all().delete()
        
        admin_user = User.objects.create_user(
            username='admin',
            email='admin@adf.com',
            password='admin123',
            first_name='Admin',
            last_name='User',
            role='admin'
        )
        self.stdout.write(self.style.SUCCESS(f'Created admin user: admin/admin123'))
        
        regular_user = User.objects.create_user(
            username='user',
            email='user@adf.com',
            password='user123',
            first_name='Regular',
            last_name='User',
            role='user'
        )
        self.stdout.write(self.style.SUCCESS(f'Created regular user: user/user123'))
        
        teams_data = [
            {'us_team_head': 'John Smith', 'india_head': 'Rajesh Kumar', 'team_name': 'Engineering'},
            {'us_team_head': 'Sarah Johnson', 'india_head': 'Priya Sharma', 'team_name': 'Product'},
            {'us_team_head': 'Michael Brown', 'india_head': 'Amit Patel', 'team_name': 'Design'},
            {'us_team_head': 'Emily Davis', 'india_head': 'Sneha Reddy', 'team_name': 'Marketing'},
            {'us_team_head': 'David Wilson', 'india_head': 'Vikram Singh', 'team_name': 'Sales'},
            {'us_team_head': 'Lisa Anderson', 'india_head': 'Anita Desai', 'team_name': 'HR'},
            {'us_team_head': 'Robert Taylor', 'india_head': 'Karthik Iyer', 'team_name': 'Finance'},
        ]
        
        teams = []
        for team_data in teams_data:
            team = Team.objects.create(**team_data)
            teams.append(team)
            self.stdout.write(f'Created team: {team.team_name}')
        
        first_names = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Arnav', 'Ayaan',
                      'Krishna', 'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Reyansh',
                      'Aadhya', 'Ananya', 'Pari', 'Anika', 'Navya', 'Angel', 'Diya', 'Myra',
                      'Sara', 'Jiya', 'Aaradhya', 'Anaya', 'Zara', 'Shanaya', 'Kavya']
        
        last_names = ['Sharma', 'Verma', 'Patel', 'Kumar', 'Singh', 'Reddy', 'Gupta', 'Joshi',
                     'Iyer', 'Nair', 'Desai', 'Mehta', 'Agarwal', 'Chopra', 'Malhotra', 'Kapoor']
        
        titles = ['Software Engineer', 'Senior Software Engineer', 'Lead Engineer', 'Product Manager',
                 'Senior Product Manager', 'UI/UX Designer', 'Senior Designer', 'Marketing Manager',
                 'Sales Executive', 'HR Manager', 'Financial Analyst', 'Data Scientist', 'DevOps Engineer']
        
        vp_names = ['Suresh Menon', 'Lakshmi Krishnan', 'Ramesh Babu', 'Kavita Nambiar']
        
        employees = []
        for i in range(1, 61):
            first_name = random.choice(first_names)
            last_name = random.choice(last_names)
            name = f"{first_name} {last_name}"
            email = f"{first_name.lower()}.{last_name.lower()}{i}@adf.com"
            
            emp_type = random.choices(
                ['Full Time', 'Intern', 'Contract'],
                weights=[70, 15, 15]
            )[0]
            
            days_ago = random.randint(30, 1500)
            date_of_joining = date.today() - timedelta(days=days_ago)
            
            team = random.choice(teams)
            
            status = random.choices(['Active', 'Exited'], weights=[80, 20])[0]
            
            exit_date = None
            exit_type = ''
            if status == 'Exited':
                exit_days_ago = random.randint(0, 365)
                exit_date = date.today() - timedelta(days=exit_days_ago)
                if exit_date < date_of_joining:
                    exit_date = date_of_joining + timedelta(days=random.randint(90, 730))
                exit_type = random.choice(['Voluntary', 'Termination'])
            
            employee = Employee.objects.create(
                employee_id=f'ADF{1000 + i}',
                title=random.choice(titles),
                name=name,
                email=email,
                date_of_joining=date_of_joining,
                type=emp_type,
                status=status,
                reporting_to=team.india_head,
                team=team,
                vp_india=random.choice(vp_names),
                experience_prior_adf=round(random.uniform(0, 10), 1),
                exit_date=exit_date,
                exit_type=exit_type
            )
            employees.append(employee)
        
        self.stdout.write(self.style.SUCCESS(f'Created {len(employees)} employees'))
        
        active_count = Employee.objects.filter(status='Active').count()
        exited_count = Employee.objects.filter(status='Exited').count()
        full_time = Employee.objects.filter(type='Full Time', status='Active').count()
        interns = Employee.objects.filter(type='Intern', status='Active').count()
        contract = Employee.objects.filter(type='Contract', status='Active').count()
        
        self.stdout.write(self.style.SUCCESS('\n=== Summary ==='))
        self.stdout.write(f'Active Employees: {active_count}')
        self.stdout.write(f'Exited Employees: {exited_count}')
        self.stdout.write(f'Full Time: {full_time}')
        self.stdout.write(f'Interns: {interns}')
        self.stdout.write(f'Contract: {contract}')
        self.stdout.write(self.style.SUCCESS('\nData population complete!'))
