$(document).foundation();

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

    var phone = null;
    if ($.trim($("#phone").val())) {
        if ($("#phone").intlTelInput("isValidNumber")) {
            var phone = $("#phone").intlTelInput("getNumber");
        }
        else {
            $('.alerts').css('display', 'block').html('Vous devez saisir un numéro de téléphone Français');
            return false;
        }
    }

    $.ajax({
        type: 'POST',
        url : '', // AJOUTER L'URL DU SCRIPT
        data: {
            firstname : firstname,
            lastname : lastname,
            email : email,
            phone : phone
        },
        success : function(result) {
            $('.form-destroy').remove();
            $('.form-title').after($('<div />').addClass('helvetica font-18 text-center').html('<b>MERCI D’AVOIR SIGNÉ NOTRE PÉTITION !<br class="hide-for-medium" />MERCI DE PARTAGER.<b><br />Un grand merci pour votre soutien aux réfugiés.<br /><b>Plus nous serons nombreux, plus nous aurons de force.</b>'));
            $('.center').height('448px').css('padding', '80px 0').css('backgroundImage', 'url("../img/bg-center2.jpg")');
            $('.center .vertical-center').removeClass('vertical-center');
            $('html, body').animate({scrollTop: $('.center').offset().top});
        },
        failure: function() {
            $('.alerts').css('display', 'block').html('Une erreur est survenue');
        }
    })
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
    $("#phone").intlTelInput({
        utilsScript: 'js/utils.js',
        onlyCountries: ['fr'],
        allowDropdown: false
    });
});
