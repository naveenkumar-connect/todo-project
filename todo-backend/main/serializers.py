""" defines serializers for custom user profile, token, task and buckets """

from rest_framework import serializers
from . import models
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User


class UserProfileSerializer(serializers.ModelSerializer):
    """serializes custom user model for api"""

    class Meta:
        model = models.UserProfile

        #field required to be shared over api
        fields = ('username', 'email', 'password')

        #making password write only over api
        extra_kwargs = {
            'password' : {
                'write_only' : True,
                'style' : {'input_type' : 'password'} 
            }
        }
    
    def create(self, validated_data):
        """Create and return a new user over api"""

        user = models.UserProfile.objects.create_user(
            username = validated_data['username'],
            email = validated_data['email'],
            password = validated_data['password']
        )

        return user

class GetTokenSerializer(serializers.Serializer):
    """serializes token to be shared over api"""
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)

class TokenSerializer(serializers.ModelSerializer):
    """serializes custom user model for api"""

    class Meta:
        model = Token
        fields = ('user_id', 'key', 'created')


class BucketSerializer(serializers.ModelSerializer):
    """serializes Details model for api"""
    class Meta:
        model = models.Bucket
        fields = ('id', 'bucketname', 'username')

class TaskSerializer(serializers.ModelSerializer):
    """serializes Details model for api"""
    class Meta:
        model = models.Task
        fields = ('id', 'taskname', 'bucketname', 'username', 'checked')
   