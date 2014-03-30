



VManager = function() {
		
	/************************************************************
	 * 
	 * 整个系统的初始化工作有：
	 * initUI()
	 * initData() - 截获提交表单
	 * tab 初始化和changeTab的处理
	 * 一些公共的辅助函数如：ajaxSendInfo() ，setPid()
	 * 
	 ***********************************************************/
	var tabFunctions = new Array(); //tab 的 函数们
	var pid = 0;// 权限ID
	
	this.init = function(){
		this.initUI();
		this.initData();
	}
	
	/*
	 * tab 初始化和表单的截获处理
	 */
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
											changeUISystemSelect(); //选择项也要更新

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
	
	/*
	 * tab 选项
	 */
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
	
	/*
	 * setPid()，在判断用户类型的时候用到。
	 * 设置当前的用户权限
	 */
	this.setPid = function(tpid) {
		pid = tpid;
	}
	
	/************************************************************
	 * 
	 *操作系统管理模块
	 * 
	 ***********************************************************/
	
	var nowSysVMInfo = new Array();// 目前在运行的时候用户已经有的虚拟机。
																		//	sysid ，sysname，sysversion，sysurl				
	/*
	 * 添加一个新的OS，此处并没有用到AJax技术
	 * 单纯判断下逻辑是否正常，在表单上标记了action地址
	 * 表单id=nOsform，在initData()中才开始截获表单，那个时候用到了ajax
	 */
	this.addNewOS = function(){
		if ($(".osupload").val() == "" || $(".osupload_close").val() == ""
			|| $("#nOsVersion").val() == "" || $("#nOsName").val() == "") {
			alert("必要的数据不能为空");
			return false;
		}
	}
	
	/*
	 * 删除一个OS
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
				
				changeUISystemSelect();
			} else if (value.message == "2") {
				alert('系统含有子虚拟机，无法删除');
			} else {
				alert('删除失败');
			}
		};
		ajaxSendInfo(url, data, callback);
	}
	
	/*
	 *  addNowSysVMInfo ，往这个nowSysVMInfo里面加入新的元素
	 * 在index.jsp中，拿到index.action传过来的数据后，调用该函数
	 */
	this.addNowSysVMInfo = function(sysid, sysname, sysversion, sysurl) {
		var vms = new VMRunSystem();
		vms.init(sysid, sysname, sysversion, sysurl);
		nowSysVMInfo.push(vms);
	}
	
	/*
	 *  addNowSysVMInfo的辅助函数
	 *  初始化一个系统
	 */
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
	
	/*
	 * searchSysOsInfo()
	 *  从系统中查找特定系统
	 */
	searchSysOsInfo = function(sysid) {
		var length = nowSysVMInfo.length;
		//alert(" "+length);
		for ( var i = 0; i < length; i++) {
			var vms = nowSysVMInfo[i];
			if (vms.sysid == sysid) {
				return vms;
			}
		}
		return null;
	}
	
	/*
	 *  更新操作系统的选择项
	 * 在：this.deleteVMOS() 和 this.initUI() 中用到了
	 */
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
	
	/************************************************************
	 * 
	 * 虚拟机管理模块
	 * 
	 * 
	 ***********************************************************/
	// 虚拟机管理模块
	
	var vmstatusInfo = new Array();// 虚拟机状态-文本集合
	var vmstinfoColor = new Array();// 虚拟机状态-颜色集合
	
	/* 
	 * 添加虚拟机状态文本颜色 
	 * index.jsp中拿到index.action的属性后调用
	 */
	this.addStatusInfo = function(info, color) {
		vmstatusInfo.push(info);
		vmstinfoColor.push(color);
	}


	/*
	 * 新增虚拟机
	 */
	this.addNewVM = function() {
		var url = "ajaxAddNewVMAction.action";
		var sysid = $(".jq_chosenV").val();
		var ipadd = $("#nVmIp").val();
		var port = $('#nVmPort').val();
		var runstatus = $(".rstatusSelect").val();
		// alert(sysid+"d"+runstatus);

		if (ipadd == "" || port == "") {
			alert('必要数据不能为空!');
			return;
		}

		var data = "sysid=" + sysid + "&ipadd=" + ipadd + "&port=" + port
				+ "&runstatus=" + runstatus;
		
		var callback = function(value) {
			if (value.message != "0") {
				// action的msg返回vmid！
				var vmid = value.message;
				var str = "";
				var vms = searchSysOsInfo(sysid);
				//alert(vms);
				str += "<tr class='trfcColor3'>";
				str += "<td>" + vmid + "</td>";
				str += "<td>" + vms.sysname + "</td>";
				str += "<td>" + vms.sysversion + "</td>";
				str += "<td>" + ipadd + "</td>";
				str += "<td>" + port + "</td>";
				str += "<td>/</td>";
				str += "<td>" + vmstatusInfo[runstatus] + "</td>";
				str += "<td><a class='table-a' href='javascript:void(0)' onclick='manager.deleteVM("
						+ vmid + ",this)'>删除</a></td>";
				str += "</tr>";

				$("#VMManagerListTbody").append(str);

			} else {
				alert("添加失败");
			}
		};
		ajaxSendInfo(url, data, callback);
	}
	
	/*
	 *  删除虚拟机
	 */
	this.deleteVM = function(vmid, object) {
		var url = "ajaxDeleteVMAction.action";
		var data = "vmid=" + vmid;
		var callback = function(value) {
			if (value.message == "1") {
				$(object).closest("tr").remove();
			} else {
				alert("删除失败");
			}
		};
		ajaxSendInfo(url, data, callback);
	}
	
	/************************************************************
	 * 
	 * 个人机器管理模块
	 * 
	 * 
	 ***********************************************************/
	
	var nowUserOwnSIdVMNumberInfoList = new Array();// 所有虚拟机信息-Manager

	
	/* 
	 * 用户拥有的虚拟机数（系统号与数量）
	 */
	this.NowUserOwnSidVMNumberInfo = function() {
		this.sysid = 0;
		this.number = 0;
		this.init = function(sysid, number) {
			this.sysid = sysid;
			this.number = number;
		}
	};
	
	/*
	 *  添加新的虚拟机sid-number 的info
	 */
	this.addNowUserOwnSidVMNumberInfo = function(sysid, number) {
		var vms = new this.NowUserOwnSidVMNumberInfo();
		vms.init(sysid, number);
		nowUserOwnSIdVMNumberInfoList.push(vms);
	}
	
	/*
	 * 添加新的系统info
	 */ 
	this.addNewUserOS = function() {
		var sysid = $(".jq_chosen").val();
		var nowUserOwnSIdVMNumberInfoListLength = nowUserOwnSIdVMNumberInfoList.length;
		alert("nowUserOwnSIdVMNumberInfoListLength is:"+nowUserOwnSIdVMNumberInfoListLength);
		var i = 0;
		for (i = 0; i < nowUserOwnSIdVMNumberInfoListLength; i++) {
			var vms = nowUserOwnSIdVMNumberInfoList[i];
			if (vms.sysid == sysid) {
				break;
			}
		}
		if (i < nowUserOwnSIdVMNumberInfoListLength) {
			alert('选择的系统已存在，请在上面区域操作');
			return;
		}
		
		var number = 1;

		var callback = function(value) {
			alert("1-------"+value.message);
			if (value.message == "1") {
				var item = searchSysOsInfo(sysid);
				alert(sysid+"");
				if (item == null) {
					alert('添加失败');
					return;
				}

				var osurl = item.sysurl;
				var osversion = item.sysversion;
				var osname = item.sysname;
				var ownnumber = 1;
				var osid = sysid;
				var str = "";
				str += "<div class='fcvmslistitem'>";
				str += "<div class='fcvmslisticon'>";
				str += "<img src='./img/osinfo/" + osurl + ".png' />";
				str += "</div>";

				str += "<div>";
				str += "<table  class='usostable'><thead class='mhiden'><tr><td></td><td></td><td></td><td></td><tr></thead>";
				str += "<tbody>";
				str += "<tr class='trfcColor1'><td><b>系统</b></td><td>" + osname
						+ "</td></tr>";
				str += "<tr class='trfcColor2'><td><b>版本</b></td><td>"
						+ osversion + "</td></tr>";
				str += "<tr class='trfcColor1'><td><b>数量</b></td><td class='usostabletd'>"
						+ ownnumber + "</td></tr>";
				str += "<tr class='trfcColor2'><td><a class='table-a' href='javascript:void(0)' onclick='manager.addOrDeleteUserOS("
						+ osid + ",1,this)'><b>增加</b></a></td>";
				str += "<td><a class='table-a' href='javascript:void(0)' onclick='manager.addOrDeleteUserOS("
						+ osid + ",-1,this)'><b>删除</b></a></td></tr>";
				str += "</tobdy>";
				str += "</table>";
				str += "</div>";
				str += "</div>";

				str +="<script>manager.addNowUserOwnSidVMNumberInfo("+osid+","+ownnumber+")</script>"; 
				 alert('添加成功')
				 
				$("#VMManagerListDiv").append(str);
				
				;
			} else {
				alert('添加失败');
			}
		};
		alert("sysid = "+sysid+", number = "+number);
		
		this.addUserOSRequest(sysid, number, callback);
	};
	
	/*
	 * 管理 用户 虚拟机数量的辅助函数
	 */
	this.addUserOSRequest = function(sysid, number, callback) {
		var url = "ajaxManagerUserVMNumberAction.action";
		var data = "sysid=" + sysid + "&number=" + number;

		ajaxSendInfo(url, data, callback);
	}
	
	/*
	 *  增加或删除虚拟机系统，远程
	 */
	this.addOrDeleteUserOS = function(sysid, number, object) {
		var callback = function(value) {
			if (value.message == "1") {
				var pare = $(object).closest(".fcvmslistitem");
				// pare.remove();
				var vms = searchUserSIDLinkNumber(sysid);
				if (vms == null) {
					alert('处理失败');
				} else {
					var n = vms.number + number;
					if (n <= 0) {
						nowUserOwnSIdVMNumberInfoList.splice($
								.inArray(vms, nowUserOwnSIdVMNumberInfoList), 1);
						pare.remove();
					} else {
						vms.number = n;
						var it = pare.find(".usostabletd");
						it.html(n);
					}

					// alert('处理成功');
				}

			} else {
				alert('处理失败');
			}
		};
		alert("object is :"+object);
		
		this.addUserOSRequest(sysid, number, callback);
	}

	/*
	 * sysid-number  通过虚拟机系统
	 */ 
	searchUserSIDLinkNumber = function(sysid) {
		var length = nowUserOwnSIdVMNumberInfoList.length;
		for ( var i = 0; i < length; i++) {
			var vms = nowUserOwnSIdVMNumberInfoList[i];
			if (vms.sysid == sysid) {
				return vms;
			}
		}
		return null;
	}
	
	
};