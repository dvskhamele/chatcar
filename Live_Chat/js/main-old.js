$(document).ready(function() {
  var contactName = "";
  var client_id = "";
  var expert_id = "";
  var chatrequest = 0;
  var chatcount = 0;
  var myVar;
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

  $("#userform").submit(function(){
    cate = loadCategories();
    contactName = $("#contact_name").val();
    var contactEmail = $("#contact_email").val();
    var contactMob = $("#contact_mobile").val();
    //After Submission Validation
    if (contact_flg_1==0 && contact_flg_2==0 && contact_flg_3==0){
      $.post('http://ec2-13-233-243-191.ap-south-1.compute.amazonaws.com:82/client/v1/users/', {"name": contactName, "mobile": contactMob, "email": contactEmail}, function(data, status){
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

  $("#send-msg").keypress(function(event){
    if (event.keyCode==13){
        var txt = $(this).val();
        if(txt.length>1){
          $(this).val("");
      //    $('.msg-box').append(user_start + txt + user_stop);
          Divscroll();
        //  setInterval(function(){
          $.post('http://ec2-13-233-243-191.ap-south-1.compute.amazonaws.com:82/client/v1/createchat/', {"chat": txt,"expert": expert_id,"client": client_id, "type":"client"}, function(data, status){
            if(status=="success"){

            }
          });
        }
    }
  });

  $("body").on('click', '.badge', function(){
    var choice = $(this).text();
    //console.log(choice);
    $.post('http://ec2-13-233-243-191.ap-south-1.compute.amazonaws.com:82/client/v1/tag/', {name: choice},function(data){
      //console.log("work");
    });
    $('.msg-box').append(user_start + choice + user_stop);
    Divscroll();
    flg = reply(choice, botrply_start, botrply_mid, botrply_end, botrply_choice_start, botrply_choice_mid, audio, muteflg);
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

  $("body").on('click', '.chatoptions', function(){
    var choice = $(this).text();
    $('.chatoptions').addClass('chatoptions1');
    $('.chatoptions1').removeClass('chatoptions');
    //console.log(client_id);
    $.post('http://ec2-13-233-243-191.ap-south-1.compute.amazonaws.com:82/client/v1/chatrequest/', {'client': client_id, 'requestdata':choice}, function(data, status){
      //console.log(data.id);
      myVar = setInterval(function(){
        $.get('http://ec2-13-233-243-191.ap-south-1.compute.amazonaws.com:82/client/v1/detailchatrequest/'+data.id, function(data){
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
});

function displayChat(expert_id, client_id, user_start, user_stop, botrply_start, botrply_mid, botrply_end){
  $.get('http://ec2-13-233-243-191.ap-south-1.compute.amazonaws.com:82/client/v1/chat/'+expert_id+'/'+client_id, function(data){
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

function loadJsonFiles(){
  /*data = '{"0":{"name":"New Car","cate":[{"0":"Explore New Cars. Click to go the page of the page of <a href=\'https://www.harpreetford.com/ford-ecosport\'>Ecosport</a>, <a href=\'https://www.harpreetford.com/ford-new-ecosport\'>New EcoSport</a>, <a href=\'https://www.harpreetford.com/ford-aspire\'>new aspire</a>, <a href=\'https://www.harpreetford.com/ford-new-freestyle\'>aspire Freestyle</a>, <a href=\'https://www.harpreetford.com/ford-mustang\'>Mustang</a>, <a href=\'https://www.harpreetford.com/ford-figo\'>Figo</a>, <a href=\'https://www.harpreetford.com/ford-endeavour\'>Endeavor</a> etc."}]},"1":{"name":"Used Car","cate":[{"0":"Choose the best used car in budget from any brand. Explore Pre-owned cars section to <a href=\'http://tsgcarbazar.com/\'>click here</a>."}]},"2":{"name":"Car Service","cate":[{"0":"Do you want to book car service? Book Car service online, <a href=\'https://www.harpreetford.com/bookservice\'>click to book car service here</a>."},{"1":"Explore the Car Service Package. <a href=\'https://www.harpreetford.com/hfcare\'>HF Care</a>, <a href=\'https://www.harpreetford.com/lmc\'>Love my car</a>."}]},"3":{"name":"Insurance","cate":[{"0":"Book Car Insurance in a Minute or renew car insurance just filling the sign up form. <a href=\'https://www.harpreetford.com/insurance\'>Sign up now.</a>"}]},"4":{"name":"Car Acessories","cate":[{"0":"Explore our car accessories and service packages like VAS, VDS, <a href=\'https://www.harpreetford.com/hfcare\'>HF Care</a> AND SO ON. Want to know more <a href=\'#\'>click here</a>"}]},"5":{"name":"Book a Test Drive","cate":[{"0":"Book Test Drive at your nearest Location. Our Showrooms are at Motinagar, Infocity, MG Road, Dilshad Gardner and Prashant Vihar Rohini. <a href=\'https://www.harpreetford.com/test-drive\'>Book a Test drive now</a>"}]},"6":{"name":"Book a Service","cate":[{"0":"no data"}]},"8":{"name":"Sales Location","cate":[{"0":"Motinagar.Prashan Vihar.Dilshad Garden.MG Road. InfoCity Gurgaon"}]},"9":{"name":"Service Location","cate":[{"0":"Motinagar.Infocity.Sahibabad.Okhla.Jahangirpuri <a href=\'https://www.harpreetford.com/locations\'>view locations.</a>"}]},"10":{"name":"Sales & Service","cate":[{"0":"Sales: Motinagar.Prashan Vihar.Dilshad Garden.MG Road. InfoCity Gurgaon <br/> Service: Motinagar.Infocity.Sahibabad.Okhla.Jahangirpuri"}]},"11":{"name":"Read our Blog","cate":[{"0":"Explore more at our official blog where we keep sharing live happenings and trends with ford cars and service. <a href=\'http://harpreetford.com/blog/\'>Read more</a>"}]},"12":{"name":"Talk to us","cate":[{"0":"Please call <a href=\'tel:9560959906\'>9560959906</a>, to talk our expert"}]}}';
*/
  data = '{"0":{"name":"New Car","cate":[{"0":"Explore New Cars. Click to go the page of the page of <a target=\'_blank\' href=\'https://www.harpreetford.com/ford-ecosport\'>Ecosport</a>, <a target=\'_blank\' href=\'https://www.harpreetford.com/ford-new-ecosport\'>New EcoSport</a>, <a target=\'_blank\' href=\'https://www.harpreetford.com/ford-aspire\'>new aspire</a>, <a href=\'https://www.harpreetford.com/ford-new-freestyle\'>aspire Freestyle</a>, <a href=\'https://www.harpreetford.com/ford-mustang\'>Mustang</a>, <a target=\'_blank\'  href=\'https://www.harpreetford.com/ford-figo\'>Figo</a>, <a target=\'_blank\' href=\'https://www.harpreetford.com/ford-endeavour\'>Endeavor</a> etc."}]},"1":{"name":"Used Car","cate":[{"0":"Choose the best used car in budget from any brand. Explore Pre-owned cars section to <a target=\'_blank\' href=\'http://tsgcarbazar.com/\'>click here</a>."}]},"2":{"name":"Car Service","cate":[{"0":"Do you want to book car service? Book Car service online, <a target=\'_blank\' href=\'https://www.harpreetford.com/bookservice\'>click to book car service here</a>."},{"1":"Explore the Car Service Package. <a target=\'_blank\' href=\'https://www.harpreetford.com/hfcare\'>HF Care</a>, <a href=\'https://www.harpreetford.com/lmc\'>Love my car</a>."}]},"3":{"name":"Insurance","cate":[{"0":"Book Car Insurance in a Minute or renew car insurance just filling the sign up form. <a target=\'_blank\' href=\'https://www.harpreetford.com/insurance\'>Sign up now.</a>"}]},"4":{"name":"Car Acessories","cate":[{"0":"Explore our car accessories and service packages like VAS, VDS, <a target=\'_blank\' href=\'https://www.harpreetford.com/hfcare\'>HF Care</a> AND SO ON. Want to know more <a target=\'_blank\' href=\'#\'>click here</a>"}]},"5":{"name":"Book a Test Drive","cate":[{"0":"Book Test Drive at your nearest Location. Our Showrooms are at Motinagar, Infocity, MG Road, Dilshad Gardner and Prashant Vihar Rohini. <a target=\'_blank\' href=\'https://www.harpreetford.com/test-drive\'>Book a Test drive now</a>"}]},"6":{"name":"Book a Service","cate":[{"0":"no data"}]},"8":{"name":"Sales Location","cate":[{"0":"Motinagar.Prashan Vihar.Dilshad Garden.MG Road. InfoCity Gurgaon"}]},"9":{"name":"Service Location","cate":[{"0":"Motinagar.Infocity.Sahibabad.Okhla.Jahangirpuri <a target=\'_blank\' href=\'https://www.harpreetford.com/locations\'>view locations.</a>"}]},"10":{"name":"Sales & Service","cate":[{"0":"Sales: Motinagar.Prashan Vihar.Dilshad Garden.MG Road. InfoCity Gurgaon <br/> Service: Motinagar.Infocity.Sahibabad.Okhla.Jahangirpuri"}]},"11":{"name":"Read our Blog","cate":[{"0":"Explore more at our official blog where we keep sharing live happenings and trends with ford cars and service. <a target=\'_blank\' href=\'http://harpreetford.com/blog/\'>Read more</a>"}]},"12":{"name":"Talk to us","cate":[{"0":"Please Choose Below <br/> <a class=\'chatoptions btn btn-primary\' style=\'margin-bottom:3px;\' href=#>Sales</a> <a class=\'chatoptions btn btn-primary\' style=\'margin-bottom:3px;\' href=#>Service</a> <a class=\'chatoptions btn btn-primary\' style=\'margin-bottom:3px;\' href=#>Insurance</a> <a class=\'chatoptions btn btn-primary\' style=\'margin-bottom:3px;\' href=#>Other</a>"}]}}';
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

function loadCategories(){
  var cate_span_start = '<span class="badge badge-light">';
  var cate_span_end = '</span>';
  var str = "";
  $.each( obj, function( key, value ) {
    str += cate_span_start + value.name + cate_span_end;
  });
  return str;
}

function reply(choice, botrply_start, botrply_mid, botrply_end, botrply_choice_start, botrply_choice_mid, audio, muteflg){
  flg = 0;
  $.each( obj, function( key, value ) {
    //console.log(value.name);
    if(value.name==choice){
      cht = value.name;
      flg=1;
      $.each( value.cate, function( key, value ) {
        $('.msg-box').delay(1500).queue(function (next) {
          if(cht=="Talk to us"){
            $(this).append(botrply_start + getCurrTime() + botrply_mid + value[key] + botrply_end);
          }else{
            $(this).append(botrply_start + getCurrTime() + botrply_mid + value[key] + botrply_end);
          }
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
    }
  });
  return flg;
}

function customReply(choice, botrply_start, botrply_mid, botrply_end, audio){
//bag of words
}

function playAudio(audio, muteflg){
  if(muteflg==1){
    audio.play();
  }
}
