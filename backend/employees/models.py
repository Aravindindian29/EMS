from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date
from dateutil.relativedelta import relativedelta

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    
    def __str__(self):
        return f"{self.username} ({self.role})"

class Team(models.Model):
    us_team_head = models.CharField(max_length=200)
    india_head = models.CharField(max_length=200)
    team_name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.team_name
    
    class Meta:
        ordering = ['team_name']

class VPIndia(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']
        verbose_name = 'VP India'
        verbose_name_plural = 'VP India'

class ReportingManager(models.Model):
    name = models.CharField(max_length=200, unique=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']
        verbose_name = 'Reporting Manager'
        verbose_name_plural = 'Reporting Managers'

class Employee(models.Model):
    TYPE_CHOICES = [
        ('Full Time', 'Full Time'),
        ('Intern', 'Intern'),
        ('Contract', 'Contract'),
    ]
    
    STATUS_CHOICES = [
        ('Active', 'Active'),
        ('Exited', 'Exited'),
    ]
    
    EXIT_TYPE_CHOICES = [
        ('Voluntary', 'Voluntary'),
        ('Termination', 'Termination'),
        ('', 'N/A'),
    ]
    
    employee_id = models.CharField(max_length=50, unique=True)
    title = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    date_of_joining = models.DateField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    reporting_to = models.CharField(max_length=200, null=True, blank=True)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    vp_india = models.CharField(max_length=200, null=True, blank=True)
    experience_prior_adf = models.DecimalField(max_digits=4, decimal_places=1, help_text="Years of experience")
    exit_date = models.DateField(null=True, blank=True)
    exit_type = models.CharField(max_length=20, choices=EXIT_TYPE_CHOICES, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.employee_id} - {self.name}"
    
    @property
    def tenure_at_adf(self):
        end_date = self.exit_date if self.exit_date else date.today()
        delta = relativedelta(end_date, self.date_of_joining)
        years = delta.years
        months = delta.months
        
        if years > 0 and months > 0:
            return f"{years}y {months}m"
        elif years > 0:
            return f"{years}y"
        else:
            return f"{months}m"
    
    @property
    def exit_quarter(self):
        if self.exit_date:
            quarter = (self.exit_date.month - 1) // 3 + 1
            return f"{self.exit_date.year} Q{quarter}"
        return None
    
    class Meta:
        ordering = ['-created_at']
