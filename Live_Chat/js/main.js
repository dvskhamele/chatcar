$(document).ready(function() {
  var contactName = "";
  var client_id = "";
  var expert_id = "";
  var chatrequest = 0;
  var chatcount = 0;
  var myVar;
  var botrply_start = '<p style="text-align: left;" class="card-text"><img src="icons/my-passport-size-pic..jpg" />';
  var botrply_mid = '<div class="chatbot">';

  var botrply_choice_start = '<p style="text-align: left;" class="card-text choice-menu"><img src="icons/my-passport-size-pic..jpg" />';
  var botrply_choice_mid = '<div class="chatbot choice-menu">';

  var botrply_end = '</div></p>';

  var user_start = '<p style="text-align: right;margin-top: 30px !important;" class="card-text"><span class="user">';
  var user_stop = '</span></p>';
  var audio = new Audio('sound/towards.mp3');
  var muteflg = 1;

  $("#sound").click(function(){
    //console.log(muteflg);
    if(muteflg==1){
      $('.fa-volume-up').fadeToggle();
    }else if(muteflg==0){
      $('.fa-volume-mute').fadeToggle();
    }
  });

  $('.fa-volume-up').click(function(){
    $(this).fadeOut();
    muteflg = 0;
    $('.fa-volume-mute').fadeIn();
  });

  $('.fa-volume-mute').click(function(){
    $(this).fadeOut();
    muteflg = 1;
    //console.log(muteflg);
    $('.fa-volume-up').fadeIn();
  });

  $(".mobile-icon").click(function(){
      $(this).hide();
      $('.chatbox').show(500);
  });

  $('#close-chatbox').click(function(){
    $('.chatbox').hide(500);
    $(".mobile-icon").show();
  });

  contact_flg_1 = 0;
  $("#contact_name").focusout(function() {
    if($(this).val().length>4){
      contact_flg_1 = 0;
      $("#contact_name").removeClass('is-invalid');
      $("#contact_name").addClass('is-valid');
    }
    else {
      contact_flg_1 = 1;
      $("#contact_name").removeClass('is-valid');
      $("#contact_name").addClass('is-invalid');
    }

  });
  contact_flg_2 = 0;
  $("#contact_email").focusout(function() {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    x = regex.test($(this).val());
    if(x){
      contact_flg_2 = 0;
      $("#contact_email").removeClass('is-invalid');
      $("#contact_email").addClass('is-valid');
    }
    else {
      contact_flg_2 = 1;
      $("#contact_email").removeClass('is-valid');
      $("#contact_email").addClass('is-invalid');
    }

  });

  contact_flg_3 = 0;
  $("#contact_mobile").focusout(function() {
    var a = $(this).val();
    var filter = /^[0-9+]+$/;
    l = a.length;
    //console.log(filter.test(a));
    if (filter.test(a) && l==10) {
        contact_flg_3 = 0;
        $("#contact_mobile").removeClass('is-invalid');
        $("#contact_mobile").addClass('is-valid');
    }
    else {
        contact_flg_3 = 1;
        $("#contact_mobile").removeClass('is-valid');
        $("#contact_mobile").addClass('is-invalid');
    }
  });
loadCategories();

  $("#userform").submit(function(){
    cate = $('#categories').val();
    contactName = $("#contact_name").val();
    var contactEmail = $("#contact_email").val();
    var contactMob = $("#contact_mobile").val();
    //After Submission Validation
    if (contact_flg_1==0 && contact_flg_2==0 && contact_flg_3==0){
      $.post('https://harpreetford.herokuapp.com/client/v1/users', {"name": contactName, "mobile": contactMob, "email": contactEmail}, function(data, status){
        //console.log(status);
        if (status=="success"){
          client_id = data.id;

          $('#userform').hide();

          $('.msg-box').append(botrply_start + getCurrTime() + botrply_mid +"Hello, "+contactName+ botrply_end);
          playAudio(audio, muteflg);
          Divscroll();

          setTimeout(function(){
            $('.msg-box').append(botrply_start + getCurrTime() + botrply_mid +"Welcome to Harpreet Ford, One of the Leading Ford Dealer of Delhi NCR. We deal in Ford New Cars, Ford Car Service, Harpreet Ford Used Cars and Insurance."+ botrply_end);
            playAudio(audio, muteflg);
            Divscroll();
          },1500);

          setTimeout(function(){
            $('.msg-box').append(botrply_choice_start + getCurrTime() + botrply_choice_mid +"Please choose from the categories as below."+ botrply_end);
            playAudio(audio, muteflg);
            Divscroll();
          },3000);

          setTimeout(function(){
            $('.msg-box').append(botrply_start + getCurrTime() + "<div class='chatbot choice'>" + cate + botrply_end);
            playAudio(audio, muteflg);
            Divscroll();
          },5000);
        }else{
          alert('server error. please try again after some time.');
        }

      });
    }else{
      alert('Please fill correct details');
    }
    return false;
  });

  $("body").on('click', '.chatoptions', function(){
    var choice = $(this).text();
    $('.chatoptions').addClass('chatoptions1');
    $('.chatoptions1').removeClass('chatoptions');
    //console.log(client_id);
    $.post('https://harpreetford.herokuapp.com/client/v1/chatrequest', {'client': client_id, 'requestdata':choice}, function(data, status){
      //console.log(data.id);
      myVar = setInterval(function(){
        $.get('https://harpreetford.herokuapp.com/client/v1/detailchatrequest/'+data.id, function(data){
          console.log(data);
          if(data.status=="Accepted"){
            expert_id = data.expert;
            clearInterval(myVar);
            $("#send-msg").fadeIn();
            $('.msg-box').empty();
            $('.msg-box').append(botrply_start + getCurrTime() + botrply_mid +"You are Connected with "+ data.expert_name + botrply_end);
            playAudio(audio, muteflg);
            Divscroll();
            setInterval(function(){
              displayChat(expert_id, client_id, user_start, user_stop, botrply_start, botrply_mid, botrply_end, audio, muteflg);
            },2000);
          }
        });
      }, 2000);
      $('.msg-box').delay(2000).queue(function (next) {
        $('.msg-box').append(botrply_start + getCurrTime() + botrply_mid +"You choose "+choice + botrply_end);
        playAudio(audio, muteflg);
        Divscroll();
        next();
      });

      $('.msg-box').delay(2000).queue(function (next) {
        $('.msg-box').append(botrply_start + getCurrTime() + botrply_mid +"Please Wait..."+ botrply_end);
        playAudio(audio, muteflg);
        Divscroll();
        next();
      });
    });

  });

  $("#send-msg").keypress(function(event){
    if (event.keyCode==13){
        var txt = $(this).val();
        if(txt.length>1){
          $(this).val("");
      //    $('.msg-box').append(user_start + txt + user_stop);
          Divscroll();
        //  setInterval(function(){
          $.post('https://harpreetford.herokuapp.com/client/v1/createchat', {"chat": txt,"expert": expert_id,"client": client_id, "type":"client"}, function(data, status){
            if(status=="success"){

            }
          });
        }
    }
  });

  $("body").on('click', '.badge', function(){
    var choice = $(this).text();
    var batchid = $(this).attr('batchid');
    //console.log(choice);
    $.post('https://harpreetford.herokuapp.com/client/v1/tag', {name: choice},function(data){
      //console.log("work");
    });
    $('.msg-box').append(user_start + choice + user_stop);
    Divscroll();
    reply(batchid, botrply_start, botrply_mid, botrply_end, botrply_choice_start, botrply_choice_mid, audio, muteflg);
    //console.log(flg);
  });

  $("body").on('click', '#backchoice', function(){
    var choice = $(this).text();
    $('.choice').remove();
    $('.choice-menu').remove();
    $('.chatoptions1').addClass('chatoptions');
    $('.chatoptions').removeClass('chatoptions1');
    $('.msg-box').delay(1500).queue(function (next) {

      $('.msg-box').append(botrply_start + getCurrTime() + "<div class='chatbot choice'>" + cate + botrply_end);
      playAudio(audio, muteflg);
      Divscroll();
      next();
    });
  });


});

function displayChat(expert_id, client_id, user_start, user_stop, botrply_start, botrply_mid, botrply_end){
  $.get('https://harpreetford.herokuapp.com/client/v1/chat/'+expert_id+'/'+client_id, function(data){
    //console.log(data);
    var allchat = "";
    var chat_id = $('#chat_id').val();
    console.log(chat_id);
    $('#chat_id').val(data.length);
    for(c=chat_id;c<data.length;c++){
      if(data[c].type=="client"){
        allchat += user_start + data[c].chat + user_stop;
      }else if(data[c].type=="expert"){
        allchat += botrply_start + convertDate(data[c].cdate) + botrply_mid + data[c].chat + botrply_end;
      }
      $('.msg-box').append(allchat);
    Divscroll();
  }
  });
}


function convertDate(date){
  date = date.split('T0');
  time = date[1].split('.');
  time = time[0].split(':')
  var s = "";
  if (time[0]>12){
    s = "PM";
    h = time[0]-12;
  }else{
    s = "AM";
  }
  return time[0]+":"+time[1]+" "+s;
}


function getCurrTime(){
  var date = new Date();
  var h = date.getHours();
  var m = date.getMinutes();
  m = m+"";
  if(m.length==1){
    m = "0"+m;
  }
  var s = "";
  if (h>12){
    s = "PM";
    h = h-12;
  }else{
    s = "AM";
  }
  return h+":"+m+" "+s
}

function Divscroll(){
  var msgDiv = document.getElementsByClassName("msg-box")[0];
      msgDiv.scrollTop = msgDiv.scrollHeight;
}

function playAudio(audio, muteflg){
  if(muteflg==1){
    audio.play();
  }
}

function loadCategories(){
  var str = "";
  $.get("https://harpreetford.herokuapp.com/client/v1/botmsgs/", function(data){
    $.each( data, function( key, value ) {
      str += '<span class="badge badge-light" batchid="'+value.id+'">' + value.msg + '</span>';
    });
    $('#categories').val(str);
  });

  return str;
}

function reply(batchid, botrply_start, botrply_mid, botrply_end, botrply_choice_start, botrply_choice_mid, audio, muteflg){
  $.get('https://harpreetford.herokuapp.com/client/v1/botmsgsdetail/'+batchid, function(data){
    console.log(data);
    $.each( data, function( key, value ) {
      $('.msg-box').delay(1500).queue(function (next) {
        $(this).append(botrply_start + getCurrTime() + botrply_mid + value.descrip + botrply_end);
        playAudio(audio, muteflg);
        Divscroll();
        next();
      });
    });
    $('.msg-box').delay(2000).queue(function (next) {
      $(this).append(botrply_choice_start + getCurrTime() + botrply_choice_mid + "<a id='backchoice' href='#'>Back to Choice</a>" + botrply_end);
      playAudio(audio, muteflg);
      Divscroll();
      next();
    });
  });
}
