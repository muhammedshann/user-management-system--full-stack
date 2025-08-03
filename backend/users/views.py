from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializer import registerSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import CustomTokenObtainPairSerializer,userUpdateSerializer
from rest_framework.permissions import IsAuthenticated
from .validator import validateExist



# Create your views here.
class RegisterView(APIView):
    def post(self,request):
        serializer = registerSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': serializer.data,
                "access": str(refresh.access_token),
                "refresh": str(refresh)
                }, status=status.HTTP_201_CREATED)
        print('error in serializer')
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class updateUser(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = userUpdateSerializer(
            instance=request.user,
            data=request.data,
            context={'request': request}
        )
        if serializer.is_valid():
            user = serializer.save()
            return Response(userUpdateSerializer(user, context={'request': request}).data)
        return Response(serializer.errors, status=400)
