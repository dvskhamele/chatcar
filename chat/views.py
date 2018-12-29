from .models import *
from .serializer import *
from rest_framework import generics, pagination
from django.contrib.auth.models import User
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.contrib.auth.decorators import login_required
import json
from django.core.mail import send_mail

#send_mail('subject', 'body of the message', 'sender@example.com', ['receiver1@example.com', 'receiver2@example.com'])

class CreateTag(generics.CreateAPIView):
    queryset = Tags.objects.all()
    serializer_class = TagSerializer

class CreateChatRequest(generics.CreateAPIView):
    queryset = ChatRequest.objects.all()
    serializer_class = ChatRequestSerializer

class CreateClient(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ClientSerializer

class BotChatMsgs(generics.ListAPIView):
    queryset = BotChat.objects.all()
    serializer_class = BotChatSerializer

class BotChatMsgsDetail(generics.ListAPIView):
    #queryset = BotDesc.objects.filter(botchat=self.kwargs['pk'])
    serializer_class = BotDescSerializer

    def get_queryset(self):
        return BotDesc.objects.filter(botchat=self.kwargs['pk'])

class CreateChat(generics.CreateAPIView):
    queryset = User_Chat.objects.all()
    serializer_class = User_ChatSerializer

class DisplayChat(generics.ListAPIView):
    #queryset = User_Chat.objects.all()
    serializer_class = User_ChatSerializer

    def get_queryset(self):
        return User_Chat.objects.filter(expert=self.kwargs['c1']).filter(client=self.kwargs['c2'])
    #x = self.queryset.filter(expert=self.kwargs.get('c1'))
    #return x

class DisplayChatRequest(generics.ListAPIView):
    queryset = ChatRequest.objects.filter(status='Panding')
    serializer_class = ChatRequestSerializer

class DetailChatRequest(generics.RetrieveUpdateAPIView):
    queryset = ChatRequest.objects.all()
    serializer_class = ChatRequestSerializer

def index(request):
    context = {}
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user:
            if user.is_active:
                login(request,user)
                return HttpResponseRedirect(reverse('dashboard'))
            else:
                context['status'] = "Your account was inactive."
                return render(request, 'login.html', context)
        else:
            context['status'] = "Invalid login details given"
            return render(request, 'login.html', context)
    else:
        return render(request, 'login.html', context)

@login_required(login_url='../')
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

@login_required(login_url='../')
def dashboard(request):
    context = {}
    x = UserProfile.objects.get(user=request.user)
    context['usertype'] = x.usertype
    context['userloc'] = x.locations
    return render(request, 'index.html', context)


def taglist(request):
    tchat = ChatRequest.objects.count()
    tquery = User_Chat.objects.filter(type='client').count()
    tuser = Client.objects.count()
    tags = Tags.objects.all()
    taglists = []
    for t in tags:
        taglists.append(t.name)

    taglist_unique = list(set(taglists))
    tagcount = []
    for t in taglist_unique:
        tagcount.append(taglists.count(t))
    return JsonResponse({'tags':taglist_unique,'count':tagcount, 'countsum': sum(tagcount), 'tchat': tchat, 'tquery': tquery, 'tuser': tuser})


def acceptRequest(request, pk=None, userid=None):
    y = User.objects.get(pk=userid)
    ChatRequest.objects.filter(pk=pk).update(expert = y, status = "Accepted")
    return JsonResponse({'data':'Accepted'})

@csrf_exempt
def doChat(request):
    chat = User_Chat.objects.create(chat = request.POST['chat'],
        expert = User.objects.get(pk=request.POST['expert']),
        client = Client.objects.get(pk=request.POST['client']),
        type = request.POST['type']
    );
    chat.save()
    #chat=hi&expert=1&client=84&type=expert
    return HttpResponse('success')

    #ChatRequest.objects.count()
    #User_Chat.objects.filter(type='client').count()
    #User.objects.count()

class ShowLocation(generics.ListAPIView):
    queryset = Locations.objects.all()
    serializer_class = LocationSerializer

@csrf_exempt
def destroyChatRequest(request, client=None):
    c = Client.objects.get(pk=client)
    ChatRequest.objects.filter(client=c).update(status = 'Expired')

    chats = User_Chat.objects.filter(client=c)
    allchats = "";
    cemail = chats[0].email
    for cc in chats:
        if cc.type=="client":
            allchats += cc.client.name+": "+cc.chat+"\n"
        elif cc.type=="expert":
            allchats += cc.expert.username+": "+cc.chat+"\n"
    send_mail('Harpreet Ford',
            'Thanks to connecting with us.\n\n You Conversesion is here: \n '+allchats,
            'skshorya@gmail.com',
            ['kaushikprateek11@gmail.com']
    )

    return HttpResponse('Expired')
