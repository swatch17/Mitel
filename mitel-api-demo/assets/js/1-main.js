$(document).ready(function() {
  
    var connection = {}; //通话信息(呼入呼出)

    R3SoftPhone = new Micc('micc.dahengit.com');
    Param = {
            unk: '0', //Unknow
            Ava: '1', //Available
            busy: '2', //Busy
            dnd: '3', //DoNotDisturb
            away: '4', //Away,
            off: '5', //Offline
            answer: '1', //Accept
            hold: '5', //Hold
            recover: '6', //RemoveHold
            trans: '7', //Transfer
            drop: '9' //End
        }
        // 登录
    $('#btn-login').on('click', function() {
        $('#loginModal').modal('hide');
        var username = $('#agent-num').val();
        var pwd = $('#password').val();
        var payload = {
            state: Param.Ava
        };
        PhoneInfo.localNum = username; //用户名(坐席号)
        // connectToEmployeeHub
        R3SoftPhone.login(username, pwd, function(data) {
            connectToEmployeeHub(data);

            R3SoftPhone.setEmployeeState('me', payload, function() {
                //其他操作
            });
        });

    });
    // 登出
    $('#btn-logout').on('click', function() {
        var payload = {
            state: Param.off
        };
        R3SoftPhone.setEmployeeState('me', payload, function() {
            UI.showBtn('btn-showModal');
            UI.hideBtn('btn-logout');
            UI.disabledBtn('state-menu', 'Dial');
            $('.state-item-box').addClass('dead');
            $('#busyR').addClass('dead');
            $('#disturbR').addClass('dead');
            $('.p_title').text('Status');
            end();
            //其他操作
        });
    });
    //接听
    $('#answer').on('click', function() {
        if ($('#answer').hasClass('enabled')) {

            var req = {
                conversationAction: Param.answer,
                id: PhoneInfo.conversationId
            }
            R3SoftPhone.conversationAction(req.id, req, function() {
                //其他操作
            });

        }
    });
    //挂断
    $('#drop').on('click', function() {
        if ($('#drop').hasClass('enabled')) {
            var req = {
                conversationAction: Param.drop,
                id: PhoneInfo.conversationId
            };
            R3SoftPhone.conversationAction(req.id, req, function() {
                //其他操作
            });
        }
    });
    // 保持
    $('#hold').on('click', function() {
        if ($('#hold').hasClass('enabled')) {
            var req = {
                conversationAction: Param.hold,
                id: PhoneInfo.conversationId
            };
            R3SoftPhone.conversationAction(req.id, req, function() {
                //其他操作
            });
        }
    });
    //取回
    $('#takeBack').on('click', function() {
        if ($('#takeBack').hasClass('enabled')) {
            var req = {
                conversationAction: Param.recover,
                id: PhoneInfo.conversationId
            };
            R3SoftPhone.conversationAction(req.id, req, function() {
                //其他操作
            });
        }
    });
    // 转接
    $('#trans').on('click', function(event) {
        if ($('#trans').hasClass('enabled')) {
            if (event.target.id === 'trans') {
                $('#transBox').removeClass('dead');
                $('#transBox>li').each(function() {
                    $(this).click(function() {
                        var transNum = $(this).text();
                        var req = {
                            conversationAction: Param.trans,
                            id: PhoneInfo.conversationId,
                            transferDestination: transNum, //转接号
                            transferDestinationType: 'External' //转接类型
                        };

                        R3SoftPhone.conversationAction(req.id, req, function() {
                            //其他操作
                        });

                    });
                });
            } else {
                $('#transBox').addClass('dead');
            }
        }
    });
    //拨号盘弹出
    $('#Dial').on('click', function() {
        if ($('#Dial').hasClass('enabled')) {
            if ($('#mobile').hasClass('dead')) {
                $('#mobile').removeClass('dead');
            } else {
                $('#mobile').addClass('dead');
            }
        }
    });
    //拨号
    $('#btn-call').on('click', function() {
        var toNumber = $('#inp-num').val();
        var fromNum = $('#agent-num').val();

        PhoneInfo.calledNum = toNumber; //被叫号
        PhoneInfo.callingNum = fromNum; //主叫号
        PhoneInfo.line = 'callOut'; //呼出方

        var req = {
            type: 'voice',
            to: toNumber
        };
        console.log(PhoneInfo);

        R3SoftPhone.postEmployeeConversation('me', req, function() {
            // 其他操作
        });
        $('.callIn').text(fromNum);
        $('.callOut').text(PhoneInfo.calledNum);
    });
    //enter 拨号
    $(document).on('keydown', '#inp-num', function(event) {
        if (event.keyCode == 13) {
            var toNumber = $('#inp-num').val();
            var fromNum = $('#agent-num').val();

            connectInfo.callingNum = fromNum; //主叫
            connectInfo.calledNum = toNumber; //被叫
            connectInfo.line = 'callOut'; //呼号方

            // dialog(to, 'callOut');
            console.log(toNumber);
            var req = {
                type: 'Voice',
                to: toNumber
            };

            R3SoftPhone.postEmployeeConversation('me', req, function(res) {
                console.log('Response from POST conversation:  ', res);
            });
            // SoftPhoneAction.callInAction(connectInfo);呼出弹屏
            console.log(connectInfo);

            $('#mobile').addClass('dead');
            $('.callIn').text(fromNum);
            $('.callOut').text(toNumber);

        }
    });
  /*Status Active*/
    $('#state-menu').click(function(event) {
        event.stopPropagation();
        if ($('#state-menu').hasClass('enabled')) {
            if ($('.state-item-box').hasClass('dead')) {
                $('.state-item-box').removeClass('dead');
            } else {
                $('.state-item-box').addClass('dead');
                $('#busyR').addClass('dead');
                $('#disturbR').addClass('dead');
            }
        }

    });
  /*状态设置*/
  //可用(签入)
 $('#available').click(function() {
        var payload = {
            state: 'Available'
        };
        R3SoftPhone.setEmployeeState('me', payload, function(res) {
            console.log('可用', res);
            Extension();
        });


        $('.state-item-box').addClass('dead');
        $('#busyR').addClass('dead');
        $('#disturbR').addClass('dead');
    });
  //登出离线(签出)
    $('#offline').click(function() {
        var payload = {
            state: 'Offline'
        };
        R3SoftPhone.setEmployeeState('me', payload, function(res) {
            console.log('离线', res);
        });
        $('.state-item-box').addClass('dead');
        $('#busyR').addClass('dead');
        $('#disturbR').addClass('dead');
    });
    $(document).on('click', '#btnClear', function() {
        $('.push_event').text('');
    });
    $(document).on('click', '#clear', function() {
        $('#inp-num').val('');
    });
    $(document).on('click', '#cancel', function() {
        $('#mobile').addClass('dead');
    });


})
