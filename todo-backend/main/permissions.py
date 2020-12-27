""" sets permissions for profiles and token deletions """

from rest_framework import permissions


#sets permission to makes changes to own profile only
class UpdateOwnProfile(permissions.BasePermission):
    """Allow user to edit their own profile"""

    def has_object_permission(self, request, view, obj):
        """Check if user is trying to edit their own profile"""
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.username_id == request.user.username


#sets permission to delete own token only
class DeleteOwnToken(permissions.BasePermission):
    """Allow user to delete their own profile"""

    def has_object_permission(self, request, view, obj):
        """Check user is trying to edit their own profile"""
        if request.method in permissions.SAFE_METHODS:
            return True
        
        return obj.user_id == request.user.username

