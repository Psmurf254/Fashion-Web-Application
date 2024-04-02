import logging
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from datetime import datetime
from rest_framework.decorators import permission_classes
from info.models import Notification
import requests
import json
from django.utils.datastructures import MultiValueDictKeyError
from django.shortcuts import redirect
from rest_framework.generics import ListAPIView

logger = logging.getLogger(__name__)


def get_user_details(request, user_id):

    user = get_object_or_404(User, id=user_id)
    print(f"User details retrieved: {user.username}")

    user_details = {
        'id': user.id,
        'username': user.username,

    }
    return JsonResponse(user_details)


@api_view(['GET'])
def getCategories(request):
    try:
        categories = FashionCategory.objects.all()
        serializer = FashionCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        error_message = f"Error retrieving categories: {str(e)}"
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Fashions
@api_view(['GET'])
def getFashions(request):
    try:
        fashions = Fashion.objects.order_by('-created_at')
        serializer = FashionSerializer(fashions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        error_message = f"Error retrieving fashions: {str(e)}"
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def getFashionDetails(request, pk):
    try:
        fashion = get_object_or_404(Fashion, pk=pk)
        serializer = FashionSerializer(fashion)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        error_message = f"Error retrieving fashion details: {str(e)}"
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def update_fashion(request, pk):
    try:
        if request.method == 'DELETE':
            fashion = Fashion.objects.get(pk=pk)
            fashion.delete()
            return Response({'message': 'Fashion item deleted successfully'}, status=status.HTTP_204_NO_CONTENT)

        fashion = Fashion.objects.get(pk=pk)
        serializer = FashionSerializer(
            fashion, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            logger.error(f"Saved details: {request.data}")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            logger.error(f"Validation errors: {errors}")
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    except Fashion.DoesNotExist:
        return Response({'error': 'Fashion not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error: {error_message}")
        return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_Fashion(request):
    try:
        creator_instance = Creator.objects.get(user=request.user)
        recieved_data = request.data
        recieved_data['creator'] = creator_instance.id
        recieved_data['created_at'] = timezone.now()
        serializer = FashionSerializer(data=recieved_data)

        if serializer.is_valid():
            serializer.save()
            print('Fashion successfully created')
            creator = creator_instance.id
            followers = Following.objects.filter(creator=creator)
            notification_message = f"{creator_instance.full_name}, Fashionista you are following Added a new item for you to check"

            for follower in followers:
                Notification.objects.create(
                    user=follower.user, message=notification_message)

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Creator.DoesNotExist:
        return Response({'error': 'Creator instance not found'}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# get All Creators
@api_view(['GET'])
def getCreators(request):
    try:
        creators = Creator.objects.all()
        serializer = CreatorSerializer(creators, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        error_message = f"Error retrieving creators: {str(e)}"
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_creator_details(request, creator_id):
    try:
        creator = Creator.objects.get(pk=creator_id)
        serializer = CreatorSerializer(creator)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Creator.DoesNotExist:
        return Response({"error": "Creator not found"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        error_message = f"Error retrieving creator details: {str(e)}"
        logger.error(error_message)
        return Response({"error": error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Specialist dashboard get logged screator
class CreatorListView(generics.ListCreateAPIView):
    serializer_class = CreatorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Creator.objects.filter(user=self.request.user)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if not queryset.exists():

            return Response({"detail": "creator data not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

# Get Logged User
class CurrentUserView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.pk)

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_creator(request):
    try:
        recieved_data = request.data
        recieved_data['user'] = request.user.id

        serializer = CreatorSerializer(data=recieved_data)
        if serializer.is_valid():
            serializer.save()
            print('account successfully created')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# update or create creator account
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_and_add_create_account(request, pk):  # Add 'pk' parameter
    logger.error(f"Recieved data: {request.data}")
    try:
        creator = Creator.objects.get(pk=pk)
        serializer = CreatorSerializer(
            creator, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            errors = serializer.errors
            logger.error(f"Validation errors: {errors}")
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
    except Creator.DoesNotExist:
        return Response({'error': 'Creator not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        error_message = str(e)
        logger.error(f"Error: {error_message}")
        return Response({'error': error_message}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CommentListCreate(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


class CommentRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_comment(request):

    try:
        recieved_data = request.data
        recieved_data['user'] = request.user.id
        recieved_data['created_at'] = timezone.now()

        serializer = CommentSerializer(data=recieved_data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LikeListCreate(generics.ListCreateAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer


class LikeRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_Like(request, fashion_id):
    try:
        like_data = {
            'fashion': fashion_id,
            'user': request.user.id
        }

        serializer = CommentSerializer(data=like_data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReviewRatingListCreate(generics.ListCreateAPIView):
    queryset = ReviewRating.objects.all()
    serializer_class = ReviewRatingSerializer


class ReviewRatingRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReviewRating.objects.all()
    serializer_class = ReviewRatingSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_ReviewRating(request):
    try:
        recieved_data = request.data
        recieved_data['user'] = request.user.id
        recieved_data['created_at'] = timezone.now()

        serializer = ReviewRatingSerializer(data=recieved_data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Creator Review
class CreatorReviewRatingListCreate(generics.ListCreateAPIView):
    queryset = CreatorReviewRating.objects.all()
    serializer_class = CreatorReviewRatingSerializer


class CreatorReviewRatingRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CreatorReviewRating.objects.all()
    serializer_class = CreatorReviewRatingSerializer


# following
class FollowListCreate(generics.ListCreateAPIView):
    queryset = Following.objects.all()
    serializer_class = FollowingSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_follow(request):
    try:
        follow_data = {
            'creator': request.data.get('creator'),
            'user': request.user.id
        }

        serializer = FollowingSerializer(data=follow_data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Creator Review


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_creator_Review(request):
    try:
        recieved_data = request.data
        recieved_data['user'] = request.user.id
        recieved_data['created_at'] = timezone.now()

        serializer = CreatorReviewRatingSerializer(data=recieved_data)

        if serializer.is_valid():
            serializer.save()
            print('review successfully created')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreatorFollowingRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Following.objects.all()
    serializer_class = FollowingSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        following = Following.objects.filter(
            creator=pk, user=request.user.id).first()
        if following:
            following.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

# Favorite
class FavoriteListCreate(generics.ListCreateAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer


class FavoriteRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Favorite.objects.all()
    serializer_class = FavoriteSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_favorite(request):
    try:
        form_data = {
            'user': request.user.id,
            'fashion': request.data.get('fashion'),
            'created_at': timezone.now()


        }

        print('form Data:',  form_data)

        serializer = FavoriteSerializer(data=form_data)

        if serializer.is_valid():
            serializer.save()
            print('favorite successfully added')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('Validation Error:', serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        print('Error:', str(e))
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
