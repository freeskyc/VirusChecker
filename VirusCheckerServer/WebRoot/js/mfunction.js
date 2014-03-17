VManager = function() {
	
	var tabFunctions = new Array(); //tab 的 函数们
	var pid = 0;// 权限ID
	
	this.init = function(){
		this.initUI();
		this.initData();
	}
	

	this.initUI = function() {

		$("#tabs").tabs();
		
		if (pid == 1) {
			$("#nOsform")
					.submit(
							function(e) {
								//阻止事件冒泡,也就是屏蔽post表单，用我们自己写的
								e.preventDefault(); 
								
								var options = {
									type : "post",
									target : '#osaddtarget',
									success : function(value) {
										if (value.message != "0") {
											// alert(value.message);
											var parts = value.message
													.split("!");
											var vms = new VMRunSystem();
											vms.init(new Number(parts[0]),
													parts[1], parts[2],
													parts[3]);
											var str = "<tr class='trfcColor3'>";

											str += "<td>" + parts[0] + "</td>";
											str += ("<td>" + parts[1] + "</td>");
											str += ("<td>" + parts[2] + "</td>");
											str += ("<td>0</td>");
											str += ("<td><a class='table-a' href='javascript:void(0)' onclick='manager.deleteVMOS("
													+ parts[0] + ",this)'>删除</a></td>");
											str += ("</tr>");

											$("#oslinkTbody").append(str);

											nowSysVMInfo.push(vms);
											//changeUISystemSelect();

										} else {
											alert("系统新增失败");
										}

									}
								};
								$('#nOsform').ajaxSubmit(options);

							});
		}
	};


	
	this.initData = function(){
		tabFunctions.push(changeTabToIndex);
		tabFunctions.push(changeTabToFileCheck);
		tabFunctions.push(changeTabToVMManager);
		tabFunctions.push(changeTabToVMSPManager);
		tabFunctions.push(changeTabToVMOSManager);
		tabFunctions.push(changeTabToHistoryFile);
	}
	
	// ////////////////////////////////////////////////////
	// /改变Tab选项模块

	this.changeTab = function(index) {
		tabFunctions[index]();
	}
	
	changeTabToIndex = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>欢迎使用</h1></div>");
	}

	changeTabToFileCheck = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>开始文件安全监测</h1></div>");
		rebuildHistoryFileList();

	}
	
	changeTabToVMManager = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>虚拟机添加删除管理</h1></div>");
		// changeSelectItemStyle();
	}

	changeTabToVMSPManager = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>虚拟机管理</h1></div>");
	}

	changeTabToVMOSManager = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>虚拟机系统管理</h1></div>");
	}

	changeTabToHistoryFile = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>检测样本的历史记录</h1></div>");
		$("#historyRecordDiv").html("正在获取数据中...");
		changeHistoryFileTable();
	}
	// ////////////////////////////////////////////////////
	
	this.addNewOS = function(){
		if ($(".osupload").val() == "" || $(".osupload_close").val() == ""
			|| $("#nOsVersion").val() == "" || $("#nOsName").val() == "") {
			alert("必要的数据不能为空");
			return false;
		}
	}
	
	/*
	 * this.deleteVMOS()
	 * 删除一个系统
	 */
	this.deleteVMOS = function(sysid, object) {
		var url = "ajaxDeleteOSAction.action";
		var data = "sysid=" + sysid;
		
		//回调函数，它的value就是一个action的this。。
		var callback = function(value) {
			if (value.message == "1") {
				
				$(object).closest("tr").remove(); //面板上删除那一行
				
				var vms = searchSysOsInfo(sysid);
				nowSysVMInfo.splice($.inArray(vms, nowSysVMInfo), 1); //从list中删除这一项
				
				//changeUISystemSelect();
			} else if (value.message == "2") {
				alert('系统含有子虚拟机，无法删除');
			} else {
				alert('删除失败');
			}
		};
		ajaxSendInfo(url, data, callback);
	}
	

	/*
	 * searchSysOsInfo()
	 *  从系统中查找特定系统
	 */
	searchSysOsInfo = function(sysid) {
		var length = nowSysVMInfo.length;
		for ( var i = 0; i < length; i++) {
			var vms = nowSysVMInfo[i];
			if (vms.sysid == sysid) {
				return vms;
			}
		}
		return null;
	}
	
	this.setPid = function(tpid) {
		pid = tpid;
	}
	
	/*
	 * ajaxSendInfo()
	 * 帮助POST数据到指定url
	 */
	ajaxSendInfo = function(url, data, callback) {
		$.ajax({
			type : "POST",
			url : url,
			data : data,
			dataType : "json",
			success : callback
		});
	}

	
	
	/* 所有的虚拟机，管理员用 */
	VMRunSystem = function() {
		this.sysid = 0;
		this.sysname = "";
		this.sysversion = "";
		this.sysurl = "";
		this.init = function(sysid, sysname, sysversion, sysurl) {
			this.sysid = sysid;
			this.sysname = sysname;
			this.sysversion = sysversion;
			this.sysurl = sysurl;
		};

		this.linkNumber = 0;
	};
	
	// 虚拟机管理模块
	var nowSysVMInfo = new Array();// 所有虚拟机系统内容-Manager
	var nowUserOwnVMInfo = new Array();// 所有虚拟机信息-Manager
	
	changeUISystemSelect = function() {
		var l = nowSysVMInfo.length;
		var str = "";
		for ( var i = 0; i < l; i++) {
			var item = nowSysVMInfo[i];
			str += "<option value='" + item.sysid + "'>" + item.sysname + " "
					+ item.sysversion + "</option>";
		}

		$('.dyosselect').html(str);

	}
	
	
};