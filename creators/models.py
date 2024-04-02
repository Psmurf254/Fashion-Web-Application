from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.core.validators import MinValueValidator, MaxValueValidator


class FashionCategory(models.Model):
    name = models.CharField(max_length=50)
    icon = models.ImageField(
        upload_to='Category_Icons/', null=True, blank=True)

    def __str__(self):
        return self.name


class Creator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)

    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField()
    contact_phone = models.CharField(max_length=15)
    contact_email = models.EmailField()

    description = models.TextField(blank=True, null='True')
    profile_picture = models.ImageField(
        upload_to='Creator_profile_pics/', null=True, blank=True)
    specialty = models.CharField(max_length=255)

    facebook = models.TextField(blank=True, null='True')
    x = models.TextField(blank=True, null='True')
    instagram = models.TextField(blank=True, null='True')
    whatsApp = models.TextField(blank=True, null='True')

    def __str__(self):
        return self.full_name


class Fashion(models.Model):
    category = models.ForeignKey(FashionCategory, on_delete=models.CASCADE)
    creator = models.ForeignKey(Creator, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    colors = models.TextField(blank=True, null=True)
    additinal_info = models.TextField(blank=True, null=True)
    order_info = models.TextField(blank=True, null=True)
    image = models.ImageField(
        upload_to='Fashion_images/', null=True, blank=True)
    thumbnail1 = models.ImageField(
        upload_to='Fashion_thumbnails/', null=True, blank=True)
    thumbnail2 = models.ImageField(
        upload_to='Fashion_thumbnails/', null=True, blank=True)
    thumbnail3 = models.ImageField(
        upload_to='Fashion_thumbnails/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class ReviewRating(models.Model):
    fashion = models.ForeignKey(Fashion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.fashion.name}: Rating {self.rating}"


class CreatorReviewRating(models.Model):
    creator = models.ForeignKey(Creator, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)])
    review_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user.username} for {self.creator.full_name}: Rating {self.rating}"


class Like(models.Model):
    fashion = models.ForeignKey(Fashion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ['fashion', 'user']

    def __str__(self):
        return f"{self.user.username} likes {self.fashion.name}"


class Comment(models.Model):
    fashion = models.ForeignKey(Fashion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} for {self.fashion.name}"


class Following(models.Model):
    creator = models.ForeignKey(Creator, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Follow by {self.user.username} to {self.creator.full_name}"


class Favorite(models.Model):
    fashion = models.ForeignKey(Fashion, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Favorite by {self.user.username} for {self.fashion.name}"
