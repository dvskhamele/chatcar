# Generated by Django 2.1.4 on 2018-12-27 10:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0016_locations'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='locations',
            field=models.CharField(choices=[('1', 'Moti Nagar'), ('2', 'Dilshad Garden'), ('3', 'Prashant Vihar'), ('4', 'Infocity'), ('5', 'MG Road')], default=0, max_length=2),
            preserve_default=False,
        ),
    ]
