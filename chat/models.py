from django.db import models
from django.contrib.auth.models import User, Group

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    CHOICES = (
        ('Sales', 'Sales'),
        ('Services', 'Services'),
        ('Insurance', 'Insurance'),
        ('Other', 'Other'),
    )
    usertype = models.CharField(max_length=10, choices=CHOICES)

    def __str__(self):
        return self.user.username

class Client(models.Model):
    name = models.CharField(max_length=50)
    mobile = models.CharField(max_length=10)
    email = models.CharField(max_length=100)
    cdate = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class BotChat(models.Model):
    msg = models.CharField(max_length=50)

    def __str__(self):
        return self.msg

class BotDesc(models.Model):
    botchat = models.ForeignKey(BotChat, on_delete=models.CASCADE)
    descrip = models.CharField(max_length=750)

    def __str__(self):
        return self.botchat.msg


class User_Chat(models.Model):
    expert = models.ForeignKey(User, related_name='expert', on_delete=models.CASCADE)
    client = models.ForeignKey(Client, related_name='client', on_delete=models.CASCADE)
    chat = models.CharField(max_length=255)
    cdate = models.DateTimeField(auto_now=True)
    type = models.CharField(max_length=10)

    def __str__(self):
        return self.expert.username+" "+self.client.name

class Tags(models.Model):
    name = models.CharField(max_length=25)

    def __str__(self):
        return self.name

class ChatRequest(models.Model):
    client = models.ForeignKey(Client, related_name='requestclient', on_delete=models.CASCADE)
    expert = models.ForeignKey(User, related_name='requestexpert', on_delete=models.CASCADE, blank=True, null=True)
    CHOICES = (
        ('Sales', 'Sales'),
        ('Services', 'Services'),
        ('Insurance', 'Insurance'),
        ('Other', 'Other'),
    )
    requestdata = models.CharField(max_length=10, choices=CHOICES)
    status = models.CharField(max_length=10, default='Panding')


    def __str__(self):
        return self.client.name+" for "+self.requestdata
