var loginId = '';
var loginInfo;
var phoneInfo = {};//来电信息（主、被叫、方向、通话Id）

function Micc(Server) {

    var miccServer = 'http://' + Server;
    var miccSdk = miccServer + '/miccsdk/api/v1';
    var miccAuth = miccServer + '/authorizationserver';
    var bearerToken = '';

    var EventName = '';
    var conversationId;

    this.login = function (username, password, callback) {
        console.log('用户[%s]登录服务器[%s]', username, miccAuth);
        var data = "grant_type=password&username=" + username + "&password=" + password;

        $.ajax({
            type: 'POST',
            url: miccAuth + '/token',
            data: data,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }

        }).done(function (data) {
            console.log('登陆成功！', data);
            $('#btn-showModal,.notReady').addClass('dead').removeAttr('disable');
            $('#btn-logout,.ready').removeClass('dead').removeAttr('disable');
            bearerToken = data.access_token;
            if (callback) {
                data.miccServer = miccServer;
                callback(data);
            }

        });
    };

    this.getEmployeeState = function (apiUrl, callback) {
        if (!apiUrl) {
            console.log('获取loginId失败');
        } else {
            this.getRequest('employees/' + apiUrl + "/state", callback);
        }
    };
    // 设置状态
    this.setAgentState = function (agentId, callback) {
        if (!agentId) {
            console.log('木有this agentId值');
        } else {
            this.putRequest('employees/' + agentId + '/state', callback);
        }
    };
    // 会话操作 接听、挂断...
    this.conversationAction = function (apiUrl, body, callback) {
        if (!apiUrl) {
            console.log('木有conversation值');
        } else {
            this.putRequest('employees/me/conversations/' + apiUrl, body, callback);
        }
    };
    this.postEmployeeConversation = function (apiUrl, body, callback) {
        if (!apiUrl) {
            console.log('获取loginId失败');
        } else {
            this.getRequest('employees/' + apiUrl + "/conversations", body, callback);
        }
    };


    this.connectToEmployeeHub =
        function (data) {
            AgentStateInfo();
            var connection = $.hubConnection(data.miccServer + '/miccsdk/', {
                qs: 'sessionid=Bearer ' + data.access_token
            });
            connection.logging = true;
            connection.error(function (error) {
                console.error('Connection error:  ', error);
            });
            connection.stateChanged(function (state) {
                console.info('连接状态改变:  ', state);
            });

            connection.start()
                .done(function () {
                    console.info('Connection established with ID=' + connection.id);

                    var hub = connection.createHubProxy('employeeHub');
                    hub.invoke('addSelfMonitor');
                    hub.on('employeeConversationChanged', EmployeeConversationChanged);
                    hub.on('employeeConversationRemoved', EmployeeConversationRemoved);
                })
                .fail(function () {
                    console.error('Connection failed');
                });
        };


    this.getRequest = function (apiUrl, callback) {
        this.makeAjaxRequest(apiUrl, 'GET', null, callback);
    };

    this.postRequest = function (apiUrl, body, callback) {
        this.makeAjaxRequest(apiUrl, 'POST', body, callback);
    };
    this.putRequest = function (apiUrl, body, callback) {
        this.makeAjaxRequest(apiUrl, 'PUT', body, callback);
    };
    this.makeAjaxRequest = function (apiUrl, method, body, callback) {
        var url = miccSdk + "/" + apiUrl;
        console.log('YNEL' + method, url);
        $.ajax({
            type: method,
            url: url,
            headers: {
                Authorization: "Bearer " + bearerToken,
                'content-type': 'application/json'
            },
            data: body
        }).done(function (data) {
            console.log('收到响应数据', data);
            loginInfo = data;
            // 坐席信息
            $('#agentName').text(loginInfo.name);
            $('#device').text(loginInfo.reporting);

            if (loginId != '') {
                return;
            } else {
                loginId = data.id;
                console.log(loginId);
            }
        });
    };


}

function EmployeeConversationChanged(conversations) {
    console.info('收到会话改变:  ', conversations[0]);
    var data = conversations[0];

    phoneInfo.callingNum = data.fromAddress;
    phoneInfo.calledNum = data.toAddress;
    phoneInfo.line = data.direction;
    phoneInfo.callId = data.conversationId;
    console.log(phoneInfo);

    UI.phone(data.conversationState);
    console.log(JSON.stringify(data));
    conversationId = data.conversationId;
    var info = data.toAddress;
    console.log(info, data.fromAddress);

}

function EmployeeConversationRemoved(conversationIds) {
    console.info('电话结束啦！', conversationIds);
}
var Alert = {
    //呼入弹屏
    callInAlert: function (data) {
        var req = {
            data: data || '',
            type: 'post',
            url: ''
        };
        Alert.sendAjax(req, function (res) {
            if (res.error) {
                console.log(res);
                return;
            }
        });
        console.log('这是呼入');
    },
    //呼出弹屏
    callOutAlert: function (data) {
        var req = {
            data: data || '',
            type: 'post',
            url: ''
        };
        Alert.sendAjax(req, function (res) {
            if (res.error) {
                console.log(res);
                return;
            }
        });
        console.log('这是呼出');
    },

    sendAjax: function (req, callback) {
        var res = {
            error: true,
            data: {}
        };
        req.data = JSON.stringify(req.data || {});
        $.ajax({
            type: req.type || 'get',
            contentType: 'application/json',
            data: req.data,
            url: req.url,
            error: function (data) {
                res.data = data;
                callback(res);
            },
            success: function (data) {
                res.data = data;
                res.error = false;
                callback(res);
            }
        });
    }

};