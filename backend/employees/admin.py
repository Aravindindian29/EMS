from django.contrib import admin
from .models import User, Employee, Team, VPIndia, ReportingManager

admin.site.register(User)
admin.site.register(Employee)
admin.site.register(Team)
admin.site.register(VPIndia)
admin.site.register(ReportingManager)
