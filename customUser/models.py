from django.db import models
from django.contrib.auth.models import User

class CustomUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, default=None)

     # Personal Information
    full_name = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    date_of_birth = models.DateField()
    contact_phone = models.CharField(max_length=15)
    contact_email = models.EmailField()
    profile_picture = models.ImageField(upload_to='user_profile_pics/', null=True, blank=True)

    def __str__(self):
        return self.full_name

