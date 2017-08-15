/*回调函数*/

var PhoneInfo = {//呼出信息
    localNum: ''
};
var connectInfo={//来电信息

}
var oConversationId, oConversationState, isItems;

// 获取坐席状态
function getStats() {
    R3SoftPhone.getEmployeeState('me', function(res) {
        PhoneInfo.id = res.id;
        console.log(res);
    });
}

function freshCov(res) {
    isItems = res._embedded.items;

    for (var i = 0; i < isItems.length; i++) {
        var mediaType = isItems[i].mediaType;
        if (mediaType == 'Voice') {
            oConversationState = isItems[i].conversationState;
            oConversationId = isItems[i].conversationId;
            UI.phoneActive(oConversationState);
            console.log(oConversationState);
            console.log(oConversationId)
        }
    }

}
// 长连接检测
function connectToEmployeeHub(data) {


    R3SoftPhone.getEmployeeState('me', employeeInfo);
    R3SoftPhone.getEmployeeBusyReason('me', null, busyReasonCodes);
    R3SoftPhone.getConversationState('me', null, freshCov)



    var connection = $.hubConnection(data.miccServer + '/miccsdk/', {
        qs: 'sessionid=Bearer ' + data.access_token
    });

    connection.logging = true;
    connection.error(function(error) {
        console.error('Connection error:  ', error);
    });
    connection.stateChanged(function(state) {
        console.info('连接状态改变:  ', state);
        // Event.main(state.oldState);
        console.log('DDDDD!!!');
    });

    connection.start().done(function() {
        console.info('Connection established with ID=' + connection.id);

        var hub = connection.createHubProxy('employeeHub');
        hub.invoke('addSelfMonitor');
        // hub.on('EmployeeStateChanged', getConversationInfo);
        hub.on('EmployeeStateChanged', employeeInfo);
        hub.on('employeeConversationChanged', EmployeeConversationChanged);
        hub.on('employeeConversationRemoved', EmployeeConversationRemoved);
    }).fail(function() {
        console.error('Connection failed');
    });
}
// 检测会话状态改变
function EmployeeConversationChanged(conversations) {

    console.log('Received EmployeeConversationChanged:', conversations);
    var data = conversations[0];
    var conversationStats = data.conversationState;

    console.log('会话的改变:', JSON.stringify(data));
    console.log(conversationStats);

    $('.push_event').append("<pre>" + JSON.stringify(data) + "</pre>");
    PhoneInfo.conversationId = data.conversationId;



    connectInfo.callingNum = data.fromAddress;
    connectInfo.calledNum = data.toAddress;
    connectInfo.line = data.direction;
    connectInfo.callId = data.conversationId;
    console.log(connectInfo);
    $('.callIn').text(connectInfo.callingNum);
    $('.callOut').text(connectInfo.calledNum);
    console.log('呼入号：' + connectInfo.callingNum, '被呼号' + connectInfo.calledNum);

    // UI.phoneActive(data.conversationState);


    UI.phoneActive(conversationStats);

}
// 会话结束
function EmployeeConversationRemoved(conversationId) {
    // console.log('Received EmployeeConversationRemoved:'conversationIds);
    console.log('Received EmployeeConversationRemoved:', conversationId);
    UI.employeeconversationremoved();
}
// 获取坐席相关信息
function employeeInfo(data) {
    stateProcess(data.presence);
}
// 坐席组状态
function stateProcess(presence) {
    var EmployeeState = presence.aggregate.state;
    var EmailState = presence.email.state;
    var ChatState = presence.chat.state;
    var VoiceState = presence.voice[0].state;
    AcdState = presence.voice[0].acdState;

    console.log(AcdState);
    // Outbound



    console.log(EmployeeState, EmailState, ChatState, VoiceState);
    sessionStorage.setItem('_voiceState', VoiceState); //保存状态值
    sessionStorage.setItem('_employeeState', EmployeeState); //保存坐席状态值
    // sessionStorag.setItem('_acdState',AcdState);
    // LampUI.main(VoiceState);
    LampUI.main(EmployeeState);
    if (VoiceState == 'DoNotDisturb') {
        $('.p_title').text("DND");
    } else if (EmployeeState == 'Offline') {
        $('.p_title').text('Status');
        UI.disabledBtn('state-menu', 'Dial');
        UI.hideBtn('btn-logout');
        UI.showBtn('btn-showModal');
        end();
    } else {
        $('.p_title').text(EmployeeState);
        UI.hideBtn('btn-showModal');
        UI.showBtn('btn-logout');
        UI.enabledBtn('state-menu', 'Dial');

    }
}
// 获取状态原因(示忙、勿打扰)
function setPresence(newState, reasonCode, event) {
    window.event ? window.event.cancelBubble = true : event.stopPropagation();
    $('.state-item-box').addClass('dead');
    $('#busyR').addClass('dead');
    $('#disturbR').addClass('dead');
    var req = {
        state: newState,
        reason: reasonCode
    };
    R3SoftPhone.setEmployeeState('me', req, function callback(res) {
        console.log('Response for set presence' + newState + '--' + reasonCode + ':' + res);
    });

}
// 添加获取的原因
function busyReasonCodes(data) {
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;
    try {

        for (var _iterator = data._embedded.items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var reasonCode = _step.value;

            if (reasonCode.type === 'Busy') {
                $("#busy-box").append('<li><a  onclick="setPresence(\'Busy\', \'' + reasonCode.id + '\',event);">' + reasonCode.name + '</a></li>');
            }
            if (reasonCode.type === 'Dnd') {
                $("#disturb-box").append('<li><a onclick="setPresence(\'DoNotDisturb\', \'' + reasonCode.id + '\',event);">' + reasonCode.name + '</a></li>');
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    console.log(data);
}
// 分机登录
function Extension() {
    var extNum = $('#ext-num').val();
    var req = {
        availableReason: 'Login',
        hotDeskBaseExtension: extNum,
        hotDeskPin: "",
        state: 'Available'
    };

    R3SoftPhone.setEmployeeState('me', req, function(data) {
        console.log('分机登录成功！' + data);
    });
}
// 拨打电话
function dialog(Num, callType) {


    connectInfo.calledNum = Num;
    connectInfo.callId = connectInfo.line = 'callOut';
    $('#mobile').removeClass('dead');
    $('#inp-num').val(Num);
}
// 获取会话信息
/*function getConversationInfo() {
    var payload = {
        id: 'me'
    };
    R3SoftPhone.getConversationState('me', payload, function(res) {
        console.log(res);
        oConversationId = res._embedded.items[0].conversationId;
        oConversstionState = res._embedded.items[0].conversationState;

        console.log(oConversationId, oConversstionState);
    });

}*/


// Timer

var interTime;
var s = 0;
var m = s % 60;
var h = m % 60;

function Time() {
    s = parseInt(s + 1);
    m = parseInt(s / 60 % 60);
    h = parseInt(s / 60 / 60 % 60);

    var _s = s && (s % 60) < 10 ? ('0' + s % 60) : (s % 60);
    var _m = m < 10 ? ('0' + m) : m;
    var _h = h < 10 ? ('0' + h) : h;
    time.innerHTML = _h + ':' + _m + ':' + _s;
    interTime = setTimeout('Time()', 1000)
}

var end = function() {
    clearTimeout(interTime)
    s = 0;
    document.getElementById('time').innerHTML = '00' + ':' + '00' + ':' + '00';
};
