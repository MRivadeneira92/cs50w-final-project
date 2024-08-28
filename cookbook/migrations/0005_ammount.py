# Generated by Django 5.0.4 on 2024-07-18 11:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cookbook', '0004_alter_recipe_recipe_description'),
    ]

    operations = [
        migrations.CreateModel(
            name='Ammount',
            fields=[
                ('id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='cookbook.recipe')),
                ('measure', models.CharField(max_length=1000)),
            ],
        ),
    ]