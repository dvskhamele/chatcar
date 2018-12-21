$(document).ready(function() {
  var contactName = "";
  var obj = loadJsonFiles();
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
    console.log(muteflg);
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
    console.log(muteflg);
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

  $("#userform").submit(function(){
    cate = loadCategories();

      $('.msg-box').append(botrply_start + getCurrTime() + botrply_mid +"Hello, "+contactName+ botrply_end);
      playAudio(audio, muteflg);
      Divscroll();

    return false;
  });
/*
  $("#send-msg").keypress(function(event){
    if (event.keyCode==13){
        var txt = $(this).val();
        if(txt.length>1){
          $(this).val("");
          $('.msg-box').append(user_start + txt + user_stop);
          Divscroll();
          flg = reply(txt, botrply_start, botrply_mid, botrply_end, audio);
          if(flg==0){
            setTimeout(function(){
              $('.msg-box').append(botrply_start + getCurrTime() + botrply_mid +"text is not recognized."+ botrply_end);
              playAudio(audio, muteflg);
              Divscroll();
            },1000);
          }
        }
    }
  });
*/
});

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

function loadJsonFiles(){
  obj = JSON.parse(data);
  loadCategories();

  return obj;
}
/*
function loadJsonFiles(){
  $.post("js/categories.txt", function(data){
    obj = JSON.parse(data);
    //console.log(obj);
    loadCategories();
  });
}*/


function customReply(choice, botrply_start, botrply_mid, botrply_end, audio){
//bag of words
}

function playAudio(audio, muteflg){
  if(muteflg==1){
    audio.play();
  }
}
