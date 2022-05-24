from rest_framework import permissions


class IsAdmin(permissions.BasePermission):
    message="User have to be admin to perform action"

    def has_object_permission(self, request, veiw, obj):
        return obj.admin == request.user

class IsNotAdmin(permissions.BasePermission):
    message="Admin can\'t perform this action"

    def has_object_permission(self, request, veiw, obj):
        return obj.admin != request.user

class IsOwnerOfMessage(permissions.BasePermission):
    message="Only owner can edit message"

    def has_object_permission(self, request, view, obj):
        return obj.author == request.user

class IsMemberOfRoom(permissions.BasePermission):
    message="Only members of room can do this"

    def has_object_permission(self, request, view, obj):
        return request.user in obj.members.all()

