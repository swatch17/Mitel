var UI = {
    initUi: function() {

    },

    phoneActive: function(data) {
        switch (data) {
            case 'Offered': //来电振铃事件
                {
                    UI.CallRing(data);console.log('来电！');
                }
                break;
            case 'NonAcd': //内线
                {
                    UI.AnswerPhone(data);console.log('已接听！');
                    console.log('This is:' + data);
                    end();
                    Time();
                }
                break;
            case 'Outbound': //内线
                {
                    UI.AnswerPhone(data);console.log('已接听！');
                    console.log('This is:' + data);

                }
                break;
            case 'Acd': //外线
                {
                    UI.AnswerPhone(data);console.log('已接听！');
                    console.log('这是外呼');
                    console.log('This is :' + data);
                    end();
                    Time();

                }
                break;
            case 'Held': //保持
                {
                    UI.HeldPhone(data);console.log('已保持！');

                }
                break;
        }

    },
    CallRing: function() {
        $('#lamp').removeClass('s_off').removeClass('s_busy').removeClass('s_disturb').addClass('s_ava');
        UI.enabledBtn('answer');
        UI.showBtn('call-ring');
        UI.hideBtn('call-not', 'on-call', 'call-hold');

        // SoftPhoneAction.callInAction(connectInfo);来电弹屏
        console.log(connectInfo);
        console.log(PhoneInfo);

    },
    AnswerPhone: function() {
        $('#lamp').addClass('s_ava').removeClass('s_off').removeClass('s_busy').removeClass('s_disturb');
        console.log('Hello GOOD')
        UI.enabledBtn('drop', 'hold', 'trans');
        UI.disabledBtn('answer');
        UI.showBtn('on-call', 'hold');
        UI.hideBtn('call-not', 'call-ring', 'call-hold', 'takeBack');
    },
    HeldPhone: function() {
        $('.p_title').text('保持中');
        UI.enabledBtn('takeBack');
        UI.disabledBtn('answer', 'drop', 'trans');
        UI.showBtn('call-hold', 'takeBack');
        UI.hideBtn('call-not', 'call-ring', 'on-call', 'hold');
    },
    employeeconversationremoved: function() {
        console.log('已挂断');
        $('#lamp').removeClass('s_off').removeClass('s_busy').removeClass('s_disturb').addClass('s_ava');
        UI.disabledBtn('answer', 'drop', 'hold', 'trans');
        UI.hideBtn('transBox', 'call-ring', 'on-call', 'call-hold', 'takeBack');
        UI.showBtn('hold', 'call-not');
        $('.callIn').text('');
        $('.callOut').text('');
    },
    enabledBtn: function(id) {
        for (var i = 0; i < arguments.length; i++) {
            $('#' + arguments[i]).removeClass('disabled').removeClass('n-' + arguments[i]).addClass(arguments[i]).addClass('enabled');
        }

    },
    disabledBtn: function(id) {
        for (var i = 0; i < arguments.length; i++) {
            $('#' + arguments[i]).removeClass('enabled').removeClass(arguments[i]).addClass('n-' + arguments[i]).addClass('disabled');
        }
    },
    hideBtn: function(id) {
        for (var i = 0; i < arguments.length; i++) {
            $('#' + arguments[i]).addClass('dead');
        }
    },
    showBtn: function(id) {
        for (var i = 0; i < arguments.length; i++) {
            $('#' + arguments[i]).removeClass('dead');

        }
    }

};
var LampUI = { //设置状态灯
    main: function(data) {
        switch (data) {
            case 'Available':
                {
                    LampUI.Ava();
                    UI.enabledBtn('Dial');
                }
                break;
            case 'Busy':
                {
                    LampUI.Busy();

                }
                break;
            case 'DoNotDisturb':
                {
                    LampUI.Disturb();

                }
                break;
            case 'Offline':
                {
                    LampUI.Offline();
                    UI.disabledBtn('Dial');
                    $('#btn-showModal').removeClass('dead');
                    $('#btn-logout').addClass('dead');
                }
                break;
        }
    },
    Ava: function() {
        $('#lamp').removeClass('s_busy').removeClass('s_disturb').removeClass('s_off').addClass('s_ava');
    },
    Busy: function() {
        $('#lamp').removeClass('s_ava').removeClass('s_disturb').removeClass('s_off').addClass('s_busy');
    },
    Disturb: function() {
        $('#lamp').removeClass('s_ava').removeClass('s_busy').removeClass('s_off').addClass('s_disturb');
    },
    Offline: function() {
        $('#lamp').removeClass('s_ava').removeClass('s_busy').removeClass('s_disturb').addClass('s_off');
    }
};
