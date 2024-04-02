from rest_framework import generics
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import CustomUser
from .serializers import *
from rest_framework import status
from rest_framework import status


class CustomUserListCreateView(generics.ListCreateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CustomUser.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():
           
            return Response({"detail": "User data not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    

class CustomUserRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
       
        return CustomUser.objects.filter(user=self.request.user)

    def perform_update(self, serializer):
       
        serializer.save()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_user(request):
    try:
        user_data = {
            'user': request.user.id,
            'full_name': request.data.get('full_name'),
            'gender': request.data.get('gender'),
            'date_of_birth': request.data.get('date_of_birth'),
            'contact_phone': request.data.get('contact_phone'),
            'contact_email': request.data.get('contact_email'),
            'profile_picture': request.data.get('profile_picture'),
            
        }

        print('User Data:', user_data)

        serializer = CustomUserSerializer(data=user_data)

        if serializer.is_valid():
            serializer.save()
            print('Feedback successfully saved')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)