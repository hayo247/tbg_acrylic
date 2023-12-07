$(function(){
    fn_setColor();
	$("#c_market").val(getParameter("to"));
    
    $("[name='design']").on('click', function(){
        $("[name='design']").each(function(){
            var val = $(this).val();
            if($(this).is(':checked')){
                $("#sample").addClass(val);

                $("#" + val).show();
                $("." + val).show();
                
            } else{
                $("#sample").removeClass(val);

                $("#" + val).hide();
                $("." + val).hide();
            }
        });
        
        if($("[name='design']:checked").length == 0){
            fn_layerPop($("#alertPopup"), "최소 1개는 선택해야합니다.");

            $("[name='design']").each(function(){ 
                var val = $(this).val();
                $(this).prop('checked', true);
                $("#sample").addClass(val);
                $("#" + val).show();
                $("." + val).show();
            });
        }
    });

    $("[name='acrylicColor']").on('click', function(){
        $(".color-select").hide();
        $("." + $(this).val() ).show();

        if($(this).val() == "twocolor"){
            $(".shape").css('background', 'linear-gradient(to bottom,' + $("#acrylicColor-picker").val() + ',' + $("#acrylicColor-picker2").val() + ')');
        } else if($(this).val() == "color"){
            $(".shape").css('background', $("#acrylicColor-picker").val());
        } else{
            $(".shape").css('background', "#d3d3d3");
        }    
    });
    
    $("#logoStyle").on('change', function(){
        var obw = $("#logoStyle option:checked").data('color');
        
        if("O" == obw){
            $('.logoColorArea').hide();
        } else{
            $(".logoColor").hide();
            if(0 <= obw.indexOf('O')){
                $('.O').show();
            }
            if(0 <= obw.indexOf('B')){
                $('.B').show();
            }
            if(0 <= obw.indexOf('W')){
                $('.W').show();
            }

            $('.logoColorArea').show();
        }
        $("#logoColor1").prop('checked', true);
        fn_setLogoImg();
    });

    $("[name='logoColor']").on('click', function(){
        fn_setLogoImg();
    });

    $("#fontStyle").on('change', function(){
        $("#shape").removeClass();
        $("#shape").addClass('shape ' + $(this).val());
    });
    
    $("#wordsEdit").on('keyup', function(){
        if($(this).val().length > 0){
            $("#words").html($(this).val().substr(0,15));            
        } else{
            $("#words").html("문구는 최대 15자입니다.");
        }
    });

    $("#numEdit").on('keyup', function(){
        if($(this).val().length > 0){
            $(this).val($(this).val().replace(/[^0-9]/g, ''));
            $("#number").html(format_phonnum($(this).val()));
        } else{
            $("#number").html("010-1234-5678");
        }
    });
    
    $("[name='take']").on('click', function(){
        if("email" == $(this).val()){
            $("#email").show();
        }else{
            $("#email").hide();            
        }
    });
    
    $("#btnSend").on('click', function(){
        fn_validation();
    });
});

function fn_setColor(){
    let colorPicker;
    let colorPicker2;
    let colorPicker3;
    
    colorPicker = document.querySelector("#acrylicColor-picker");
    colorPicker.addEventListener("input", updateFirst, false);
    colorPicker.addEventListener("change", updateAll, false);
    colorPicker.select();

    colorPicker2 = document.querySelector("#acrylicColor-picker2");
    colorPicker2.addEventListener("input", updateFirst2, false);
    colorPicker2.addEventListener("change", updateAll2, false);
    colorPicker2.select();

    colorPicker3 = document.querySelector("#fontColor-picker");
    colorPicker3.addEventListener("input", updateFirst3, false);
    colorPicker3.addEventListener("change", updateAll3, false);
    colorPicker3.select();
}

function updateFirst(event) {
    if($("[name='acrylicColor']:checked").val() == "twocolor"){
        $(".shape").css('background', 'linear-gradient(to bottom,' + event.target.value + ',' + $("#acrylicColor-picker2").val() + ')');
    } else{
        $(".shape").css('background', event.target.value);
    }
}

function updateAll(event) {
    if($("[name='acrylicColor']:checked").val() == "twocolor"){
        $(".shape").css('background', 'linear-gradient(to bottom,' + event.target.value + ',' + $("#acrylicColor-picker2").val() + ')');
    } else{
        $(".shape").css('background', event.target.value);
    }
}

function updateFirst2(event) {
    $(".shape").css('background', 'linear-gradient(to bottom, ' + $("#acrylicColor-picker").val() +', ' + event.target.value+ ')');
}

function updateAll2(event) {
    $(".shape").css('background', 'linear-gradient(to bottom, ' + $("#acrylicColor-picker").val() +', ' + event.target.value+ ')');
}

function updateFirst3(event) {
    $(".area_txt").css('color', event.target.value);
}

function updateAll3(event) {
    $(".area_txt").css('color', event.target.value);
}

function fn_setLogoImg(){
    var imgUrl = "img/";

    imgUrl += $("#logoStyle").val() + '(' + $("[name='logoColor']:checked").val() + ').png';
    
    $("#logoImg").attr('src', imgUrl);
}

function fn_validation(){
    if(!($("#design2").is(":checked") || $("#design3").is(":checked"))){        
        fn_layerPop($("#alertPopup"), "문구 또는 번호는 선택을 해야합니다.");
        return;
    }

    if($("#design2").is(":checked") && $("#wordsEdit").val() == ""){
        fn_layerPop($("#alertPopup"), "문구를 입력하세요.", $("#wordsEdit"));
        return;
    }
    
    if($("#design3").is(":checked") && $("#numEdit").val() == ""){
        fn_layerPop($("#alertPopup"), "번호를 입력하세요.", $("#numEdit"));
        return;
    }
    
    if($("#name").val() == ""){
        fn_layerPop($("#alertPopup"), "수취인명을 입력하세요.", $("#name"));
        return;
    }

    if($("[name='take']:checked").val() == "email" && $("#email").val() == ""){
        fn_layerPop($("#alertPopup"), "이메일을 입력하세요.", $("#email"));
        return;
    }
    
    if(!$("#agree_privacy").is(":checked")){
        fn_layerPop($("#alertPopup"), "개인정보 취급방침에 동의해주세요.", $("#agree_privacy"));
        return;
    }

    fn_setForm();
}

function fn_setForm(){
    var design = "";
    $("[name='design']").each(function(){
        if($(this).is(':checked')){
            if("" != design){
                design += "+";
            }
            design += $(this).data('nm');
        }
    });
    $("#c_design").val(design);

    var acrylicColor = $("[name='acrylicColor']:checked").data('nm');

    if("단색" == acrylicColor){
        acrylicColor += "(" + $("#acrylicColor-picker").val() + ")";
    }else if("투톤" == acrylicColor){
        acrylicColor += "(" + $("#acrylicColor-picker").val() + ","+ $("#acrylicColor-picker2").val() + ")";
    }
    $("#c_acrylicColor").val(acrylicColor);
    
    $("#c_acrylicStyle").val($("#shape").attr('style'));

    $("#c_class").val($("#sample").prop('class') );
    $("#c_logo").val($("#logoStyle").val() + '(' + $("[name='logoColor']:checked").val() + ')');
    $("#c_font").val($("#fontStyle option:checked").text());
    $("#c_fontColor").val($("#fontColor-picker").val());
    $("#c_fontA").val($("#c_font").val() + "(" + $("#c_fontColor").val() + ")");

    
    if(!$("#design1").prop('checked')){
        $("#c_logo").val("");
    }else{
        $("#c_logo").val($("#logoStyle").val() + '(' + $("[name='logoColor']:checked").val() + ')');
    }

    if(!$("#design2").prop('checked')){
        $("#c_number").val("");
    }else{
        $("#c_words").val($("#wordsEdit").val());
    }

    if(!$("#design3").prop('checked')){
        $("#c_number").val("");
    }else{
        $("#c_number").val($("#number").text());
    }

    html2canvas($('#shape')[0]).then(function(canvas){
        $("#c_img").val(canvas.toDataURL('image/png'));

        if($("[name='take']:checked").val() == "email"){
            fn_sendEmail();
        } else{
            fn_saveImg();
        }
    });
}

function fn_saveImg(){
    $(".c_name").text($("#name").val());
    $(".c_market").text($("#c_market").val());

    $("#c_sample").prop('class', $("#sample").prop('class').replace('mo ', ''));
    $("#c_shape").prop('class', $("#shape").prop('class'));

    $(".c_design").text($("#c_design").val());
    $(".c_acrylicColor").text($("#c_acrylicColor").val());
    $(".c_logo").text($("#c_logo").val());
    $(".c_fontA").text($("#c_fontA").val());
    
    if(!$("#design1").prop('checked')){
        $(".c_area_img").hide();
    }else{
        $(".c_area_img").show();
        $("#c_logoImg").prop('src', $("#logoImg").prop('src'));
    }

    if(!$("#design2").prop('checked')){
        $(".c_words").hide();
    }else{
        $(".c_words").show();
        $(".c_words").text($("#c_words").val());
    }

    if(!$("#design3").prop('checked')){
        $(".c_number").hide();
    }else{
        $(".c_number").show();
        $(".c_number").text($("#c_number").val());
    }
    $("#c_sample").show();

	fn_downloadImg('saveImgForm', "주차번호판견적서");
    fn_sendEmail();
}

function fn_sendEmail(){	
    $("#loadingPopup").show();
	var queryString = $("form[name=emailfrm]").serialize() ;
	
	$.ajax({
		data : queryString,
		type : 'post',
		url : 'https://script.google.com/macros/s/AKfycbyVtLvC2m2QCGXgY0S2Bsnk_ZgR9UA_z8PRDxLoF-4m2YkmKEoexbrQ3ZpRDzaxFGSM/exec',
		dataType : 'json',
		error: function(xhr, status, error){
			fn_layerPop($("#layer_alert"), error);
		},
		success : function(result){
			$("#loadingPopup").hide();
			if(result.result == "error"){
				fn_layerPop($("#alertPopup"), result.error.message);		
			}else{
				fn_layerPop($("#alertPopup"), "견적서가 정상 발송되었습니다.");	
			}
		}
	});
}
