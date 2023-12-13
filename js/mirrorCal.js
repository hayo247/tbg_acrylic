var defImgSrc = "img/mirror/";
var imgSrc = defImgSrc + "사각형.jpg";

$(function(){
	$("#market_name").val(getParameter("to"));
	
	// ================ MO START ======================

	if(isMobile()){
		$("body").addClass('mobile');
	}
	// ================ MO END ======================

    $("#shape").on('change', function(){
		set_img();
	});

    $(".option_size select").on('change', function(){
		set_cal_price();
	});

    $(".option_size input").on('change keyup', function(){
		set_cal_price();
	});

	// 카트 담기
	$("#add_glass_cart").click(function(){
		addCart();
	});
	
	// 카트 내역 삭제
	$("#select_delete_cart").click(function(){
		if($('#mirror_cal_cart > tbody tr').length == 0 ) {
			
            fn_layerPop($("#alertPopup"), "견적서에 상품이 없습니다.");
			return;
		}
		
		if($('#mirror_cal_cart > tbody tr .glasscheck input:checked').length == 0 ) {
            fn_layerPop($("#alertPopup"), "선택된 상품이 없습니다.");
			return;
		}
		del_glass_cart();
	});
	
	$("#all_delete_cart").click(function(){	
		if($('#mirror_cal_cart > tbody tr').length == 0 ) {
            fn_layerPop($("#alertPopup"), "견적서에 상품이 없습니다.");
			return;
		}

		$('#mirror_cal_cart > tbody').html('');
		cal_total_price();
	});

	$("[name='order_type']").click(function(){
		if($(this).val() == "email"){
			$("#email").show();
		}else{
			$("#email").hide();
		}
	})

	// 이메일 보내기
	$("#send_email").click(function(){
		fn_setForm();
	});
})

// 값 초기화
function initStatus(type){
	$("#selected_mirror_img").prop('src', imgSrc);
	$("#width").val("");
	$("#height").val("");
	$("#diameter").val("");
	$("#count").val("1");
	$("#price").val("");	
	$("#shape option:eq(0)").prop('selected', true);
	$("#thickness option:eq(0)").prop('selected', true);
}

function set_img(){
	var src = defImgSrc + $("#shape option:selected").text() + ".jpg";

	$("#selected_mirror_img").prop('src', src);
};

// 금액 계산
function set_cal_price(){
	var cost = mirror_cost[$("#shape").val()][$("#thickness").val()];
	var price = 0;
	
	price = (($("#width").val() * $("#height").val()) / 90000) * cost ;

	if(price < 2000){
		price = 2000;
	}
	price = Math.round(price/100) * 100;
	price = price * $("#count").val();

	$("#price").val(format_num(price));
}


// 거울(물품) 담기
function addCart(){	
	if($('#width').val() == ""){
		fn_layerPop($("#alertPopup"), "가로 값을 입력하세요.", $("#width"));
		return;
	}
	
	if($('#height').val() == ""){
		fn_layerPop($("#alertPopup"), "세로 값을 입력하세요.", $("#height"));
		return;
	}
	
	if($('#count').val() == ""){
		fn_layerPop($("#alertPopup"), "수량을 입력하세요.", $("#count"));
		return;
	}

	var html = "";
	var tot_len = parseInt($('#width').val()) + parseInt($('#height').val());
	var option_deliver = "F";
	var optCnt = 0;
	html = "<tr>";	
	html += "	<input type='hidden' name='index' value='" + $('#mirror_cal_cart > tbody tr').length + "'/>";
	html += "	<input type='hidden' name='shape' value='" + $("#shape option:checked").text() + "'/>";
	html += "	<input type='hidden' name='width' value='" + $('#width').val() + "'/>";
	html += "	<input type='hidden' name='height' value='" + $('#height').val() + "'/>";
	html += "	<input type='hidden' name='thickness' value='" + $("#thickness option:checked").text() + "'/>";
	html += "	<input type='hidden' name='count' value='" + $("#count").val() + "'/>";
	html += "	<input type='hidden' name='price' value='" + $("#price").val() + "'/>";
	
	if($("#shape option:checked").text() == "원형"){		
		if(tot_len > 1800){
			option_deliver = "Y";
		}
		html += "	<input type='hidden' name='deliver' value='" + option_deliver + "'/>";
	}else{
		if(tot_len > 2000){
			option_deliver = "Y";
		}
		html += "	<input type='hidden' name='deliver' value='" + option_deliver + "'/>";
	}
	
	html += "	<td class='glasscheck'>";
	html += "		<input type='checkbox'/>";
	html += "	</td>";
	
	
	if(isMobile() && !$(".fix_head_table thead").is(':visible')){
		html += "	<td colspan='5' class='glassAll'>";
		html += "		<ul>";
		html += "			<li>";
		html += '				<span class="td_title">모양</span>';		
		html += "				<span class='td_value'>" + $("#shape option:checked").text() + "</span>";
		html += "			</li><li>";
		html += '				<span class="td_title">사이즈</span>';		
		html += "				<span class='td_value'>" + $('#width').val() + " X " + $('#height').val() + " X "  + $("#thickness option:checked").text() + "</span>";
		html += "			</li><li>";
		html += '				<span class="td_title">수량</span>';		
		html += "				<span class='td_value'>" + format_num($("#count").val()) + "</span>";
		html += "			</li><li>";
		html += '				<span class="td_title">금액</span>';		
		html += "				<span class='td_value'>" + $("#price").val() + "</span>";
		html += "			</li>";		
		html += "		</ul>";
		html += "	</td>";
	}else{
		html += "	<td class='glassname'>" +  $("#shape option:checked").text() + " " + $('#width').val() + " X " + $('#height').val() + " X "  + $("#thickness option:checked").text() + "</td>" ;
		html += "	<td class='glasscount'>" + format_num($("#count").val()) + "</td>";
		html += "	<td class='glassprice'>" + $("#price").val() + "</td>";
	}
	html += "</tr>";
	
	$('#mirror_cal_cart > tbody').append(html);
	
	cal_total_price();
	
	initStatus('A');
}

// 장바구니에 담긴 값의 토탈 값
function cal_total_price(){
	var tot_cnt = 0;
	var tot_price = 0;
	
	$('#mirror_cal_cart > tbody input[name="count"]').each(function(){
		tot_cnt += parseInt($(this).val().replace(/,/g, ""));
	});
	
	$('#mirror_cal_cart > tbody input[name="price"]').each(function(){
		tot_price += parseInt($(this).val().replace(/,/g, ""));
	});
	
	$("#tot_count").text(format_num(tot_cnt));
	$("#tot_price").text(format_num(tot_price));
	
	$("#option_pay_count").text(format_num(tot_price/100));
	
	option_deliver()
}

// 배송비 운임 여부
function option_deliver(){
	var tot_len = 0;
	var showYn = false;

	$('#mirror_cal_cart > tbody tr input[name="deliver"]').each(function(){
		if($(this).val() == "Y" && !showYn){
			showYn = true;
		}
	});
	
	if(showYn){
		$(".option_deliver").show()
	}else{
		$(".option_deliver").hide()
	}
}


// 장바구니 삭제
function del_glass_cart(){
	$('#mirror_cal_cart > tbody tr .glasscheck input:checked').each(function(){
		$(this).parents('tr').remove();
	});
	
	cal_total_price();
}

function fn_setForm(){

	if($('#mirror_cal_cart > tbody tr').length == 0 ) {
		fn_layerPop($("#alertPopup"), "견적서에 상품이 없습니다.");
		return;
	}
	
	if($('#name').val() == "" ){
		fn_layerPop($("#alertPopup"), "주문자 명을 입력해주세요.", $('#name'));
		return;
	}
	if($("[name='order_type']:checked").val() == "email" && $('#email').val() == "" ){
		fn_layerPop($("#alertPopup"), "이메일을 입력해주세요.", $('#email'));
		return;
	}

	if($("#agree_privacy:checked").length == 0 ){
		fn_layerPop($("#alertPopup"), "개인정보 취급동의에 체크해주세요.", $('#agree_privacy'));
		return;
	}	
	
	$('#price_total').val($('#tot_price').text());
	$('#price_count').val($('#tot_count').text());
	$('#price_option').val($('#option_pay_count').text());
	
	if($(".option_deliver").is(':visible')){
		$('#deliver').val('추가');
	}else{
		$('#deliver').val('없음');
	}
	
	var cartTxt = "";
	
	$('#mirror_cal_cart > tbody tr').each(function(index){
		if(index != 0){
			cartTxt += "/"
		}
		cartTxt += $(this).find('input[name="shape"]').val() + "|" 
		cartTxt += $(this).find('input[name="width"]').val() + "|" ;
		cartTxt += $(this).find('input[name="height"]').val() + "|" ;
		cartTxt += $(this).find('input[name="thickness"]').val() + "|" ;
		cartTxt += $(this).find('input[name="count"]').val() + "|" ;
		cartTxt += $(this).find('input[name="price"]').val();
	});
	
	
	$('#cart').text(cartTxt);
	
    $("#loadingPopup").show();
	if($("[name='order_type']:checked").val() == "img"){
		fn_saveImg();
	}else{
		send_email();
	}
}

function fn_saveImg(){
	$("._name").text($("#name").val());
	$("._addDeliver").text($("#deliver").val());
	$("._market").text($("#market_name").val());

	var html = "";

	$("#mirror_cal_cart tbody tr").each(function(idx, me) {
		html += "	<td>" +  $(me).find("[name='shape']").val();
		html += "<br>" +  $(me).find("[name='width']").val() + " X " + $(me).find("[name='height']").val() + " X "  + $(me).find("[name='thickness']").val() + "</td>" ;
		html += "	<td>" + format_num($(me).find("[name='count']").val()) + "</td>";
		html += "	<td>" + $(me).find("[name='price']").val() + "</td>";
	});

	$("._cartList").html(html);

	fn_downloadImg2('saveImgForm', "아크릴견적서");
	send_email();
}

// 이메일 보내기
function send_email(){
	var queryString = $("form[name=emailfrm]").serialize() ;

	$.ajax({
		data : queryString,
		type : 'post',
		url : 'https://script.google.com/macros/s/AKfycbzkM0uG8fysbivukpBPrAflu4QQmVDKn5TAlGshC-DioIjWHwV-PlEa_yTCAmKP7qMxvw/exec',
		dataType : 'json',
		error: function(xhr, status, error){
			$("#loadingPopup").hide();
			fn_layerPop($("#alertPopup"), error);
		},
		success : function(json){
			$("#loadingPopup").hide();
			fn_layerPop($("#alertPopup"), "견적서가 발송되었습니다.");
		}
	});
	
}
