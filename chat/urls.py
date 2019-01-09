from django.urls import path
from . import views

urlpatterns = [
    path('client/v1/botmsgs/', views.BotChatMsgs.as_view()),
    path('client/v1/botmsgsdetail/<int:pk>', views.BotChatMsgsDetail.as_view()),
    path('client/v1/tag/', views.CreateTag.as_view()),
    path('client/v1/taglist/', views.taglist),
    path('client/v1/users/', views.CreateClient.as_view()),
    path('client/v1/chatrequest/', views.CreateChatRequest.as_view()),
    path('client/v1/displaychatrequest/', views.DisplayChatRequest.as_view()),
    path('client/v1/detailchatrequest/<int:pk>', views.DetailChatRequest.as_view()),
    path('client/v1/createchat/', views.CreateChat.as_view()),
    path('client/v1/chat/<int:c1>/<int:c2>', views.DisplayChat.as_view()),
    path('client/v1/locations/', views.ShowLocation.as_view()),

    path('', views.index, name="index"),
    path('dashboard/', views.dashboard, name="dashboard"),
    path('client/', views.clientDetails, name="client"),
    path('chatHistory/', views.chatHistory),

    path('user_logout/', views.user_logout, name="logout"),
    path('acceptRequest/<int:pk>/<int:userid>', views.acceptRequest, name="acceptRequest"),
    path('client/v1/dochat/', views.doChat),
    path('client/v1/endsession/<int:client>', views.destroyChatRequest),
]
