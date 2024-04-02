# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.contrib.auth.models import User



class CustomTokenObtainPairView(TokenObtainPairView):
   
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        return response

class ObtainTokenView(CustomTokenObtainPairView):
    permission_classes = []

class RefreshTokenView(APIView):
    permission_classes = []

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=400)

       
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            return Response({"access": access_token})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"detail": "This is a protected view"})

class RegisterView(APIView):
    permission_classes = []

    def post(self, request):
       
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"error": "Both username and password are required"}, status=status.HTTP_400_BAD_REQUEST)

      
        if User.objects.filter(username=username).exists():
            return Response({"error": "Username is already taken"}, status=status.HTTP_400_BAD_REQUEST)

        
        user = User.objects.create_user(username=username, password=password)

       
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({"access": access_token}, status=status.HTTP_201_CREATED)
