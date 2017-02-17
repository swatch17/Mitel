// var R3SoftPhone = new Micc($('#domain').val());
var R3SoftPhone = new Micc('crm.r3yun.com:90');

//登录按钮
$(document).on('click', '#btn-login', function (event) {
    event.stopPropagation();
    var $src = $(event.currentTarget);
    $('#loginModal').modal('hide');
    R3SoftPhone.login($('#ext-number').val(), $('#password').val(), R3SoftPhone.connectToEmployeeHub);
});
// 折叠菜单状态
$(document).on('click', '#lamp', function () {
    $('.fold-menu').removeClass('hide').addClass('in');
});
//可用Available(就绪)
$(document).on('click', '#ready', function () {
    var req = {
        // 'availableReason': 'Available',
        'availableReason': 3,
        'state': 'Available'
    };
    var data = JSON.stringify(req);
    R3SoftPhone.setAgentState('me', data, function (res) {
        console.log(res);
    });
    $('.notReady').removeClass('dead').removeClass('disable');
    UI.enableBtn('#notReady');
    $('.ready').addClass('dead');
});
//忙碌(示忙)
$(document).on('click', '#busy', function (res) {
    var req = {
        'reason': "don't know",
        'state': 'Busy',
    };
    var data = JSON.stringify(req);
    R3SoftPhone.setAgentState(loginId, data, function (res) {
        console.log(res);
    });
    console.log('忙碌！');
    console.log(loginInfo);
    $('.fold-menu').addClass('hide');
});
//勿扰(小憩)
$(document).on('click', '#disturb', function (res) {
    var req = {
        'reason': '哥们儿忙着呢',
        'state': 'DoNotDisturb'
    };
    var data = JSON.stringify(req);
    R3SoftPhone.setAgentState(loginId, data, function (data) {
        console.log(data);
    });
    console.log('我们忙着呢 勿扰');
    $('.fold-menu').addClass('hide');
});
//离线offline(未就绪)
$(document).on('click', '#notReady', function (res) {
    var req = {
        'state': 'Offline'
    };

    var data = JSON.stringify(req);
    R3SoftPhone.setAgentState(loginId, data, function (data) {
        console.log(data);
    });
    $('.notReady').addClass('dead');
    $('.ready').removeClass('dead');
    console.log('wo wo 休息一会儿');
});
//登出
$(document).on('click', '#logout', function () {
    /* var req = {
     state: 'Away'
     };
     var data = JSON.stringify(req);
     Micc.setAgentState(loginId, data, function () {
     console.log('OH OH')
     });
     console.log('HOME')*/
    location.reload();
});


//接听
$(document).on('click', '#answer', function () {
    var req = {
        conversationAction: 'Accept',
        id: conversationId,
        tags: [{
            key: ''
        }]
    };
    var data = JSON.stringify(req);
    R3SoftPhone.conversationAction(conversationId, data);
    UI.enableBtn('#drop,#hold');
    UI.disableBtn('#btn-call,#answer,#btn-logout');
    UI.liveBtn("#answer");

});
//保持
$(document).on('click', '#hold', function () {
    var req = {
        conversationAction: 'Hold',
        id: conversationId,
        tags: [{
            key: ''
        }]
    };
    var data = JSON.stringify(req);
    R3SoftPhone.conversationAction(conversationId, data);
    UI.enableBtn('#takeBack');
    UI.disableBtn('#btn-call,#answer,#btn-logout');
    UI.liveBtn("#hold");
});
//取回
$(document).on('click', '#takeBack', function () {
    var req = {
        conversationAction: 'RemoveHold',
        id: conversationId,
        tags: [{
            key: 'email AcceptType'
        }]
    };
    var data = JSON.stringify(req);
    R3SoftPhone.conversationAction(conversationId, data);
    UI.enableBtn('#hold,#drop,#trans');
    UI.disableBtn('#answer,#takeBack');
    UI.liveBtn("#answer");
});
//转接
$(document).on('click', '#trans', function () {
    var transNum = $('#inp-num').val();
    var req = {
        conversationAction: 'Transfer',
        id: conversationId,
        transferDestination: transNum, //转接号
        transferDestinationType: 'External' //转接类型
    };
    var data = JSON.stringify(req);
    R3SoftPhone.conversationAction(conversationId, data);
    // UI.enableBtn('#hold,#drop,#takeBack,#trans');
    UI.disableBtn('#answer,#hold,#drop,#takeBack');
    UI.liveBtn("#trans");
});
//挂断
$(document).on('click', '#drop', function () {
    var req = {
        conversationAction: 'End',
        id: conversationId,
    };
    var data = JSON.stringify(req);
    R3SoftPhone.conversationAction(conversationId, data);
    // $('#answer,#hold,#takeBack,#trans,#drop')
});


$(document).ready(function () {
    // 电话按键区
    $('.num-key>input').each(function () {
        $(this).mousedown(function () {
            $(this).css({
                'background-color': '#00a65a'
            });
            var inpNum = document.getElementById('inp-num');
            inpNum.focus();

            var n = $(this).val();
            inpNum.value += n;

        });
        $(this).mouseup(function () {
            $(this).css({
                'background-color': '#3d3f47'
            });
        });
    });
    //清空号码
    $('.delete-btn').click(function () {
        var inpNum = $('#inp-num');
        inpNum.val('');
    });
    $('.offBtn,#Dial').click(function () {
        if ($('#mobile').hasClass('dead')) {
            $('#mobile').removeClass('dead');
        } else {
            $('#mobile').addClass('dead');
        }
    })
})

function AgentStateInfo() {
    R3SoftPhone.getEmployeeState('me', function (data) {
        console.log(data);
    });
    // micc.connectToEmployeeHub()
}
