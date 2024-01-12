# Generated by Django 3.2.23 on 2024-01-12 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_app', '0005_superusercredentials'),
    ]

    operations = [
        migrations.CreateModel(
            name='EmailUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=255, unique=True, verbose_name='email address')),
                ('times_logged_in', models.IntegerField(default=0)),
                ('is_active', models.BooleanField(default=True)),
                ('is_admin', models.BooleanField(default=False)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
