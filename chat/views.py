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

class CreateTag(generics.CreateAPIView):
    queryset = Tags.objects.all()
    serializer_class = TagSerializer

class CreateChatRequest(generics.CreateAPIView):
    queryset = ChatRequest.objects.all()
    serializer_class = ChatRequestSerializer

class CreateClient(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = ClientSerializer

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
                return HttpResponse("Your account was inactive.")
        else:
            print("Someone tried to login and failed.")
            print("They used username: {} and password: {}".format(username,password))
            return HttpResponse("Invalid login details given")
    else:
        return render(request, 'login.html')

@login_required(login_url='../')
def user_logout(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

@login_required(login_url='../')
def dashboard(request):
    return render(request, 'index.html')

#@login_required(login_url='../')
def taglist(request):
    tags = Tags.objects.all()
    taglists = []
    for t in tags:
        taglists.append(t.name)

    taglist_unique = list(set(taglists))
    tagcount = []
    for t in taglist_unique:
        tagcount.append(taglists.count(t))
    return JsonResponse({'tags':taglist_unique,'count':tagcount, 'countsum': sum(tagcount)})


def acceptRequest(request, pk=None, userid=None):
    x = ChatRequest.objects.get(pk=pk)
    y = User.objects.get(pk=userid)
    x.expert = y
    x.status = "Accepted"
    x.save()
    return JsonResponse({'data':'Accepted'})
