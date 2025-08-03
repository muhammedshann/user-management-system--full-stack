from rest_framework.response import Response
from rest_framework import viewsets, permissions, status, filters
from django.contrib.auth.models import User
from .serializer import adminSerializer, adminAddUserSerializer, adminUpdateSerilaizer
from rest_framework.viewsets import ViewSet
from rest_framework.exceptions import ValidationError


class adminUsers(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = adminSerializer
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['username', 'email']

class adminAddUser(ViewSet):
    permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]

    def create(self, request):
        serializer = adminAddUserSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return Response(
                {
                    'user': adminAddUserSerializer(user).data,
                    'message': 'User created successfully'
                },
                status=status.HTTP_201_CREATED
            )
        except ValidationError as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class adminDeleteUser(ViewSet):
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def destroy(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)

            if request.user.pk == user.pk:
                return Response({'detail': 'You cannot delete your own account.'},status=status.HTTP_400_BAD_REQUEST)

            user.delete()
            return Response({'id': pk, 'detail': 'User deleted successfully'},status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({'detail': 'User not found'},status=status.HTTP_404_NOT_FOUND)

class adminUpdateUser(ViewSet):
    permission_classes = [permissions.IsAdminUser,permissions.IsAuthenticated]

    def update(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = adminUpdateSerilaizer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully", "user": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)