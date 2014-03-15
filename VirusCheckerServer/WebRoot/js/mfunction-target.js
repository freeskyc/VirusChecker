/*用户上传的历史文件信息*/
HistoryFile = function() {
	this.bfileName = "";
	this.fileName = "";
	this.date;
	this.init = function(fileName, bfileName, date) {
		this.fileName = fileName;
		this.bfileName = bfileName;
		this.date = date;
	};
};

/* Monitor Status Item */
MonitorStatusItem = function() {
	this.vmid = 0;
	this.mstatus = 0;
};
/* 貌似没用 */
VMRunBStatus = function() {
	this.vmid = new Array();
};

/* 用户拥有的虚拟机数（系统号与数量） */
VMUserSysInfo = function() {
	this.sysid = 0;
	this.number = 0;
	this.init = function(sysid, number) {
		this.sysid = sysid;
		this.number = number;
	}
};

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

/* 用户分配到正在运行虚拟机 */
VMRunItemStatus = function() {
	this.sysid = 0;
	this.vimid = 0;
	this.runstatus = 0;
	this.ipadd = "";
	this.port = 0;
	this.init = function(vmid, ipadd, port, runstatus, sysid) {
		this.vmid = vmid;
		this.ipadd = ipadd;
		this.port = port;
		this.runstatus = runstatus;
		this.sysid = sysid;
	};
};

/* 貌似没用 */
VMRunStatus = function() {
	this.vmid = new Array();
	this.ipadd = new Array();
	this.port = new Array();
	this.runstatus = new Array();
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

	this.addRunInfo = function(vmid, ipadd, port, runstatus) {
		this.vmid.push(vmid);
		this.ipadd.push(ipadd);
		this.port.push(port);
		this.runstatus.push(runstatus);
	};

};

VManager = function() {
	var tabFunctions = new Array();// Tab 跳转时触发的函数
	var pid = 0;// 权限ID
	var lastStatus = 1;// 运行状态为OK的最大值
	var runstatusArray = [ "运行中", "闲置中", "关闭中", "获取失败", "暂停中", "切换中" ];
	var runstatusswitchArray = [ "正在关机", "正在开机", "正在恢复" ];

	this.setPid = function(tpid) {
		pid = tpid;
	}

	this.init = function() {
		this.initUI();
		this.initData();
	}

	this.initUI = function() {

		$("#tabs").tabs();
		$("#fccontent").css("width", baseMoveLength * fcmaxprocess + "px");
		// $(".jq_chosen").chosen();
		$("#sampleform").submit(
				function(e) {
					e.preventDefault();
					// alert('a');
					var options = {
						type : "post",
						target : '#fcfileMessage',
						success : function(value) {
							if (value.message != "no") {
								fileHasSend = true;
								sendedFileName = value.message;
								baseFileName = $("#upload").val();
								$("#fcfileMessage").html("文件已经上传完毕");

								var nfile = new HistoryFile();
								nfile.init(sendedFileName, baseFileName,
										getCurrentDate());
								historyUploadFileArray.push(nfile);
							} else {
								$("#fcfileMessage").html("文件上传失败");
							}

						}
					};
					$("#fcfileMessage").html("文件上传中");
					$('#sampleform').ajaxSubmit(options);

				});

		if (pid == 1) {
			this.initSPManagerTable();

			$("#nOsform")
					.submit(
							function(e) {
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
											changeUISystemSelect();

										} else {
											alert("系统新增失败");
										}

									}
								};
								$('#nOsform').ajaxSubmit(options);

							});
		}
	};

	this.initData = function() {
		tabFunctions.push(changeTabToIndex);
		tabFunctions.push(changeTabToFileCheck);
		tabFunctions.push(changeTabToVMManager);
		tabFunctions.push(changeTabToVMSPManager);
		tabFunctions.push(changeTabToVMOSManager);
		tabFunctions.push(changeTabToUrlMonitor);
		tabFunctions.push(changeTabToHistoryFile);
		this.initFC();
	};

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

	changeTabToUrlMonitor = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>检测URL是否安全</h1></div>");
	}

	changeTabToHistoryFile = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>检测样本的历史记录</h1></div>");
		$("#historyRecordDiv").html("正在获取数据中...");
		changeHistoryFileTable();
	}

	// /////////////////////////////////////////
	changeHistoryFileTable = function() {
		var url = "ajaxGetHistoryFileAction.action";
		var callback = function(value) {
			if (value.message != "0") {
				$("#historyRecordDiv").html("历史文件数据获取失败");
			} else {
				buildHistoryFileInfoNewTable(value.list);
			}
		}

		ajaxSendInfo(url, null, callback);
	}

	buildHistoryFileInfoNewTable = function(list) {
		var l = list.length;
		var str = "<table class='display stylized'><thead><tr class='thfcColor'><td>文件编号</td><td>文件名</td>"
				+ "<td>上传时间</td><td>病毒标记</td><td>操作时间</td></tr></thead><tbody>";
		for ( var i = 0; i < l; i++) {
			var item = list[i];
			var dd = i % 2 + 1;
			str += "<tr class='trfcColor" + dd + "'>";
			str += "<td>" + item["fid"] + "</td>";
			str += "<td>" + item["bfilename"] + "</td>";
			str += "<td>" + item["date"].substring(0, 10) + "</td>";
			if (item["isvirus"] == 2 || item["isvirus"] == "2") {
				str += "<td>是</td>";

			} else {
				str += "<td>否</td>";
			}
			if (item['ldate'] == null || item['ldate'] == "null") {
				str += "<td>/</td>";
			} else {
				str += "<td>" + item["ldate"].substring(0, 10) + "</td>";
			}
			str += "</tr>";
		}
		str += "</tbody></table>";

		$("#historyRecordDiv").html(str);
	}

	// ////////////////////////////////////////////////////////////////////////////////////////
	// 文件监控模块
	var fcprocess = 0;// 当前步骤
	var fcmaxprocess = 4;// 最大步骤数
	var baseMoveLength = 990;// 步骤移动距离
	var moveSpeed = 1000;//
	var fcpArray = new Array();// 步骤切换时，触发函数

	// ///////////////////////////Process 1
	var fileHasSend = false;// 文件是否上传标志
	var sendedFileName = "";// 选择的服务端文件
	var baseFileName = "";// 选择文件的原来文件名
	var selectHistoryStatus = false;// 是否是选择历史文件标志

	var historyUploadFileArray = new Array();// 历史文件记录

	// //////////////////////////Process 2

	var fcslitemnumber = 6;// 布局中每行最大显示块数量

	// //////////////////////////////Before Pcrocess
	this.initFC = function() {
		fcpArray.push(buildVMSelectArea);
		fcpArray.push(startMonitor);
		fcpArray.push(rebuildHistoryFileList);
		// fcpArray.push(startFCCreateReport);
	};

	fcnext = function(index) {
		var left = $("#fccontent").css("left");
		var movedis = 0;
		if (left == "auto") {
			movedis = -baseMoveLength;
		} else {
			var l = left.length;
			var d = left.substr(0, l - 2);
			// alert(d+"-"+left);
			movedis = new Number(d);
			movedis -= baseMoveLength;
			// alert(moveid+"ds"+d);

		}

		$("#fccontent").animate({
			left : movedis
		}, moveSpeed, function() {
			if (index >= 0) {
				fcpArray[index]();
			}

		});
	};

	this.fcnext = function(index) {
		fcnext(index);
	};

	// 取消监控，返回P1
	backFCP1 = function() {
		baseFileName = "";
		sendedFileName = "";
		fileHasSend = false;
		selectHistoryStatus = false;
		isMonitorStart = false;

		resetSelectOfHistoryFile();

		$("#fccontent").animate({
			left : 0
		}, moveSpeed, function() {

		});
	};

	this.fcup = function(index) {
		var movedis = 0;
		var left = $("#fccontent").css("left");
		if (left == "auto") {
			movedis = 0;
		} else {
			var l = left.length;
			var d = left.substr(0, l - 2);

			movedis = new Number(d);
			movedis += baseMoveLength;

		}

		$("#fccontent").animate({
			left : movedis
		}, moveSpeed, function() {
			if (index >= 0) {
				fcpArray[index]();
			}
		});
	};

	// ///////////////////////////////Process 1

	/* 重构历史文件选择表格 */
	rebuildHistoryFileList = function() {
		var size = historyUploadFileArray.length;
		var str = "";
		if (size <= 0) {
			str = "没有历史文件";
		} else {
			str += "<table class='display stylized' id='historyFileTable'><thead class='thfcColor'><tr><td>序号</td>文件名<td></td><td>上传时间</td><td>操作</td><tr></thead>";
			str += "<tbody>";
			for ( var i = 0; i < size; i++) {
				var dd = i % 2;
				str += "<tr class='trfcColor" + dd + "'><td>" + (i + 1)
						+ "</td><td>" + historyUploadFileArray[i].bfileName
						+ "</td>";
				str += "<td>" + historyUploadFileArray[i].date + "</td>";
				str += "<td><input class='chfcheckbox' type='checkbox' onclick='manager.historyFileSelect("
						+ i + ",this)'/></td></tr>";
			}
			str += "</tobdy>";
			str += "</table>";
		}
		$("#fcselectHistoryFileArea").html(str);
	}

	resetSelectOfHistoryFile = function() {
		$("#historyFileTable").find(".chfcheckbox").each(function() {
			if ($(this).attr("checked") == true) {
				$(this).removeAttr("checked");
			}
		});

	}

	/* 获得当前特定时间 */
	getCurrentDate = function() {
		var d = new Date();
		return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
	};

	/* 当历史文件CheckBox选择时触发的函数 */
	this.historyFileSelect = function(tid, object) {
		// alert(getCurrentDate());
		// if ($(object).attr("checked") == true)
		// alert($(object).attr("checked"))
		if ($(object).attr("checked") == "checked") {
			var list = $("#historyFileTable").find(".chfcheckbox");
			var length = list.length;
			for ( var i = 0; i < length; i++) {
				if ($(list[i]).attr("checked")) {
					$(list[i]).removeAttr("checked");
				}
			}
			;

			// alert(object);

			$(object).attr("checked", 'true');
			var item = historyUploadFileArray[tid];
			sendedFileName = item.fileName;
			baseFileName = item.bfileName;
			selectHistoryStatus = true;

		} else {
			var list = $("#historyFileTable").find(".chfcheckbox");
			var length = list.length;
			for ( var i = 0; i < length; i++) {
				if ($(list[i]).attr("checked")) {
					$(list[i]).removeAttr("checked");
				}
			}
			;
			selectHistoryStatus = false;
		}

	};

	this.addHistoryFile = function(fileName, bfilename, date) {
		var file = new HistoryFile();
		file.init(fileName, bfilename, date);
		historyUploadFileArray.push(file);
	}

	/* 貌似没用 */
	this.changeFileHSStatus = function() {
		fileHasSend = !fileHasSend;
	};

	// /////////////////////////////////Process 2
	/* 在FC步骤2中刷新虚拟机状态 */
	this.freshFCVM = function() {
		var l = vmstatusCollection.length;
		if (l <= 0) {
			return;
		}
		var data = "";
		for ( var i = 0; i < l - 1; i++) {
			var vms = vmstatusCollection[i];
			data += (vms.vmid + ",");
		}

		data += vmstatusCollection[l - 1].vmid;

		var sdata = "vmids=" + data;

		var url = "ajaxfreshVMAction.action";

		var callback = function(value) {
			if (value.message == "-1") {
				alert("刷新虚拟机失败");
				// $("#freshstatudd").html("刷新虚拟机失败");
			} else {
				var length = value.rstatus.length;
				if (length != l) {
					alert("虚拟机数量错误");
					// $("#freshstatudd").html("虚拟机数量错误");
				} else {
					freshFCVMStatus(value.rstatus);
					buildVMSelectArea();
					// $("#freshstatudd").html("刷新虚拟机完毕");
				}
			}
		};

		ajaxSendInfo(url, sdata, callback);
	};

	freshFCVMStatus = function(rstatus) {
		var l = rstatus.length;
		for ( var i = 0; i < l; i++) {
			var vms = vmstatusCollection[i];
			vms.runstatus = rstatus[i];
		}
	}

	/* 构建可用虚拟机列表 */
	buildVMSelectArea = function() {
		var str = "";
		var length = vmstatusCollection.length;
		var count = 0;
		for ( var i = 0; i < length; i++) {
			var vmstatus = vmstatusCollection[i].runstatus;
			if (vmstatus > lastStatus) {
				continue;
			}

			var vmst = vmstatusCollection[i].vmid;

			var osid = vmstatusCollection[i].sysid;
			var size = vmst.length;

			var ositem = findSystemItem(osid);

			if (ositem == null) {
				continue;
			}

			var osurl = ositem.sysurl;
			var osname = ositem.sysname;
			var osversion = ositem.sysversion;

			count++;
			if (count % fcslitemnumber == 1) {
				str += "<div>";
			}

			str += "<div class='fcvmslistitem'>";
			str += "<div class='fcvmslisticon'>";
			str += "<img src='./img/osinfo/" + osurl + ".png' />";
			str += "</div>";

			str += "<div>";
			str += "<table id='fccrtable' class='fccrtable'><thead class='mhiden'><tr><td></td><td></td><td></td><td></td><tr></thead>";
			str += "<tbody>";
			str += "<tr class='trfcColor1'><td><b>系统</b></td><td>" + osname
					+ "</td></tr>";
			str += "<tr class='trfcColor2'><td><b>版本</b></td><td>" + osversion
					+ "</td></tr>";
			str += "<tr class='trfcColor1'><td><b>编号</b></td><td class='fcvmid'>"
					+ vmst + "</td></tr>";
			str += "<tr class='trfcColor2'><td><b>选择这台</b></td><td><input type='checkbox' class='fcsinput'></td></tr>";
			// str+="<tr class='trfcColor1
			// mhiden'><td>"+osid+"</td><td>"+vmst+"</td></tr>";
			str += "</tobdy>";
			str += "</table>";
			str += "</div>";
			str += "</div>";

			if (count % fcslitemnumber == 0) {
				str += "<div class='clearB'></div>";
				str += "</div>";
			}

		}

		if (count % fcslitemnumber != 0) {
			str += "<div class='clearB'></div>";
			str += "</div>";
		}
		str += "<div class='clearB heigth20'></div>";
		str += "<div><span class='checkfileStyle'>需要检查的文件：</span><span>"
				+ baseFileName + "</span></div>";

		$("#fcRunVMDiv").html(str);

		// initCRTable("fccrtable");
	};

	initCRTable = function(name) {
		$('#' + name).dataTable({
			"bFilter" : false,
			"bSort" : false,
			"bPaginate" : false,
			"bLengthChange" : false,
			"bInfo" : false,
			"bAutoWidth" : false
		});
	};

	this.fcmoveToSelectVM = function(index) {
		if (!fileHasSend && !selectHistoryStatus) {
			alert("文件未上传!");
			return;
		}
		this.fcnext(index);
	}

	/* 清理文件上传与否消息内容 */
	this.clearFCInfo = function() {
		$("#fcfileMessage").html("");
		fileHasSend = false;
	};

	this.fcAjaxForm = function() {

		var fileName = $("#upload").val();
		if (fileName == "") {
			alert("请选择一个文件!");
			return false;
		}

		// $("#sampleform").submit();

		/*
		 * var dados = $("#sampleform").serialize(); $.ajax({ type: "POST", url:
		 * "uploadFileAction.action", data: dados, success: function( data ) {
		 * alert( data.message ); } });
		 */

		// return false;
		/*
		 * var options = { type:"post", target: '#fcfileMessage', success:
		 * function(value) { if (value.message!="no") { fileHasSend=true;
		 * sendedFileName=value.message; $("#fcfileMessage").val("文件已经上传完毕"); }
		 * else { $("#fcfileMessage").val("文件上传失败"); } } };
		 * 
		 * 
		 * $('#sampleform').ajaxForm(options);
		 */

		// $("#fcfileMessage").val("文件上传中");
		// return false;
	};

	// ////////////////////////////////////////////// Process 3
	var monitorItemCollection; // 监控VM '编号' 序列
	var isMonitorStart = false;// 是否开始监控
	var monitorProgressCollection = [ "监控中", "运行完毕" ];
	var lastMonitorProgressStatus = 1;
	// 开始监控
	startMonitor = function() {
		isMonitorStart = true;
		ajaxSendStartMoitorSingal();

	};

	ajaxSendStartMoitorSingal = function() {
		var url = "ajaxSendStartMoitorSingalAction.action";
		var data = "vmids=" + getMonitorItemStr() + "&filename="
				+ sendedFileName;
		var callback = function(value) {
			if (value.message != "-1") {
				var t = new Date();
				lastFCMonitorTime = t.getTime();
				// ||||||||||||
				// alert("start progress at"+lastFCMonitorTime);
				setTimeout(checkFCMonitorProcess, checkMonitorTimeDis);
			} else {
				alert("启动检测失败");
			}

		};

		ajaxSendInfo(url, data, callback);

	};

	// 将被检测的虚拟机ID构成字符串
	getMonitorItemStr = function() {
		var l = monitorItemCollection.length;
		var str = "";
		if (l > 0) {
			for ( var i = 0; i < l - 1; i++) {
				str += (monitorItemCollection[i].vmid + ",");
			}
			str += monitorItemCollection[l - 1].vmid;
		}

		return str;

	};

	// 构建被检测虚拟机状态列表
	buildMoitorVMInfo = function() {
		var str = "";
		var length = monitorItemCollection.length;
		var count = 0;
		for ( var i = 0; i < length; i++) {
			var vms = findRunVMItemByVmid(monitorItemCollection[i].vmid);
			var vmst = vms.vmid;
			var osid = vms.sysid;
			var size = vmst.length;

			var ositem = findSystemItem(osid);

			if (ositem == null) {
				continue;
			}

			var osurl = ositem.sysurl;
			var osname = ositem.sysname;
			var osversion = ositem.sysversion;

			count++;

			if (count % fcslitemnumber == 1) {
				str += "<div>";
			}

			str += "<div class='fcvmslistitem'>";
			str += "<div class='fcvmslisticon'>";
			str += "<img src='./img/osinfo/" + osurl + ".png' />";
			str += "</div>";

			str += "<div>";
			str += "<table id='fccrtable' class='fccrtable'><thead class='mhiden'><tr><td></td><td></td><td></td><td></td><tr></thead>";
			str += "<tbody>";
			str += "<tr class='trfcColor1'><td><b>系统</b></td><td>" + osname
					+ "</td></tr>";
			str += "<tr class='trfcColor2'><td><b>版本</b></td><td>" + osversion
					+ "</td></tr>";
			str += "<tr class='trfcColor1'><td><b>编号</b></td><td class='fcvmid'>"
					+ vmst + "</td></tr>";
			str += "<tr class='trfcColor2'><td><b>进度</b></td><td id='fcMonitorVMProgress-"
					+ vmst + "'>" + monitorProgressCollection[0] + "</td></tr>";
			// str+="<tr class='trfcColor1
			// mhiden'><td>"+osid+"</td><td>"+vmst+"</td></tr>";
			str += "</tobdy>";
			str += "</table>";
			str += "</div>";
			str += "</div>";

			if (count % fcslitemnumber == 0) {
				str += "<div class='clearB'></div>";
				str += "</div>";
			}

		}

		if (count % fcslitemnumber != 0) {
			str += "<div class='clearB'></div>";
			str += "</div>";
		}
		str += "<div class='clearB heigth20'></div>";
		str += "<div><span class='checkfileStyle'>检查的文件：</span><span>"
				+ baseFileName + "</span></div>";

		$("#fcMonitorVMDiv").html(str);

	};

	// 停止监控
	this.stopMonitor = function() {
		isMonitorStart = false;

		var callback = function(value) {
			alert(value.message);
		};
		ajaxStopMontior(callback);
		// alert("监控已经被取消");
		backFCP1();
	};

	ajaxStopMontior = function(callback) {
		var url = "ajaxStopMontiorAction.action";
		// var data="vmids="+getMonitorItemStr();
		var data = "vmids=" + getFCUnfishedMonitorVM();
		ajaxSendInfo(url, data, callback);
	};

	/* 在监控前处理内容 */
	this.beforestartMonitor = function() {
		var monitorItems = new Array();
		var tables = $(".fccrtable");
		var length = tables.length;
		for ( var i = 0; i < length; i++) {
			var checkbox = $(tables[i]).find(".fcsinput");
			// if (checkbox.attr("checked") == true)
			if (checkbox.attr("checked") == "checked") {
				var vmid = $(tables[i]).find(".fcvmid").html();
				// alert(vmid);
				var mitem = new MonitorStatusItem();
				mitem.vmid = vmid;
				monitorItems.push(mitem);
			}
		}
		if (monitorItems.length <= 0) {
			alert("至少选择一台虚拟机!");
			return;
		}

		monitorItemCollection = monitorItems;

		buildMoitorVMInfo();

		this.fcnext(1);
	};

	// 改变检测虚拟机的进度状态
	changeMonitorVMRunProgressById = function(vmid, mstatus) {
		var l = monitorItemCollection.length;
		for ( var i = 0; i < l; i++) {
			var vms = monitorItemCollection[i];
			if (vms.vmid == vmid) {
				vms.mstatus = mstatus;
				break;
			}
		}
	};

	// 获得未完成的监控的VM ID
	getFCUnfishedMonitorVM = function() {
		var str = "";
		var l = monitorItemCollection.length;
		for ( var i = 0; i < l; i++) {
			var vms = monitorItemCollection[i];
			if (vms.mstatus < lastMonitorProgressStatus) {
				str += (vms.vmid + ",");
			}
		}
		var le = str.length;
		if (le > 0) {
			str = str.substring(0, le - 1);
		}
		return str;
	};

	updateMonitorVMProgress = function(status) {
		var l = monitorItemCollection.length;
		for ( var i = 0; i < l; i++) {

			var vms = monitorItemCollection[i];
			if (vms.mstatus >= lastMonitorProgressStatus) {
				continue;
			}
			vms.mstatus = status[i];
			updateMonitorVMProgressUI(vms.vmid, vms.mstatus);
		}
	};

	updateMonitorVMProgressUI = function(vmid, mstatus) {
		$("#fcMonitorVMProgress-" + vmid).html(
				monitorProgressCollection[mstatus]);
	};

	// //////////////////////////////////////////Process 4
	// Create Report
	// var checkMonitorTimeDis=60000;
	var checkMonitorTimeDis = 30000;
	var maxCheckMonitorTimeDis = 360000;
	var lastFCMonitorTime = 0;

	var fcResultCountCollectionI = [ 20, 80, 20, 80, 20, 80 ];
	var fcResultCountCollectionII = [ 0.3, 0.4, 0.15, 0.15 ];

	var fileCheck_stateCollection = [ "安全", "警告", "严重", "高危" ];
	var fileCheck_stateFontColor = [ "green", "yellow", "red", "red" ];
	var fileCheck_stateProgressStyle = [ "progress-green", "progress-blue",
			"progress-red", "progress-red" ];

	var defaultFCReportViewticksForWindow = [ '文件风险', '进程风险', '端口风险', '注册表风险',
			'综合风险' ];
	var defaultFCReportViewticksForNoWindow = [ '文件风险', '进程风险', '端口风险', '综合风险' ];
	/*
	 * var defaultFCReportViewConfigWindow = { seriesDefaults : { renderer :
	 * $.jqplot.BarRenderer, rendererOptions : { fillToZero : true } }, axes : { //
	 * Use a category axis on the x axis and use our custom ticks. xaxis : {
	 * renderer : $.jqplot.CategoryAxisRenderer, ticks :
	 * defaultFCReportViewticksForWindow }, yaxis : { min : 0, max : 100,
	 * tickOptions : { formatString : '%d\%' } } } };
	 * 
	 * var defaultFCReportViewConfigNoWindow = { seriesDefaults : { renderer :
	 * $.jqplot.BarRenderer, rendererOptions : { fillToZero : true } }, axes : { //
	 * Use a category axis on the x axis and use our custom ticks. xaxis : {
	 * renderer : $.jqplot.CategoryAxisRenderer, ticks :
	 * defaultFCReportViewticksForNoWindow }, yaxis : { min : 0, max : 100,
	 * tickOptions : { formatString : '%d\%' } } } };
	 */

	// 当检测时间到达，但仍存在未完成处理
	fcTimeoutMonitorEvent = function() {
		var l = monitorItemCollection.length;
		for ( var i = 0; i < l; i++) {
			var item = monitorItemCollection[i];
			if (item.mstatus < lastMonitorProgressStatus) {
				$("#fcMonitorVMProgress-" + item.vmid).html("检测超时");
			}

		}

		alert("系统繁忙，部分虚拟机检测超时");
	}

	// 检测，进度获取
	checkFCMonitorProcess = function() {
		// alert('d');
		var url = "ajaxCheckMonitorFinshedAction.action";
		var data = "vmids=" + getFCUnfishedMonitorVM();
		var callback = function(value) {
			if (value.message != "-1") {
				var st = value.status;
				// alert(st);
				updateMonitorVMProgress(st);
				var mydate = new Date();
				var now = mydate.getTime();
				var lost = checkAllMonitorVMFinished();
				if (now - lastFCMonitorTime >= maxCheckMonitorTimeDis) {
					// alert('time out');
					if (lost > 0) {
						// alert('time out lost>0');
						fcTimeoutMonitorEvent();
					}
				} else {
					if (lost > 0) {
						// alert('again monitor');
						setTimeout(checkFCMonitorProcess, checkMonitorTimeDis);
					}
				}
			}
		};
		ajaxSendInfo(url, data, callback);
	};

	// 返回没有完成的虚拟机的数量
	checkAllMonitorVMFinished = function() {
		var l = monitorItemCollection.length;
		var count = 0;
		for ( var i = 0; i < l; i++) {
			var vms = monitorItemCollection[i];
			if (vms.mstatus < lastMonitorProgressStatus) {
				count++;
			}
		}
		return count;
	};

	this.beforeCreateMonitorReport = function() {
		var n = checkAllMonitorVMFinished();
		if (n > 0) {
			var r = confirm("仍有" + n + "虚拟机正在检测中，是否忽略正在检测中的虚拟机？");
			// alert(r);
			if (!r) {
				return;
			}
		}

		var url = "ajaxFCGetReportDataAction.action";
		var data = "vmids=" + getFCMonitorVmFinishedItemId();
		// var data = "vmids=2,3";
		var callback = function(value) {

			$("#fcReportFileDiv").html(baseFileName);
			if (value.message != "-1") {
				getFCReportHtml(value.list);
			}

			fcnext(-1);
		};
		ajaxSendInfo(url, data, callback);

		var ncallback = function(value) {
			// alert("T检测已经停止");
		}
		ajaxStopMontior(ncallback);
	};

	getFCReportHtml = function(list) {

		// $("#fcReportFileDiv").html(baseFileName);

		var str = "<table class='display stylized' id='fcvmReportTable'><thread><tr class='thfcColor'>";
		str += "<td>虚拟机编号</td><td>系统</td><td>版本</td><td>新增文件</td><td>更改文件</td>";
		str += "<td>删除文件</td><td>隐藏进程</td><td>变化进程</td><td>隐藏端口</td><td>变化端口</td><td>变更的注册表数</td>";
		// str+="<td>关键新增文件</td><td>关键删除文件</td><td>关键更新文件</td>";
		str += "<td>重要路径文件变化</td>";
		str += "</tr></thread><tbody>";
		var l = list.length;
		var testResult;
		var totalRisk = {
			"final" : 0,
			"osname" : "null",
			"osversion" : "null"
		};

		$("#fcReportViewDiv").html("");
		// var reportViewArray=new Array();

		for ( var i = 0; i < l; i++) {
			var item = list[i];
			var vmid = item["vmid"];
			var sysid = findRunVMItemByVmid(vmid).sysid;
			var os = findSystemItem(sysid);
			// alert(os);
			var osname = os.sysname;
			var dd = i % 2;
			str += "<tr class='trfcColor" + (dd + 1) + "'>";
			str += "<td>" + vmid + "</td>";
			str += "<td>" + osname + "</td>";
			// str+="<td>"+0+"</td>";
			// str+="<td>"+0+"</td>";
			str += "<td>" + os.sysversion + "</td>";
			str += "<td>" + item["addFileNum"] + "</td>";
			str += "<td>" + item["updateFileNum"] + "</td>";
			str += "<td>" + item["deleteFileNum"] + "</td>";
			str += "<td>" + item["processNum"] + "</td>";
			str += "<td>" + item["changePorecessNum"] + "</td>";
			str += "<td>" + item["portNum"] + "</td>";
			str += "<td>" + item["changePortNum"] + "</td>";
			if (osname.indexOf("window") >= 0) {
				str += "<td>" + item["registryNum"] + "</td>";
				/*
				 * str+="<td>"+item["sessAddFileNum"]+"</td>"; str+="<td>"+item["sessDeleteFileNum"]+"</td>";
				 * str+="<td>"+item["sessUpdateFileNum"]+"</td>";
				 */
				str += "<td>"
						+ (new Number(item["sessAddFileNum"])
								+ new Number(item["sessDeleteFileNum"]) + new Number(
								item["sessUpdateFileNum"])) + "</td>";

				// //////////////////////////////
				testResult = countIsVirusPoint(new Number(item["addFileNum"]),
						new Number(item["updateFileNum"]), new Number(
								item["deleteFileNum"]), new Number(
								item["processNum"]), new Number(
								item["changePorecessNum"]), new Number(
								item["portNum"]), new Number(
								item["changePortNum"]), new Number(
								item["registryNum"]), new Number(
								item["sessAddFileNum"]), new Number(
								item["sessDeleteFileNum"]), new Number(
								item["sessUpdateFileNum"]), 0);

				// ///////////////////////////////

			} else {
				// str+="<td>/</td><td>/</td><td>/</td><td>/</td>";
				str += "<td>/</td>";

				// //////////////////////////////
				testResult = countIsVirusPoint(new Number(item["addFileNum"]),
						new Number(item["updateFileNum"]), new Number(
								item["deleteFileNum"]), new Number(
								item["processNum"]), new Number(
								item["changePorecessNum"]), new Number(
								item["portNum"]), new Number(
								item["changePortNum"]), 0, 0, 0, 0, 1);

				// ///////////////////////////////
			}
			str += "</tr>";
			testResult["vmid"] = vmid;
			if (testResult["final"] > totalRisk['final']) {
				totalRisk['final'] = testResult["final"];
				totalRisk['osname'] = osname;
				totalRisk['osversion'] = os.sysversion;
			}

			// goForCreateVMCReportVieWI(testResult);
			goForCreateVMCReportVieWIIWithHC(testResult);

			// reportViewArray.push(testResult);

			/*
			 * goForCreateVMCReportVieWI(testResult);
			 * 
			 * testResult["vmid"]=vmid+1; goForCreateVMCReportVieWI(testResult);
			 * 
			 * testResult["vmid"]=vmid+2; goForCreateVMCReportVieWI(testResult);
			 * 
			 * testResult["vmid"]=vmid+3; goForCreateVMCReportVieWI(testResult);
			 */

		}
		str += "</tbody></table>";
		$("#fcReportDiv").html(str);
		// $("#fcvmReportTable").dataTable();

		// /////////////////////////////////
		// goForCreateVMFCReportView(reportViewArray);
		makeFCFinalProgress(totalRisk);

	};

	var defaultFCReportViewticks = [ '文件风险', '进程风险', '端口风险', '注册表风险', '综合风险' ];

	goForCreateVMCReportVieWIIWithHC = function(object) {
		var id = "fcReportViewItem-" + object["vmid"];

		var type = object['type'];
		var part = object['part'];
		var l = part.length - type;
		// alert(type+"d"+l);
		var pdata = [];
		var countZ = 0;

		for ( var i = 0; i < l; i++) {
			if (part[i] == 0 || part[i] == "0") {
				countZ++;
				continue;
			}

			var item = {};
			item["name"] = defaultFCReportViewticks[i];
			item["data"] = [ part[i] ];
			pdata.push(item);
		}

		var nitem = {};
		nitem["name"] = defaultFCReportViewticks[4];
		nitem["data"] = [ object['final'] ];
		pdata.push(nitem);

		if (countZ != l) {
			var str = "<div class='reportViewDiv' id='" + id + "'></div>";
			$("#fcReportViewDiv").append(str);
			$('#' + id)
					.highcharts(
							{
								chart : {
									type : 'column'
								},
								title : {
									text : '虚拟机-' + object['vmid'] + "运行情况"
								},
								xAxis : {
									categories : [ "检测文件风险评估" ]
								},
								yAxis : {
									min : 0,
									max : 100,
									title : {
										text : '风险程度'
									}
								},
								tooltip : {
									headerFormat : '<span style="font-size:10px">{point.key}</span><table>',
									pointFormat : '<tr><td style="color:{series.color};padding:0">{series.name}: </td>'
											+ '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
									footerFormat : '</table>',
									shared : true,
									useHTML : true
								},
								plotOptions : {
									column : {
										pointPadding : 0.2,
										borderWidth : 0
									}
								},
								series : pdata
							});
		}

		var countZero = 0;
		var totalPect = object["total"];
		var newList = [];

		for ( var i = 0; i < l; i++) {
			newList.push(totalPect[i]);
			if (totalPect[i] == 0 || totalPect[i] == "0") {
				countZero++;
			}
		}

		var leftNoZero = l - countZero;
		if (leftNoZero != 0) {
			for ( var i = 0; i < l; i++) {
				if (newList[i] == 0) {
					var pt = fcResultCountCollectionII[i] * 100 / leftNoZero;
					for ( var j = 0; j < l; j++) {
						if (newList[j] != 0) {
							newList[j] += pt;
						}
					}
				}
			}

			var tlist = [];
			for ( var i = 0; i < l; i++) {
				if (newList[i] != 0) {
					// var item={};
					// item["name"]=defaultFCReportViewticks[i];
					// item["y"]=newList[i];
					var item = [ defaultFCReportViewticks[i], newList[i] ];
					// alert(item[0]+item[1]);
					tlist.push(item);
				}
			}

			// tlist[0]["sliced"]=true;
			// tlist[0]["selected"]=true;

			var nnid = "fcReportViewItemII-" + object["vmid"];
			var str = "<div class='reportViewDiv' id='" + nnid + "'></div>";
			$("#fcReportViewDivII").append(str);

			$('#' + nnid).highcharts({
				chart : {
					plotBackgroundColor : null,
					plotBorderWidth : null,
					plotShadow : false
				},
				title : {
					text : '虚拟机-' + object["vmid"] + '风险比例'
				},
				tooltip : {
					pointFormat : '{series.name}: <b>{point.percentage}%</b>',
					percentageDecimals : 1
				},
				plotOptions : {
					pie : {
						allowPointSelect : true,
						cursor : 'pointer',
						dataLabels : {
							enabled : false
						},
						showInLegend : true
					}
				},
				series : [ {
					type : 'pie',
					name : '风险比例',
					data : tlist
				} ]
			});
		}
	};

	makeFCFinalProgress = function(risk) {
		var total = risk['final'];
		var level = getFCFileCheckRiskLevel(total);
		var str = "<table class='display stylized'><tr><td class='thfcColor'><b>有害文件的可能性</b></td><td  class='trfcColor1'>"
				+ "<div id='fcReportFinalDivProgress' class='progress full "
				+ fileCheck_stateProgressStyle[level]
				+ "'>"
				+ "<span><b></b></span></div></td>"
				+ "<td class='thfcColor'><b>最敏感系统</b></td><td  class='trfcColor1'>"
				+ risk["osname"]
				+ "  "
				+ risk["osversion"]
				+ "<td class='thfcColor'><b>综合风险</b></td><td  class='trfcColor1'>"
				+ "<span style='color:"
				+ fileCheck_stateFontColor[level]
				+ "'>" + fileCheck_stateCollection[level];
		+"</span></td></tr><table>";
		$("#fcReportFinalDiv").html(str);

		Administry.progress("#fcReportFinalDivProgress", total, 100);
	};

	getFCFileCheckRiskLevel = function(risk) {
		var r = 3;
		if (risk <= 5) {
			r = 0;
		} else if (risk > 5 && risk < 24) {
			r = 1;
		} else if (risk >= 24 && risk < 48) {
			r = 2;
		}
		return r;
	};

	goForCreateVMCReportVieWI = function(object) {
		var id = "fcReportViewItem-" + object["vmid"];
		var str = "<div class='reportViewDiv' id='" + id + "'></div>";
		$("#fcReportViewDiv").append(str);
		var type = object['type'];
		var part = object['part'];
		var l = part.length - type;
		var pdata = [];
		for ( var i = 0; i < l; i++) {
			pdata.push(part[i]);
		}

		pdata.push(object['final']);

		if (type == 0) {
			defaultFCReportViewConfigWindow["title"] = "虚拟机-" + object['vmid']
					+ "运行结果";
			var plot = $.jqplot(id, [ pdata ], defaultFCReportViewConfigWindow);
		} else {
			defaultFCReportViewConfigNWindow["title"] = "虚拟机-" + object['vmid']
					+ "运行结果";
			var plot = $.jqplot(id, [ pdata ],
					defaultFCReportViewConfigNoWindow);
		}
	};

	goForCreateVMFCReportView = function(object) {
		var length = object.length;
		var ticks = [];
		var fdata = [];
		for ( var i = 0; i < length; i++) {
			var item = object[i];
			var type = item["type"];
			var part = item['part'];
			alert(part);
			fdata.push(part);
			ticks.push("虚拟机-" + item["vmid"]);
		}

		defaultFCReportViewConfigWindow["axes"]["xaxis"]["ticks"] = ticks;

		// var plot = $.jqplot("fcReportViewI",fdata);
		// var plot = $.jqplot('fcReportViewItem-'+vmid,[data]);

	};

	var filePointI = [ 20 / 3, 50 / 3, 10, 40 / 3, 100 / 3, 20 ];
	var portPointI=[40,60];
	var processPointI=[75,25];

	countIsVirusPoint = function(fadd, fdelete, fupdate, phiden, pchange,
			thiden, tchange, rchange, cfadd, cfdelete, cfupdate, type) {
		var fcResultCollection = [ 0, 0, 0, 0 ];
		var partResultCollection = [ 0, 0, 0, 0 ];

		var bfile = 0;
		if (type == 0) {
			/*
			 * if (fadd + fdelete + fupdate > 0) { bfile +=
			 * fcResultCountCollectionI[0]; }
			 * 
			 * 
			 * if (cfadd + cfdelete + cfupdate > 0) { bfile +=
			 * fcResultCountCollectionI[1]; }
			 */
			if (fadd > 0) {
				bfile += filePointI[0];
			}
			if (fdelete > 0) {
				bfile += filePointI[1];
			}

			if (fupdate > 0) {
				bfile += filePointI[2];
			}

			if (cfadd > 0) {
				bfile += filePointI[3];
			}
			if (cfdelete > 0) {
				bfile += filePointI[4];
			}
			if (cfupdate > 0) {
				bfile += filePointI[5];
			}
		} else {
			if (fadd + fdelete + fupdate > 0) {
				// Problem
				//bfile += 0.6;
				if (fadd>0)
				{
					bfile+=20;
				}
				if (fdelete>0)
				{
					bfile+=50;
				}
				if (fupdate>0)
				{
					bfile+=30;
				}
			}
		}

		partResultCollection[0] = bfile;
		fcResultCollection[0] = bfile * fcResultCountCollectionII[0];// file

		var process = 0;
		if (pchange > 0) {
			//process += fcResultCountCollectionI[2];
			process+=processPointI[0];
		}

		if (phiden > 0) {
			//process += fcResultCountCollectionI[3];
			process+=processPointI[1];
		}

		partResultCollection[1] = process;
		fcResultCollection[1] = process * fcResultCountCollectionII[1];// process

		var port = 0;
		if (tchange > 0) {
			//port += fcResultCountCollectionI[4];
			port+=portPointI[0];
		}

		if (thiden > 0) {
			//port += fcResultCountCollectionI[5];
			port+=portPointI[1];
		}

		partResultCollection[2] = port;
		fcResultCollection[2] = port * fcResultCountCollectionII[2];// port

		// var reg=0;
		if (rchange > 0 && type == 0) {
			partResultCollection[3] = 100;
			fcResultCollection[3] = fcResultCountCollectionII[3] * 100;
		} else {
			partResultCollection[3] = 0;
			fcResultCollection[3] = 0;
		}

		var finalData = 0;
		var l = fcResultCollection.length;
		for ( var i = 0; i < l; i++) {
			finalData += fcResultCollection[i];
		}

		var result = {};
		result["total"] = fcResultCollection;
		result["part"] = partResultCollection
		result["type"] = type;
		result["final"] = finalData;

		return result;

	}

	getFCMonitorVmFinishedItemId = function() {
		var str = "";
		var l = monitorItemCollection.length;
		for ( var i = 0; i < l; i++) {
			var vms = monitorItemCollection[i];
			// if (vms.mstatus>=lastMonitorProgressStatus)
			{
				str += (vms.vmid + ",");
			}
		}
		var le = str.length;
		if (le > 0) {
			str = str.substring(0, le - 1);
		}
		// alert(str);
		return str;

	};

	startFCCreateReport = function() {
		alert('a');
	}

	this.restartFCMonitor = function() {

		if (!fcrestoreStart) {
			alert("虚拟机未恢复，请先恢复");
			// ajaxRecoverFCVM();
			return;
		}
		fcisFileVirusMark = false;
		$("#fcIsFileVirusButton").val("标记为病毒");
		$("#fcIsFileVirusButton").removeClass("btn-red");
		isMonitorStart = false;
		fcrestoreStart = false;

		backFCP1();
	};

	ajaxRecoverFCVM = function() {
		var url = "ajaxrecoverAction.action";
		var data = "vmids=" + getMonitorItemStr();
		var callback = function(value) {

		};
		ajaxSendInfo(url, data, callback);
	}

	// /////////////////////////////////////////////////////////////////////////////////////////////
	// /重载页面模块

	this.unloadStatus = false;

	this.unload = function() {
		var url = "ajaxExitAction.action";
		var callback = function(value) {
			// alert(value.message);
		};
		ajaxSendInfo(url, null, null);
	};

	this.unloadByHand = function() {
		var url = "ajaxExitAction.action";
		this.unloadStatus = true;
		var callback = function(value) {
			// alert(value.message);
			// setTimeout(function(){location.reload();},500);
			location.reload();
		};
		ajaxSendInfo(url, null, callback);
	};

	ajaxSendInfo = function(url, data, callback) {
		$.ajax({
			type : "POST",
			url : url,
			data : data,
			dataType : "json",
			success : callback
		});
	}

	// ////////////////////////////////////////////////////////////////////////////////////////////////////
	// index model
	var vmstatusCollection = new Array();// 用户虚拟机运行情况集合
	var vmsysCollection = new Array();// 用户虚拟机系统集合

	var vmstatusInfo = new Array();// 虚拟机状态文本集合
	var vmstinfoColor = new Array();// 虚拟机状态颜色集合

	this.addNewSystem = function(sysid, sysname, sysversion, sysurl) {
		var vms = new VMRunSystem();
		vms.init(sysid, sysname, sysversion, sysurl);
		vmsysCollection.push(vms);
	};

	this.addNewRunItem = function(vmid, ipadd, port, runstatus, sysid) {
		var vms = new VMRunItemStatus();
		vms.init(vmid, ipadd, port, runstatus, sysid);
		vmstatusCollection.push(vms);
	};

	// 重新设置虚拟机状态
	resetRunStatusByVmid = function(vmid, status) {
		var l = vmstatusCollection.length;
		for ( var i = 0; i < l; i++) {
			var vms = vmstatusCollection[i];
			if (vms.vmid == vmid) {
				vms.runstatus = status;
				break;
			}
		}
	};

	// 查找用户虚拟机运行状态
	findRunStatusByVmid = function(vmid) {
		var l = vmstatusCollection.length;
		for ( var i = 0; i < l; i++) {
			var vms = vmstatusCollection[i];
			if (vms.vmid == vmid) {
				return vms.runstatus;
			}
		}
		return -1;
	};

	/* 查找用户的虚拟机，通过ID */
	findRunVMItemByVmid = function(vmid) {
		var l = vmstatusCollection.length;
		for ( var i = 0; i < l; i++) {
			var vms = vmstatusCollection[i];
			if (vms.vmid == vmid) {
				return vms;
			}
		}
		return null;
	};

	// 查找用户虚拟机系统内容
	findSystemItem = function(sysid) {
		var length = vmsysCollection.length;
		var i = 0;
		for (i = 0; i < length; i++) {
			if (vmsysCollection[i].sysid == sysid) {
				break;
			}
		}
		if (i < length) {
			return vmsysCollection[i];
		} else {
			return null;
		}
	}

	/*
	 * this.addVMItemToIndexItem=function(vmid,ipadd,port,runstatus,index) { var
	 * vms=vmstatusCollection[index]; vms.addRunInfo(vmid,ipadd,port,runstatus); }
	 */

	/*
	 * this.createNewVMItem=function(sysid,sysname,sysversion,sysurl) { var
	 * vms=new VMRunStatus(); vms.init(sysid,sysname,sysversion,sysurl);
	 * vmstatusCollection.push(vms); return vmstatusCollection.length-1; }
	 */

	/* 添加虚拟机状态文本颜色 */
	this.addStatusInfo = function(info, color) {
		vmstatusInfo.push(info);
		vmstinfoColor.push(color);
	}

	// //////////////////////////////////////////////////////////////////////////////////////////////////////////
	// /首页模块
	this.freshIndexVM = function() {
		var l = vmstatusCollection.length;
		if (l <= 0) {
			return;
		}
		var data = "";
		for ( var i = 0; i < l - 1; i++) {
			var vms = vmstatusCollection[i];
			data += (vms.vmid + ",");
		}

		data += vmstatusCollection[l - 1].vmid;

		var sdata = "vmids=" + data;

		var url = "ajaxfreshVMAction.action";

		var callback = function(value) {
			// alert(value.rstatus);
			// alert(value.rstatus.length)
			if (value.message == "-1") {
				$("#freshstatudd").html("刷新虚拟机失败");
			} else {
				var length = value.rstatus.length;
				if (length != l) {
					$("#freshstatudd").html("虚拟机数量错误");
				} else {
					freshIndexVMStatusAndBg(value.rstatus);
					$("#freshstatudd").html("刷新虚拟机完毕");
				}
			}
		};

		$("#freshstatudd").html("正在刷新虚拟机");

		ajaxSendInfo(url, sdata, callback);
	};

	freshIndexVMStatusAndBg = function(rstatus) {
		var l = rstatus.length;
		for ( var i = 0; i < l; i++) {
			var vms = vmstatusCollection[i];
			vms.runstatus = rstatus[i];

			var bg = $("#index-vm-" + vms.vmid).find(".vmosleft");
			var st = $("#index-vm-" + vms.vmid).find(".dydrstatus");
			var rsid = rstatus[i];

			st.css("color", vmstinfoColor[rsid]);
			st.html("<b>" + vmstatusInfo[rsid] + "</b>");

			var sysid = vms.sysid;
			var os = findSystemItem(sysid);
			var imgurl = os.sysurl;
			var url = "./img/osinfo/" + imgurl;
			if (rsid > lastStatus) {
				url += "_close";
			}
			url += ".png";
			bg.css("background", "url(" + url + ")");
		}
	};

	this.startVM = function(vmid, object, imgurl) {
		var nstatus = findRunStatusByVmid(vmid);

		if (nstatus < 0) {
			alert('运行状态异常错误');
			return;
		} else if (nstatus == 0 || nstatus == 1) {
			alert('虚拟机已经处于运行状态');
			return;
		}

		var url = "ajaxstartAction";
		var data = "id=" + vmid;
		var callback = function(value) {
			if (value.message == "-1") {
				alert("虚拟机-" + vmid + "开机失败");
			} else {
				resetRunStatusByVmid(vmid, new Number(value.message));
				changeRunStatusResultStyle(value.message, object, imgurl, vmid);
			}
		};
		changeRunStatusSwicthStyle(1, object);
		ajaxSendInfo(url, data, callback);
	};

	this.restartVM = function(vmid, object, imgurl) {
		var nstatus = findRunStatusByVmid(vmid);

		if (nstatus < 0) {
			alert('运行状态异常错误');
			return;
		}

		var url = "ajaxrestartAction";
		var data = "id=" + vmid;
		var callback = function(value) {
			if (value.message == "-1") {
				alert("虚拟机-" + vmid + "恢复失败");
			} else {
				resetRunStatusByVmid(vmid, new Number(value.message));
				changeRunStatusResultStyle(value.message, object, imgurl, vmid);
			}
		};
		changeRunStatusSwicthStyle(2, object);
		changeRunScreenBackground(2, object, imgurl, vmid);
		ajaxSendInfo(url, data, callback);
	};

	this.shutdown = function(vmid, object, imgurl) {
		var nstatus = findRunStatusByVmid(vmid);

		if (nstatus < 0) {
			alert('运行状态异常错误');
			return;
		} else if (nstatus == 2) {
			alert('虚拟机已经处于关闭状态');
			return;
		}

		// var otd=$(object).closest(".dydrstatus");
		// alert($(object).parent().parent().find(".dydrstatus").html());
		// var img=$(object).closest("#vm1").find(".vmosleft");
		// alert(img.html())
		// alert(img.css("background"));
		// alert('a')
		/*
		 * var img=$(object).closest("#vm1").find(".vmosleft"); var
		 * url="./img/osinfo/"+imgurl; var rsid=2; if (rsid>lastStatus) {
		 * url+="_close"; } url+=".png"; alert(img.css("background"));
		 * img.css("background","url("+url+")"); alert(url); return;
		 */

		var url = "ajaxshutdownAction";
		var data = "id=" + vmid;
		var callback = function(value) {
			// alert(value.message);
			if (value.message == "-1") {
				alert("虚拟机-" + vmid + "关机失败");
			} else {

				resetRunStatusByVmid(vmid, new Number(value.message));
				changeRunStatusResultStyle(value.message, object, imgurl, vmid);
			}
			// alert(value.message);
		};
		changeRunStatusSwicthStyle(0, object);
		ajaxSendInfo(url, data, callback);
	};

	changeRunStatusSwicthStyle = function(swicthId, object) {
		// var otd=$(object).closest(".dydrstatus");
		var otd = $(object).parent().parent().find(".dydrstatus");
		otd.css("color", "#9AFF9A");
		otd.html("<b>" + runstatusswitchArray[swicthId] + "</b>");

	};

	changeRunStatusResultStyle = function(rsid, object, imgurl, vmid) {
		// var otd=$(object).closest(".dydrstatus");
		var otd = $(object).parent().parent().find(".dydrstatus");
		otd.css("color", vmstinfoColor[rsid]);
		otd.html("<b>" + vmstatusInfo[rsid] + "</b>");
		changeRunScreenBackground(rsid, object, imgurl, vmid);

	};

	changeRunScreenBackground = function(rsid, object, imgurl, vmid) {
		var img = $(object).closest("#index-vm-" + vmid).find(".vmosleft");
		var url = "./img/osinfo/" + imgurl;
		if (rsid > lastStatus) {
			url += "_close";
		}
		url += ".png";
		img.css("background", "url(" + url + ")");
	}

	// ///////////////////////////////////////////////////////////////////////////////////////////////////////////
	// 虚拟机管理模块
	var nowSysVMInfo = new Array();// 所有虚拟机系统内容-Manager
	var nowUserOwnVMInfo = new Array();// 所有虚拟机信息-Manager

	// //////////////////////虚拟机系统管理
	// 添加新的系统信息，本地
	this.addNowSysVMInfo = function(sysid, sysname, sysversion, sysurl) {
		var vms = new VMRunSystem();
		vms.init(sysid, sysname, sysversion, sysurl);
		nowSysVMInfo.push(vms);
	}

	// 添加新的虚拟机信息，本地
	this.addNowUserOwnVMInfo = function(sysid, number) {
		var vms = new VMUserSysInfo();
		vms.init(sysid, number);
		nowUserOwnVMInfo.push(vms);
	}

	this.addUserOSRequest = function(sysid, number, callback) {
		var url = "ajaxManagerUserVMNumberAction.action";
		var data = "sysid=" + sysid + "&number=" + number;

		ajaxSendInfo(url, data, callback);
	}

	// 添加新的系统信息，远程
	this.addNewUserOS = function() {
		var sysid = $(".jq_chosen").val();
		var l = nowUserOwnVMInfo.length;
		var i = 0;
		for (i = 0; i < l; i++) {
			var vms = nowUserOwnVMInfo[i];
			if (vms.sysid == sysid) {
				break;
			}
		}
		if (i < l) {
			alert('选择的系统已存在，请在上面区域操作');
			return;
		}

		var number = 1;

		var callback = function(value) {
			if (value.message == "1") {
				var item = searchSysOsInfo(sysid);
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
				$("#VMManagerListDiv").append(str);

				// alert('添加成功');
			} else {
				alert('添加失败');
			}
		};
		this.addUserOSRequest(sysid, number, callback);
	};

	// 增加或删除虚拟机系统，远程
	this.addOrDeleteUserOS = function(sysid, number, object) {
		var callback = function(value) {
			if (value.message == "1") {
				var pare = $(object).closest(".fcvmslistitem");
				// pare.remove();
				var vms = searchUserOS(sysid);
				if (vms == null) {
					alert('处理失败');
				} else {
					var n = vms.number + number;
					if (n <= 0) {
						nowUserOwnVMInfo.splice($
								.inArray(vms, nowUserOwnVMInfo), 1);
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

		this.addUserOSRequest(sysid, number, callback);
	}

	// 通过虚拟机系统，
	searchUserOS = function(sysid) {
		var length = nowUserOwnVMInfo.length;
		for ( var i = 0; i < length; i++) {
			var vms = nowUserOwnVMInfo[i];
			if (vms.sysid == sysid) {
				return vms;
			}
		}
		return null;
	}

	// 从所有虚拟机系统中查找
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

	changeSelectItemStyle = function() {
		$(".chzn-container").css("width", "200px");
	}

	// //////////////////////////////////////////////////////////////////////////////////////////////////
	this.initSPManagerTable = function() {
		// $('#vmmanagetable').dataTable({"aaSorting": [0, 'asc']});
	}

	// 删除虚拟机，远程
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

	// 新增虚拟机，远程
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
				var vmid = value.message;
				var str = "";
				var vms = searchSysOsInfo(sysid);
				// alert(vms);
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

	// ////////////////////////////////////////////////////////////////////////////////////////////////////
	// OS manager

	// 已经取消
	/*
	 * this.setLinkOSNumber=function(sysid,number) { var
	 * vms=searchSysOsInfo(sysid); vms.linkNumber=number; }
	 */

	this.deleteVMOS = function(sysid, object) {
		var url = "ajaxDeleteOSAction.action";
		var data = "sysid=" + sysid;
		var callback = function(value) {
			if (value.message == "1") {
				$(object).closest("tr").remove();
				var vms = searchSysOsInfo(sysid);
				nowSysVMInfo.splice($.inArray(vms, nowSysVMInfo), 1);
				changeUISystemSelect();
			} else if (value.message == "2") {
				alert('系统含有子虚拟机，无法删除');
			} else {
				alert('删除失败');
			}

		};

		ajaxSendInfo(url, data, callback);
	}

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

	// 增加新系统时的数据验证
	this.addNewOS = function() {
		if ($(".osupload").val() == "" || $(".osupload_close").val() == ""
				|| $("#nOsVersion").val() == "" || $("#nOsName").val() == "") {
			alert("必要的数据不能为空");
			return false;
		}

	}

	// ///////////////////////////////////////////////////////////////
	var urlCheckColorArray = [ "#93BB3A", "#EEC900", "##EE7600", "#EE4000" ];
	var web_stateCollection = [ "安全", "警告", "严重", "高危", "未知" ];

	this.checkURL = function() {
		// alert('a')
		var checkUrlLink = $("#checkurlinput").val();
		if (checkUrlLink == "") {
			alert("检测的URL不能为空");
			return;
		}
		var url = "ajaxCheckUrlAction.action";
		var data = "checkurlinput=" + checkUrlLink;
		var callback = function(value) {
			var t;
			if (value.message == "1") {
				t = buildCheckUrlReport(value.object, checkUrlLink);
			} else if (value.message == "0") {
				t = builidCheckUrlInReport(checkUrlLink);
			} else {
				t = buildCheckUrlFail(checkUrlLink);
			}
			$("#CheckURLReprotTable").html(t);

			// alert(value.object);
		};
		ajaxSendInfo(url, data, callback);
		$("#CheckURLReprotTable").html(buildCheckUrlStartTD(checkUrlLink));
	};

	buildCheckUrlReport = function(object, url) {
		var str = buildBaseURLCheckResultTableNew(url);

		var msg = object["msg"];
		var data = object["data"];

		var scoreObject = data["score"];
		var scroe = new Number(scoreObject["score"]);

		var level = getUrlSaftyLeveL(scroe);
		var web_state = new Number(object["web_state"]);

		/*
		 * var is_trojan=data["trojan"]["is_trojan"]; var
		 * is_imitation=data["imitation"]["is_imitation"]; var
		 * is_tamper=data["tamper"]["is_tamper"]; var
		 * is_violation=data["violation"]["is_violation"]; var
		 * is_marginal=data["marginal"]["is_marginal"];
		 */
		var is_trojan = data["trojan"]["level"];
		var is_imitation = data["imitation"]["level"];
		var is_tamper = data["tamper"]["level"];
		var is_violation = data["violation"]["level"];
		var is_marginal = data["marginal"]["level"];

		var vulnerability = data["vulnerability"];

		var vulnerability_level = vulnerability["level"];
		if (vulnerability_level == null) {
			vulnerability_level = "0";
		}

		str += "<tr><td class='thcuColor'>恶意挂马</td>"
				+ buildRightOrErrorInUrlCheckTD(is_trojan);
		str += "<td class='thcuColor'>虚假诈骗</td>"
				+ buildRightOrErrorInUrlCheckTD(is_imitation);
		str += "<td class='thcuColor'>篡改内容</td>"
				+ buildRightOrErrorInUrlCheckTD(is_tamper) + "</tr>";

		str += "<tr><td class='thcuColor'>敏感内容</td>"
				+ buildRightOrErrorInUrlCheckTD(is_violation);
		str += "<td class='thcuColor'>安全漏洞</td>"
				+ buildRightOrErrorInUrlCheckTD(vulnerability_level)
				+ "<td class='thcuColor'>备注</td><td class='trcuColor'></td></tr>";

		str += "<tr><td  class='thcuColor'>安全等级</td>";
		str += "<td  colspan='2' class='trcuColor middleFontCR' style='color:"
				+ urlCheckColorArray[level]
				+ "'>"
				+ web_stateCollection[web_state]
				+ "</td><td class='thcuColor'>综合得分</td><td  colspan='2' class='trcuColor middleFontCR' style='color:"
				+ urlCheckColorArray[level] + "'>" + scroe + "</td></tr>";

		/*
		 * str+="<td>恶意挂马</td><td>虚假诈骗</td><td>篡改内容</td><td>敏感内容</td><td>安全漏洞</td><td>综合得分</td></tr>";
		 * str+="<tr class='trfcColor2'>"; str+="<td style='color:"+urlCheckColorArray[level]+"'>"+msg+"</td>";
		 * str+=buildRightOrErrorInUrlCheckTD(is_trojan);
		 * str+=buildRightOrErrorInUrlCheckTD(is_imitation);
		 * str+=buildRightOrErrorInUrlCheckTD(is_tamper);
		 * str+=buildRightOrErrorInUrlCheckTD(is_violation);
		 * str+=buildRightOrErrorInUrlCheckTD(is_marginal);
		 */

		/*
		 * str+="<td style='color:"+urlCheckColorArray[level]+"'>"+scroe+"</td>";
		 * str+="</tr>";
		 */
		return str;

	}

	buildCheckUrlStartTD = function(url) {
		var str = buildBaseURLCheckResultTable(url);
		str += "<tr><td class='thcuColor'>检测进度</td><td  class='trcuColorBefore'>URL正在检测中</td></tr>";
		return str;
	}

	builidCheckUrlInReport = function(url) {
		var str = buildBaseURLCheckResultTable(url);
		str += "<tr><td class='thcuColor'>检测进度</td><td  class='trcuColorBefore'>远程服务器正在检测中,请稍后再试</td></tr>";
		return str;
	};

	buildCheckUrlFail = function(url) {
		var str = buildBaseURLCheckResultTable(url);
		str += "<tr><td class='thcuColor'>检测进度</td><td  class='trcuColorBefore'>检测失败</td></tr>";
		return str;
	};

	buildBaseURLCheckResultTable = function(url) {
		// var str="<tr class='thfcColor'><td colspan='7'></td></tr>";
		// var str="<tr class='thfcColor'><td><b>检测的URL</b></td><td
		// colspan='6'><b>"+url+"</b></td></tr>";
		var str = "<tr><td class='thcuColor'>检测的URL</td><td  class='trcuColorBefore'>"
				+ url + "</td></tr>";
		return str;
	};

	buildBaseURLCheckResultTableNew = function(url) {
		var str = "<tr><td class='thcuColor'>检测的URL</td><td colspan='5' class='trcuColor bigFontCR'>"
				+ url + "</td></tr>";
		return str;
	}

	getUrlSaftyLeveL = function(score) {
		var r = -1;
		if (score >= 90) {
			r = 0;
		} else if (score < 90 && score >= 75) {
			r = 1;
		} else if (score >= 60 && score < 75) {
			r = 2;
		} else {
			r = 3;
		}
		return r;
	};

	buildRightOrErrorInUrlCheckTD = function(bl) {
		var s = "";
		if (bl == "0") {
			s = "<td class='trcuColor' valign='middle'><img src='./img/my/ucright.png' class='fciconImg' /></td>";
		} else {
			s = "<td class='trcuColor' valign='middle'><img src='./img/my/ucerror.png' class='fciconImg' /></td>";
		}
		return s;
	};

	// //////////////////////////////////////////////////////
	var fcrestoreStart = false;
	var fcisFileVirusMark = false;
	restoreVMStatus = function(vmids) {
		var url = "ajaxrecoverAction.action";
		var data = "vmids=" + vmids;
		// alert(data);
		var callback = function(value) {
			fcrestoreStart = true;
			if (value.message != "0") {
				alert("虚拟机恢复失败");
				$("#fcRestoreVMButton").val("恢复虚拟机");
				fcrestoreStart = false;
			} else {
				$("#fcRestoreVMButton").val("恢复完成");
			}
		}

		ajaxSendInfo(url, data, callback);
	};

	this.restoreFCVMStatus = function() {
		if (fcrestoreStart) {
			return;
		}
		var vmids = getMonitorItemStr();
		restoreVMStatus(vmids);
		$("#fcRestoreVMButton").val("正在恢复中");
	};

	this.fcMarkFileIsVirus = function() {
		var url = "ajaxFCMarkFileAction.action";
		var status = 0;
		var callback;
		if (fcisFileVirusMark) {
			callback = function(value) {
				if (value.message != "0") {
					alert("标记失败");
					$("#fcIsFileVirusButton").val("取消标记");
				} else {
					$("#fcIsFileVirusButton").val("标记为病毒");
					$("#fcIsFileVirusButton").removeClass("btn-red");
					fcisFileVirusMark = false;
				}
			}

			$("#fcIsFileVirusButton").val("正在取消");
			status = 1;
		} else {
			$("#fcIsFileVirusButton").val("正在标记");
			callback = function(value) {
				if (value.message != "0") {
					alert("标记失败");
					$("#fcIsFileVirusButton").val("标记为病毒");
				} else {
					$("#fcIsFileVirusButton").val("取消标记");
					$("#fcIsFileVirusButton").addClass("btn-red");
					fcisFileVirusMark = true;
				}
			}
			status = 2;
		}

		var data = "status=" + status + "&filename=" + sendedFileName;
		ajaxSendInfo(url, data, callback);
	}

};