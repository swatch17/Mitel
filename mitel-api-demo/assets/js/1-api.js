function Micc(Server) {
  this.miccServer = 'https://' + Server;
  this.miccSdk = this.miccServer + '/MiccSdk/api/v1';
  this.miccAuth = this.miccServer + '/authorizationserver';

  var bearerToken = '';
  var miccServer = '';
  var access_token = '';


  this.EventName = undefined;
  this.conversationId = undefined;
  //登录
  this.login = function(username, password, callback) {
    console.log('用户[%s]已登录服务器[%s]', username, this.miccAuth);
    var data = "grant_type=password&username=" + username + "&password=" + password;
    var that = this;
    $.ajax({
      type: 'POST',
      url: this.miccAuth + '/token',
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }).done(
      function(res) {
        console.log('登录成功！响应数据:', res);
        bearerToken = res.access_token;

        if (callback) {
          res.miccServer = that.miccServer;
          // console.log(that.miccServer);
          callback(res);
        }

      }).then(function() {
      UI.showBtn('btn-logout');
      UI.hideBtn('btn-showModal');
      UI.enabledBtn('Dial', 'state-menu');
      Time();
    });

  };

  //发送Ajax
  this.RequstApi = function(opts, callback) {
    var url = this.miccSdk + '/' + opts.apiUrl;
    var headers = {
      Authorization: "Bearer " + bearerToken,
      'content-type': 'application/json'
    };

    var options = {
      type: opts.method || 'GET',
      async: true,
      url: url,
      data: opts.data || {},
      headers: headers
    };
    $.ajax(options, callback)
      .done(function(res) {
        console.log('响应数据：', res);
        // PhoneInfo.localNum = res.reporting;

        $('.push_event').append("<pre>" + JSON.stringify(res) + "</pre>");
        if (callback) {
          callback(res);
        }
      });
  };

}
// 获取坐席状态
Micc.prototype.getEmployeeState = function(path, callback) {
  var payload = {};
  var data = JSON.stringify(payload);

  opts = {
    data: data || {},
    method: 'GET',
    apiUrl: 'employees/' + path + "/state"
  };
  // console.log(opts.apiUrl);

  this.RequstApi(opts, callback);
};
// 获取状态原因
Micc.prototype.getEmployeeBusyReason = function(path, payload, callback) {
  var data = JSON.stringify(payload);

  opts = {
    data: data || {},
    method: 'GET',
    apiUrl: 'employees/' + path + '/busyreasoncodes'
  };
  this.RequstApi(opts, callback);

};
// 设置坐席状态
Micc.prototype.setEmployeeState = function(path, payload, callback) {
  var data = JSON.stringify(payload);

  opts = {
    data: data || {},
    method: 'PUT',
    apiUrl: 'employees/' + path + '/state'
  };

  this.RequstApi(opts, callback);

};
// 操作会话(接听、挂断、转接、保持、取回)
Micc.prototype.conversationAction = function(path, payload, callback) {
  var data = JSON.stringify(payload);

  opts = {
    data: data || {},
    method: 'PUT',
    apiUrl: 'employees/me/conversations/' + path
  };
  this.RequstApi(opts, callback);
};
// 拨打电话
Micc.prototype.postEmployeeConversation = function(path, payload, callback) {
  var data = JSON.stringify(payload);

  opts = {
    data: data || {},
    method: 'POST',
    apiUrl: 'employees/' + path + "/conversations"
  };
  this.RequstApi(opts, callback);
};
Micc.prototype.getConversationState = function(path, payload, callback) {
  var data = JSON.stringify(payload);
  opts = {
    data: data || {},
    method: 'GET',
    apiUrl: 'employees/' + path + '/conversations'
  };
  this.RequstApi(opts, callback);
};
// 获取坐席信息
Micc.prototype.getEmployeeInfo = function(path, payload, callback) {
    var data = JSON.stringify(payload);
    // data='$expand=state,agents'
    opts = {
      data: data || {},
      method: 'GET',
      apiUrl: 'employees/' + path
    };
    this.RequstApi(opts, callback);
  }
  //获取队列信息
Micc.prototype.getQueueInfo = function(path, payload, callback) {
    var data = JSON.stringify(payload);

    opt = {
      data: data || {},
      method: 'GET',
      apiUrl: 'queues/' + path + '/conversations'
    };
    this.RequstApi(opts, callback);
  }
  // 获取排队人数
Micc.prototype.getQueuesNum = function(path, payload, callback) {
  var data = JSON.stringify(payload);

  opt = {
    data: data || {},
    method: 'GET',
    apiUrl: 'queues/' + path + '/conversations'
  };
  this.RequstApi(opts, callback);
}
