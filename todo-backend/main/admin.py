from django.contrib import admin 
from django.contrib.auth.admin import UserAdmin
from . import models

#Register app models to admin
admin.site.register(models.Bucket)
admin.site.register(models.Task) 

class UserProfileAdmin(UserAdmin):
    list_display = ('username', 'email',)

#registering custom user profile to admin
admin.site.register(models.UserProfile, UserProfileAdmin) 
