$(function(){
    console.log('hello world');
    /*text-input-group - begin*/
    $('.text-input-group input').focusin(function(){
    	if($(this).prev().length>0){
    		$(this).prev().css('border-bottom','none');
    	}
    	$(this).css('border-top','1px solid #66AFE9');
    });
    $('.text-input-group input').focusout(function(){
    	$(this).css('border-top','');
    	if($(this).prev().length>0){
    		$(this).prev().css('border-bottom','');
    	}
    });
    /*text-input-group - end*/
});