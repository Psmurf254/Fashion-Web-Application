from . models import *
from rest_framework.serializers import ModelSerializer

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id']

class FashionCategorySerializer(ModelSerializer):
    class Meta:
        model = FashionCategory
        fields = '__all__'

class CreatorSerializer(ModelSerializer):
    class Meta:
        model = Creator
        fields = '__all__'


class FashionSerializer(ModelSerializer):
    class Meta:
        model = Fashion
        fields = '__all__'

class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'

class LikeSerializer(ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'

class ReviewRatingSerializer(ModelSerializer):
    class Meta:
        model = ReviewRating
        fields = '__all__'

class CreatorReviewRatingSerializer(ModelSerializer):
    class Meta:
        model = CreatorReviewRating
        fields = '__all__'

class FollowingSerializer(ModelSerializer):
    class Meta:
        model = Following
        fields = '__all__'

class FavoriteSerializer(ModelSerializer):
    class Meta:
        model = Favorite
        fields = '__all__'


