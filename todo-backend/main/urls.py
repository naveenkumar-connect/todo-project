""" URL scheme for main app """

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('profilecreate', views.UserProfileViewSet, basename='profilecreate')
router.register('profile/(?P<username>[\w\-]+)', views.UserProfileViewSet, basename='profile')
router.register('logout', views.UserLogoutViewSet)
router.register('bucket/(?P<username>[\w\-]+)', views.Bucket, basename='bucket')
router.register('task/(?P<username>[\w\-]+)', views.Task, basename='task')

urlpatterns = [
    path('login/', views.UserLoginApiView.as_view() ),
    path('', include(router.urls) )
]