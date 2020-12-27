""" Creates models for main app """

from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.models import BaseUserManager
from django.core.validators import RegexValidator

class UserProfileManager(BaseUserManager):
    """Manager for user profiles"""
    
    def create_user(self, username, email, password=None):
        """Create a new user profile"""
        
        if not username:
            raise ValueError('Users must have a username')

        if not email:
            raise ValueError('Users must have an email address')
        
        email = self.normalize_email(email)
        user = self.model(username=username, email=email,)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        """Create and save a new superuser with given details"""
        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

#custom user model
class UserProfile(AbstractBaseUser, PermissionsMixin):
    """Custom Database model for users in the system"""
    
    alphanumeric = RegexValidator(r'^[0-9a-zA-Z]*$', 'Only alphanumeric characters are allowed')
    username = models.CharField(max_length=255, primary_key=True, validators= [alphanumeric] ,default = '')
    email = models.EmailField(max_length=255, unique=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserProfileManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def get_full_name(self):
        """Retrieve full name for user"""
        return self.username

    def get_short_name(self):
        """Retrieve short name of user"""
        return self.username

    def __str__(self):
        """Return string representation of user"""
        return self.username


class Bucket(models.Model):
    """Database model for users details in the system"""
    bucketname = models.CharField(max_length=50, default="" , unique=True)
    username = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    

class Task(models.Model):
    """Database model for users details in the system"""
    taskname = models.CharField(max_length=50, default="")
    bucketname = models.ForeignKey(Bucket, on_delete=models.CASCADE)
    username = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    checked = models.BooleanField(default=False)