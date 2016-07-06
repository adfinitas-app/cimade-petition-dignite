$(document).foundation();

/*
 * Debut de la lib
*/

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i=0; i<ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
  }
  return "";
}
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}
function makeCorsRequest(data, success, error) {
  var url = 'https://form-to-db.herokuapp.com/';
  var body = JSON.stringify(data);
  var xhr = createCORSRequest('POST', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }
  xhr.setRequestHeader('Content-Type', 'application/json');
  // Response handlers.
  xhr.onload = success;
  // Error Handler
  xhr.onerror = error;
  xhr.send(body);
}

/*
 * Fin de la lib
*/

// Validation et envoi du formulaire
function sendForm() {
    $('.alerts').css('display', 'none').html('');

    var firstname = $('#firstname').val();
    var lastname = $('#lastname').val();
    var email = $('#email').val();

    if(firstname == '' || lastname == '' || email == '') {
        $('.alerts').css('display', 'block').html('Veuillez remplir tous les champs marqués d’une *');
        return false;
    }

    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(email)) {
        $('.alerts').css('display', 'block').html('Vous devez saisir un e-mail valide');
        return false;
    }

    var phone = "";
    if ($.trim($("#phone").val())) {
      if ($("#phone").intlTelInput("isValidNumber")) {
	var phone = $("#phone").intlTelInput("getNumber");
      }
      else {
	$('.alerts').css('display', 'block').html('Vous devez saisir un numéro de téléphone Français');
	return false;
      }
    }

    function pureField(string) {
      return (string.replace(/'/g, "%27").replace(/"/g, "&quot;"));
    }

    var today = new Date();
    data = {
      schema : "cimade_petition_dignite",
      db : {
	"firstname" : pureField(firstname),
	"lastname" : pureField(lastname),
	"email" : pureField(email),
	"phone" : pureField(phone),
	"code_campagne": "JMR16",
	"signin_date": today.toString()
      },
      "woopra" : {
	"host": "lacimade.org",
	"cookie": getCookie("wooTracker"),
	"cv_firstname": pureField(firstname),
	"cv_lastname": pureField(lastname),
	"cv_name": pureField(firstname) + ' ' + pureField(lastname),
	"cv_email": pureField(email),
	"cv_phone": pureField(phone),
	"event": "JMR16",
	"ce_code_campagne": "JMR16",
	"ce_signin_date": today.toString()
      }
    };
    function success() {
        /* tag remontée 1000mercis */
        window._troq = window._troq || [];
        _troq.push(['tagid', '6559240-393784f20019f367cff60ec62e172d2a'],
               ['_rtgpg', 'completedform'],
               ['_rtgconversion', '1'],
               ['_rtgidform', 'cimade_digniterefugies2016']
        );
        (function() {
            if (window._troqck !== 1) {
                var a = document.createElement("script"); a.type = "text/javascript";
                a.async = !0;
                a.src = "//mmtro.com/tro.js";
                var b = document.getElementsByTagName("script")[0];
                b.parentNode.insertBefore(a, b);
            }
       })();
       
      $('.form-destroy').remove();
      $('.form-title').after($('<div />').addClass('helvetica font-18 text-center').html('<b>MERCI D’AVOIR SIGNÉ NOTRE PÉTITION !<br class="hide-for-medium" /> MERCI DE PARTAGER.<b><br />Un grand merci pour votre soutien aux réfugiés.<br /><b>Plus nous serons nombreux, plus nous aurons de force.</b>'));
      $('.center').height('448px').css('padding', '80px 0').css('backgroundImage', 'url("../img/bg-center2.jpg")');
      $('.center .vertical-center').removeClass('vertical-center');
      $('html, body').animate({scrollTop: $('.center').offset().top});
    }

    function error() {
      $('.alerts').css('display', 'block').html('Une erreur est survenue');
    }

    makeCorsRequest(data, success, error);
}

$(function(){
	var isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
	var isIOS = navigator.platform.match(/(iPhone|iPod|iPad)/i)?true:false;

	if(isMac) {
		$('body').addClass('mac');
	}
	else if(isIOS) {
		$('body').addClass('ios');
	}
    
    // Resize d'éléments
    var topSize = screen.width*504/1500;
    if(topSize < 504) {
        topSize = 504;
    }
	$('.top').height(topSize);
    var topSize = screen.width*761/1500;
    if(topSize < 761) {
        topSize = 761;
    }
	$('.center').height(topSize);

    $(window).on('resize', function() {
        var topSize = screen.width*504/1500;
        if(topSize < 504) {
            topSize = 504;
        }
        $('.top').height(topSize);

        if($('.center .vertical-center').length) {
            var topSize = screen.width*761/1500;
            if(topSize < 761) {
                topSize = 761;
            }
            $('.center').height(topSize);
        }
    });

    // Gestion du numéro de téléphone
    $("#phone").ready(function() {
      $("#phone").intlTelInput({
	utilsScript: '/js/utils.js',
	initialCountry: ['fr']
      });
    });
});
