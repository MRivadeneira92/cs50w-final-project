# Generated by Django 5.0.4 on 2024-04-18 12:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cookbook', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='recipe',
            name='recipe_description',
            field=models.CharField(default='Etiam bibendum molestie tortor, quis hendrerit diam tempus at. Nam placerat aliquet tellus', max_length=100),
            preserve_default=False,
        ),
    ]