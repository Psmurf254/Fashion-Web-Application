# Generated by Django 4.2.10 on 2024-04-01 21:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('creators', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='fashioncategory',
            name='icon',
            field=models.ImageField(blank=True, null=True, upload_to='Category_Icons/'),
        ),
    ]
