""" main app views """

from django.shortcuts import render
from . import models, serializers
from . import permissions
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate


class UserProfileViewSet(viewsets.ModelViewSet):
    """ModelViewSet to share user profile details over API"""

    serializer_class = serializers.UserProfileSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.UpdateOwnProfile,)

    def get_queryset(self):
        """shares info of a single user over API whose username is received from the GET request"""
        username = self.kwargs['username']
        return models.UserProfile.objects.filter(username = username)

    def create(self, request, *args, **kwargs):
        """creates user profile and initiates other models realated with the username""" 
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            """executes when the new user details do not already exist"""
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            username = serializer.data["username"]

            return Response({
                'status': 'profileCreated',
                "userData": serializer.data
                }, 
                status=status.HTTP_201_CREATED, 
                headers=headers
            )
        else:
            """executes when the new user details already exist"""
            return Response( {
                'status': 'improperUsernameAndEmail',
                'err': serializer.errors
                }, 
                status=status.HTTP_200_OK
            )


class UserLoginApiView (APIView):  
    """providing token to user when user logs in"""
    def post(self, request, pk=None): 
        serializer = serializers.GetTokenSerializer(data=request.data)

        if serializer.is_valid(): 
            username = serializer.data.get('username')
            password = serializer.data.get('password')

            user = authenticate(username = username, password = password)

            if user is not None :
                """executes when credentials are correct"""
                user = models.UserProfile.objects.get(username=username)
                token, created = Token.objects.get_or_create(user=user)
                return Response({
                    'status': 'success',
                    'token': token.key
                    }, 
                    status=status.HTTP_200_OK
                )
            else:
                """executes when credentials are not correct"""
                return Response({
                    'status': 'wrongCreds',
                    'comment': 'username or password is wrong'
                    }, 
                    status=status.HTTP_200_OK
                )
        else :
            """executes when credentials are not as expected like blank credentials"""
            return Response( {
                'status': 'improperCreds',
                'err': serializer.errors
                }, 
                status=status.HTTP_200_OK
            )


class UserLogoutViewSet (viewsets.ModelViewSet):
    """Logging out a user by deleting the Auth Token"""

    serializer_class = serializers.TokenSerializer
    queryset = Token.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.DeleteOwnToken,)


class Bucket(viewsets.ModelViewSet):
    """ModelViewSet to share user Details model data over API"""
    serializer_class = serializers.BucketSerializer        
    
    def get_queryset(self):
        """shares data of a single user over API whose username is received from the GET request"""
        username = self.kwargs['username']
        return models.Bucket.objects.filter(username = username)

    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.UpdateOwnProfile,)
    

class Task(viewsets.ModelViewSet):
    """ModelViewSet to share user Details model data over API"""
    serializer_class = serializers.TaskSerializer        
    
    def get_queryset(self):
        """shares data of a single user over API whose username is received from the GET request"""
        username = self.kwargs['username']
        return models.Task.objects.filter(username = username)

    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.UpdateOwnProfile,)