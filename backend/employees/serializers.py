from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, Employee, Team, VPIndia, ReportingManager

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'password2', 'role')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user

class TeamSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ('id', 'us_team_head', 'india_head', 'team_name', 'employee_count')
    
    def get_employee_count(self, obj):
        return obj.employees.filter(status='Active').count()

class VPIndiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = VPIndia
        fields = ('id', 'name')

class ReportingManagerSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportingManager
        fields = ('id', 'name')

class EmployeeSerializer(serializers.ModelSerializer):
    tenure_at_adf = serializers.ReadOnlyField()
    exit_quarter = serializers.ReadOnlyField()
    team_name = serializers.CharField(source='team.team_name', read_only=True)
    
    class Meta:
        model = Employee
        fields = (
            'id', 'employee_id', 'title', 'name', 'email', 'date_of_joining',
            'tenure_at_adf', 'experience_prior_adf', 'type', 'status',
            'reporting_to', 'team', 'team_name', 'vp_india', 'exit_date',
            'exit_type', 'exit_quarter'
        )
    
    def validate(self, attrs):
        if attrs.get('status') == 'Exited' and not attrs.get('exit_date'):
            raise serializers.ValidationError({"exit_date": "Exit date is required for exited employees."})
        if attrs.get('status') == 'Exited' and not attrs.get('exit_type'):
            raise serializers.ValidationError({"exit_type": "Exit type is required for exited employees."})
        return attrs

class DashboardStatsSerializer(serializers.Serializer):
    full_time_count = serializers.IntegerField()
    intern_count = serializers.IntegerField()
    contract_count = serializers.IntegerField()
    total_count = serializers.IntegerField()

class ExitTrendSerializer(serializers.Serializer):
    quarter = serializers.CharField()
    voluntary_exits = serializers.IntegerField()
    terminations = serializers.IntegerField()
    total_exits = serializers.IntegerField()
    difference = serializers.IntegerField()
