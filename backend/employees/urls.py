from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'employees', views.EmployeeViewSet, basename='employee')
router.register(r'teams', views.TeamViewSet, basename='team')

urlpatterns = [
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/password-reset/', views.password_reset_request, name='password_reset'),
    path('auth/password-reset/confirm/', views.password_reset_confirm, name='password_reset_confirm'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard_stats'),
    path('exit-trends/', views.exit_trends, name='exit_trends'),
    path('', include(router.urls)),
]
