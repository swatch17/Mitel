var UI = {
	main: function(data) {
		switch (data) {
			case 'employeeconversationremoved':
				{
					UI.employeeconversationremoved(data);
				}
				break;
		}

	},
	phone: function(data) {
		switch (data) {
			case 'Offered':
				{//来电
					UI.CallRing(data);
				}
				break;
			case 'NonAcd':
				{//接听
					UI.AnswerPhone(data);
				}
				break;
			case 'Held':
				{//保持
					UI.HeldPhone(data);
				}
				break;

		}
	},
	//来电
	CallRing: function(data) {
		$('#btn-call').attr('disabled', 'disabled');
		UI.enableBtn('#answer');

		var req = phoneInfo;
		Alert.callInAlert(); //呼入弹屏
		console.log(req);


		console.log("callingNum"+req.callingNum);
		console.log("calledNum"+req.calledNum);
		console.log("callId"+req.callId);
		console.log("line"+req.line);


		SoftPhoneAction.callInAction(req);

	},
	AnswerPhone: function(data) {
		UI.enableBtn('#drop,#hold,#trans');
		UI.disableBtn('#btn-call,#answer,#btn-logout');
		UI.liveBtn("#answer");
	},
	HeldPhone: function(data) {
		UI.enableBtn('#takeBack');
		UI.disableBtn('#answer,#drop,#hold,#trans,#btn-logout');
		UI.liveBtn('#hold');
	},
	//挂断
	employeeconversationremoved: function(data) {
		UI.disableBtn('#answer,#drop,#hold,#trans,#takeBack');
	},

	disableBtn: function(id) {
		$(id).attr('disabled', 'disabled').parents().removeClass('live').removeClass('enabled').addClass('disabled');
	},
	enableBtn: function(id) {
		$(id).removeAttr('disabled').parents().removeClass('disabled').removeClass('live').addClass('enabled');
	},
	liveBtn: function(id) {
		$(id).parents().addClass('live');
	}

};
