# Generated by Django 5.1.3 on 2024-12-18 19:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cookbook', '0007_recipe_recipe_time_delete_ammount'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='recipe_image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]