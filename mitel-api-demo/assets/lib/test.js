$(document).ready(function () {
    var busy_lis = $('.busy-box>li ._busy');
    var disturb_lis = $('.disturb-box>li ._disturb');
    //示忙
    busy_lis.each(function () {
        $(this).click(function () {
            var _busyReason = $(this).text();
            var req = {
                'reason': _busyReason,
                'state': 'Busy'
            };
            var data = JSON.stringify(req);
            R3SoftPhone.setAgentState(loginId, data, function () {
                console.log('设置状态 成功！');
            });
                $('.p_title').text($(this).text());
                $('#lamp').removeClass('s_ava').removeClass('s_disturb').removeClass('s_off').addClass('s_busy');
                $('#s_offline,#s_avai').removeAttr('disabled').removeClass('btn-dis').addClass('btn-info');
                $('#available,#offline').removeClass('disabled').addClass('enabled');

        });
    });
    //勿扰
    disturb_lis.each(function () {
        $(this).click(function () {
            var _disturbReason = $(this).text();
            var req = {
                'reason': _disturbReason,
                'state': 'DoNotDisturb'
            };
            var data = JSON.stringify(req);
            R3SoftPhone.setAgentState(loginId, data, function () {
                console.log('设置状态 成功！');
            });

            // if(changeState=='onagentstatechanged'){
                $('.p_title').text($(this).text());
                // $('#lamp').removeClass('s_ava,s_busy,s_off').addClass('s_disturb');
                $('#lamp').removeClass('s_ava').removeClass('s_busy').removeClass('s_off').addClass('s_disturb');
                $('#s_avai,#s_offline').removeAttr('disabled').removeClass('btn-dis').addClass('btn-info');
                $('#available,#offline').removeClass('disabled').addClass('enabled');
        });
    });


   /* $(document).click(function(event){
        if(event.target.id=='Dial'){
            $('#mobile').removeClass('dead')
            console.log(111111)
        }else{
            $('#mobile').addClass('dead')
            console.log(34555)
        }
    })*/

    // $('#Dial').tooltip()

});
