# Generated by Django 2.1.4 on 2018-12-21 16:13

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0009_auto_20181221_1608'),
    ]

    operations = [
        migrations.AlterField(
            model_name='botdesc',
            name='botchat',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chat.BotChat'),
        ),
    ]
