from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = '__all__'
        read_only = ['pk']

class ChatRequestSerializer(serializers.ModelSerializer):
    client = serializers.PrimaryKeyRelatedField(queryset = Client.objects.all())
    client_name = serializers.StringRelatedField(source='client',read_only=True)
    expert = serializers.PrimaryKeyRelatedField(queryset = User.objects.all(), required=False)
    expert_name = serializers.StringRelatedField(source='expert',read_only=True)
    class Meta:
        model = ChatRequest
        fields = '__all__'
    #    fields = ['client', 'client_name', 'requestdata']
        read_only = ['pk']


    def get_queryset(self):
        return self.queryset.filter(status='Panding')


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
        read_only_fields = ['pk']

class User_ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_Chat
        fields = '__all__'
        read_only = ['pk']

    def get_queryset(self):
        x = self.queryset.filter(expert=self.kwargs.get('c1'))
        return x.filter(client=self.kwargs.get('c2'))

#class BlogPostSerializer(serializers.ModelSerializer):
#    category = serializers.PrimaryKeyRelatedField(read_only=True)
#    category_id = category
#    category = serializers.StringRelatedField()


#    class Meta:
#        model = BlogPost
#        fields = '__all__'
#        read_only_fields = ['pk', 'user']
