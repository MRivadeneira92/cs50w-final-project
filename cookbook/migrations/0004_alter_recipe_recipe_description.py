# Generated by Django 5.0.4 on 2024-05-14 08:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cookbook', '0003_alter_recipe_steps'),
    ]

    operations = [
        migrations.AlterField(
            model_name='recipe',
            name='recipe_description',
            field=models.CharField(max_length=60),
        ),
    ]