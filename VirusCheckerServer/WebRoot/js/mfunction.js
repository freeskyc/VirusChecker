



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
		
		/*样本文件上传模块，ajax截获*/
		$("#sampleform").submit(
				function(e) {
					e.preventDefault();
					// alert('a');
					var options = {
						type : "post",
						target : '#fcfileMessage',
						success : function(value) {
							if (value.message != "no") {
								
								alert("success upload...");
								
								fileHasSend = true;
								sendedFileName = value.message;
								
								//此处会出现一个诡异的问题：c:\fakepath
								//出于安全性的考虑，上传文件时屏蔽了真实的本地文件路径，而以“C:\fakepath\”取代之
								//但是这里不好看，就自己特殊处理下
								baseFileName = $("#upload").val();
								baseFileName = baseFileName.replace("C:\\fakepath\\","");
								
								alert("sendedFileName is :"+sendedFileName+"bFilename is :"+baseFileName);
								
								$("#fcfileMessage").html("文件已经上传完毕");

								//往historyUploadFileArray push新的文件元素
								var nfile = new HistoryFile();
								nfile.init(sendedFileName, baseFileName,
										getCurrentDate());
								historyUploadFileArray.push(nfile);
								
								//往file check div添加新的文件元素
								rebuildHistoryFileList();
								
							} else {
								$("#fcfileMessage").html("文件上传失败");
							}

						}
					};
					$("#fcfileMessage").html("文件上传中");
					$('#sampleform').ajaxSubmit(options);

				});

		
		if (pid == 1) {
			/*新增OS，ajaxsubmit截获*/
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

											nowSysVMInfoList.push(vms);
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
		//tabFunctions.push(changeTabToIndex);
		tabFunctions.push(changeTabToFileCheck);
		//tabFunctions.push(changeTabToVMManager);
		tabFunctions.push(changeTabToVMSPManager);
		tabFunctions.push(changeTabToVMOSManager);
		tabFunctions.push(changeTabToHistoryFile);
		
		//修正没有更换tab就不显示样本文件的bug
		rebuildHistoryFileList();
		
		//FileChecker 的 初始化，步骤切换函数
		this.initFC();
	}
	
	/*
	 * tab 选项
	 */
	this.changeTab = function(index) {
		tabFunctions[index]();
	}
	
	/*
	changeTabToIndex = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>欢迎使用</h1></div>");
	}
	 */
	
	changeTabToFileCheck = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>开始文件安全监测</h1></div>");
		rebuildHistoryFileList();
	}
	
	/*
	changeTabToVMManager = function() {
		$("#pagetitle").html("<div class='wrapper'><h1>虚拟机添加删除管理</h1></div>");
		// changeSelectItemStyle();
	}
	 */
	
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
	
	var nowSysVMInfoList = new Array();// 目前在运行的时候用户已经有的虚拟机。
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
				nowSysVMInfoList.splice($.inArray(vms, nowSysVMInfoList), 1); //从list中删除这一项
				
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
	 *  addNowSysVMInfo ，往这个nowSysVMInfoList里面加入新的元素
	 * 在index.jsp中，拿到index.action传过来的数据后，调用该函数
	 */
	this.addNowSysVMInfo = function(sysid, sysname, sysversion, sysurl) {
		var vms = new VMRunSystem();
		vms.init(sysid, sysname, sysversion, sysurl);
		nowSysVMInfoList.push(vms);
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
		var length = nowSysVMInfoList.length;
		//alert(" "+length);
		for ( var i = 0; i < length; i++) {
			var vms = nowSysVMInfoList[i];
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
		var l = nowSysVMInfoList.length;
		var str = "";
		for ( var i = 0; i < l; i++) {
			var item = nowSysVMInfoList[i];
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
				str += "<td>/</td>"; //underwork uid
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
	
	var nowUserOwnSIdVMNumberInfoList = new Array();// 所有虚拟机系统-数量对应关系

	
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
	
	
	/************************************************************
	 * 
	 *历史样本管理模块
	 * 
	 * 
	 ***********************************************************/
	
	/*
	 *  在initUI()的tab选项中的changeTabToHistoryFile()中调用该函数
	 */
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
	
	/************************************************************
	 * 
	 *样本检测管理模块
	 *涉及到usr的VM + SYS 
	 * 
	 ***********************************************************/
	
	/***********************用户vm + os *********************************/
	var usrvmstatusCollectionList = new Array();// 用户虚拟机运行情况集合
	var usrvmsysCollectionList = new Array();// 用户虚拟机系统集合
	
	/*
	 *  在index.jsp中，新增元素，维护 usrvmstatusCollectionList  这个list
	 */
	this.addNewRunItem = function(vmid, ipadd, port, runstatus, sysid) {
		var vms = new VMRunItemStatus();
		vms.init(vmid, ipadd, port, runstatus, sysid);
		usrvmstatusCollectionList.push(vms);
	};
	
	/* 
	 * usrvmstatusCollectionList 的元素，所有的虚拟机状态
	 */
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
	
	/*
	 * 在index.jsp中，新增元素，维护 usrvmsysCollectionList  这个list
	 */
	this.addUsrNewSystem = function(sysid, sysname, sysversion, sysurl) {
		var vms = new VMRunSystem();
		vms.init(sysid, sysname, sysversion, sysurl);
		
		//alert(sysid+"  "+sysname+"   "+sysversion+"       "+sysurl);
		
		usrvmsysCollectionList.push(vms);
	};
	
	// 查找用户虚拟机系统内容
	findSystemItem = function(sysid) {
		var length = usrvmsysCollectionList.length;
		
		//alert("usrvmsysCollectionList length : "+length);
		
		var i = 0;
		for (i = 0; i < length; i++) {
			if (usrvmsysCollectionList[i].sysid == sysid) {
				break;
			}
		}
		if (i < length) {
			
			return usrvmsysCollectionList[i];
		} else {
			return null;
		}
	}
	
	/* 
	 * 查找用户的虚拟机，通过ID 
	 */
	findRunVMItemByVmid = function(vmid) {
		var l = usrvmstatusCollectionList.length;
		for ( var i = 0; i < l; i++) {
			var vms = usrvmstatusCollectionList[i];
			if (vms.vmid == vmid) {
				return vms;
			}
		}
		return null;
	};
	
	
	
	/***********************一堆辅助函数*********************************/
	
	
	var lastStatus = 1;// 运行状态为OK的最大值
	var runstatusswitchArray = [ "正在关机", "正在开机", "正在恢复" ];
	
	
	var fileHasSend = false;// 文件是否上传标志
	var sendedFileName = "";// 选择的服务端文件
	var baseFileName = "";// 选择文件的原来文件名
	var selectHistoryStatus = false;// 是否是选择历史文件标志
	var historyUploadFileArray = new Array();// 历史文件记录
	
	var fcprocess = 0;// 当前步骤
	var fcmaxprocess = 4;// 最大步骤数
	var baseMoveLength = 990;// 步骤移动距离
	var moveSpeed = 1000;//
	var fcpArray = new Array();// 步骤切换时，触发函数
	
	/*
	 * 初始化切换步骤的函数
	 */
	this.initFC = function() {
		fcpArray.push(buildVMSelectArea);
		fcpArray.push(startMonitor);
		fcpArray.push(rebuildHistoryFileList);
	};
	

	/*
	 *辅助函数：清理文件上传与否消息内容   
	 */
	this.clearFCInfo = function() {
		$("#fcfileMessage").html("");
		fileHasSend = false;
	};
	
	/*
	 * 辅助函数：保证文件名不能空
	 */
	this.fcAjaxForm = function() {

		var fileName = $("#upload").val();
		if (fileName == "") {
			alert("请选择一个文件!");
			return false;
		}
	}
	
	/*
	 * 用户上传的历史文件信息
	 */
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
	
	/*
	 *  辅助函数：获得当前特定时间 
	 */
	getCurrentDate = function() {
		var d = new Date();
		var mm = null;
		var dd = null;
		if(d.getMonth() + 1 < 10){
			mm = "0"+(d.getMonth()+1);
		}else{
			mm = d.getMonth()+1;
		}
		if(d.getDate() < 10){
			dd = "0"+d.getDate();
		}else{
			dd = d.getDate();
		}
		return d.getFullYear() + "-" + mm + "-" + dd;
	};
	
	/*
	 * 辅助函数：点击下一步的检查
	 */
	this.fcmoveToSelectVM = function(index) {
		if (!fileHasSend && !selectHistoryStatus) {
			alert("文件未上传!");
			return;
		}
		this.fcnext(index);
	}
	
	/*
	 *  辅助函数：下一步
	 */
	this.fcnext = function(index) {
		var left = $("#fccontent").css("left");
		
		//alert(left);
		
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
		
		//alert("开始动画！");
		
		$("#fccontent").animate({
			left : movedis
		}, moveSpeed, function() {
			if (index >= 0) {
				fcpArray[index]();
			}

		});
	};
	
	/*
	 * 辅助函数：上一步
	 */
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

	/***********************process 1：重构历史文件选择表格*********************************/
	rebuildHistoryFileList = function() {
		var size = historyUploadFileArray.length;
		
		//alert("historyUploadFileArray.length is :"+size);
		
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
	
	/*
	 * 往historyUploadFileArray添加新的文件
	 */
	this.addHistoryFile = function(fileName, bfilename, date) {
		var file = new HistoryFile();
		file.init(fileName, bfilename, date);
		historyUploadFileArray.push(file);
	}
	
	/* 
	 * 当历史文件CheckBox选择时触发的函数 
	 */
	this.historyFileSelect = function(tid, object) {
		if ($(object).attr("checked") == "checked") {
			
				//清理其他选项的check状态
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


	
	
	
	/***********************process 2：构建可用虚拟机列表*********************************/
	var fcslitemnumber = 6;// 布局中每行最大显示块数量
	
	buildVMSelectArea = function() {
		var str = "";
		var length = usrvmstatusCollectionList.length;
		var count = 0;
		
		//alert("usrvmstatusCollectionList length is : "+length);
		
		for ( var i = 0; i < length; i++) {
			var vmstatus = usrvmstatusCollectionList[i].runstatus;
			
			//alert("vmstatus is : "+vmstatus);
			if (vmstatus > lastStatus) {
				//continue;
			}

			

			var osid = usrvmstatusCollectionList[i].sysid;

			var ositem = findSystemItem(osid);

			if (ositem == null) {
				continue;
			}

			var osurl = ositem.sysurl;
			var osname = ositem.sysname;
			var osversion = ositem.sysversion;
			var vmid = usrvmstatusCollectionList[i].vmid;
			var ipadd = usrvmstatusCollectionList[i].ipadd;
			var port = usrvmstatusCollectionList[i].port;
			var status =  usrvmstatusCollectionList[i].runstatus;
			
			
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
					+ vmid + "</td></tr>";
			
			//加入对虚拟机的控制，达到：不开机就无法勾选的效果
			//usrvmstatusCollectionList的元素：vmid, ipadd, port, runstatus, sysid
			//运行状态的list：vmstatusInfo.push(info);     vmstinfoColor.push(color);
			
			str += "<tr class='trfcColor1'><td><b>IP地址<b></td><td>"+ipadd+"</td></tr>";
			str += "<tr class='trfcColor1'><td><b>端口号<b></td><td>"+port+"</td></tr>";
			str += "<tr class='trfcColor1'><td><b>运行状态<b></td><td  class='dydrstatus  fcstatus'  style=\"color:"+vmstinfoColor[status]+"\" >"+vmstatusInfo[status]+"</td></tr>";
			str += "<tr class='trfcColor1 table-a'><td><b>操作</b><td><a  onclick=\"manager.shutdown("+vmid+",this,'"+osurl+"')\"><b>关机</b></a></td></tr>";
			str += "<tr class='trfcColor1 table-a'><td><b>操作</b><td><a  onclick=\"manager.startVM("+vmid+",this,'"+osurl+"')\"><b>开机</b></a></td></tr>";
			str += "<tr class='trfcColor1 table-a'><td><b>操作</b><td><a  onclick=\"manager.restartVM("+vmid+",this,'"+osurl+"')\"><b>恢复快照</b></a></td></tr>";

			str += "<tr class='trfcColor2'><td><b>选择这台1</b></td><td><input type='checkbox' class='fcsinput'></td></tr>";
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
	
	/*
	 *  开机，关机，恢复快照都得获取：虚拟机运行状态
	 *  查找用户虚拟机运行状态，这是自己设定的：	
	  		r – 运行      0
			b – 阻塞     1
			p – 暂停     4
			s – 关闭      2 
			c – 崩溃      2
			d – 垂死     2
	 */
	findRunStatusByVmid = function(vmid) {
		var l = usrvmstatusCollectionList.length;
		for ( var i = 0; i < l; i++) {
			var vms = usrvmstatusCollectionList[i];
			if (vms.vmid == vmid) {
				return vms.runstatus;
			}
		}
		return -1;
	};
	
	/*
	 * 重新设置虚拟机状态
	 */ 
	resetRunStatusByVmid = function(vmid, status) {
		var l = usrvmstatusCollectionList.length;
		for ( var i = 0; i < l; i++) {
			var vms = usrvmstatusCollectionList[i];
			if (vms.vmid == vmid) {
				vms.runstatus = status;
				break;
			}
		}
	};
	
	/*
	 * 重新设置虚拟机状态对应的颜色
	 */
	changeRunStatusResultStyle = function(rsid, object, imgurl, vmid) {
		// var otd=$(object).closest(".dydrstatus");
		var otd = $(object).parent().parent().parent().find(".dydrstatus");
		otd.css("color", vmstinfoColor[rsid]);
		otd.html("<b>" + vmstatusInfo[rsid] + "</b>");
		
		//alert("vmstatusInfo[rsid]:" +rsid +"      "+ vmstatusInfo[rsid]);
		
		changeRunScreenBackground(rsid, object, imgurl, vmid);

	};
	
	/*
	 * 切换图片
	 */
	changeRunScreenBackground = function(rsid, object, imgurl, vmid) {
		var img = $(object).closest("#index-vm-" + vmid).find(".vmosleft");
		var url = "./img/osinfo/" + imgurl;
		if (rsid > lastStatus) {
			url += "_close";
		}
		url += ".png";
		img.css("background", "url(" + url + ")");
	}
	
	/*
	 * 在切换状态的时候，更改文字如：正在。。。
	 * var runstatusswitchArray = [ "正在关机", "正在开机", "正在恢复" ];
	 */
	changeRunStatusSwicthStyle = function(swicthId, object) {
		// var otd=$(object).closest(".dydrstatus");
		var otd = $(object).parent().parent().find(".dydrstatus");
		otd.css("color", "#9AFF9A");
		otd.html("<b>" + runstatusswitchArray[swicthId] + "</b>");

	};
	
	/*
	 * VM开机
	 */
	this.startVM = function(vmid, object, imgurl) {
			var nstatus = findRunStatusByVmid(vmid);
			
			//alert(nstatus);
			
			if (nstatus < 0) {
				alert('运行状态异常错误');
				return;
			} else if (nstatus == 0 || nstatus == 1) {
				alert('虚拟机已经处于运行状态');
				return;
			}
	
			var url = "ajaxStartVMAction.action";
			var data = "id=" + vmid;
			var callback = function(value) {
				if (value.message == "-1") {
					alert("虚拟机-" + vmid + "开机失败");
				} else {
					resetRunStatusByVmid(vmid, new Number(value.message)); //切状态
					changeRunStatusResultStyle(value.message, object, imgurl, vmid);//改颜色
				}
			};
			changeRunStatusSwicthStyle(1, object);//设置过渡状态。。
			ajaxSendInfo(url, data, callback);
	};
	
	/*
	 * VM关机
	 */
	this.shutdown =  function(vmid, object, imgurl) {
			var nstatus = findRunStatusByVmid(vmid);
			
			if (nstatus < 0) {
				alert('运行状态异常错误');
				return;
			} else if (nstatus == 2) {
				alert('虚拟机已经处于关闭状态');
				return;
			}
			
			var url = "ajaxShutdownVMAction.action";
			var data = "id=" + vmid;
			var callback = function(value) {
					if (value.message == "-1") {
						alert("虚拟机-" + vmid + "关机失败");
					} else {
						resetRunStatusByVmid(vmid, new Number(value.message)); //切状态
						changeRunStatusResultStyle(value.message, object, imgurl, vmid);//改颜色
					}
				
			}
			
			changeRunStatusSwicthStyle(0, object);//设置过渡状态。。
			ajaxSendInfo(url, data, callback);
			
	}
	
	/*
	 * VM 恢复快照
	 */
	this.restartVM =  function(vmid, object, imgurl) {
			var nstatus = findRunStatusByVmid(vmid);
			
			if (nstatus < 0) {
				alert('运行状态异常错误');
				return;
			} 
			
			var url = "ajaxRestartVMAction.action";
			var data = "id=" + vmid;
			var callback = function(value) {
					if (value.message == "-1") {
						alert(value.message);
						alert("虚拟机-" + vmid + "恢复快照失败");
					} else {
						resetRunStatusByVmid(vmid, new Number(value.message)); //切状态
						changeRunStatusResultStyle(value.message, object, imgurl, vmid);//改颜色
					}
				
			}
			
			changeRunStatusSwicthStyle(2, object);//设置过渡状态。。
			ajaxSendInfo(url, data, callback);
			
	}
	
	
	/***********************process 3：开始监控*********************************/
	var monitorItemCollectionList = new Array(); // 监控VM '编号' 序列
	var isMonitorStart = false;// 是否开始监控
	var monitorProgressCollection = [ "监控中", "运行完毕" ];
	var lastMonitorProgressStatus = 1;
	
	/*
	 *  Monitor Status Item 
	 */  
	MonitorStatusItem = function() {
		this.vmid = 0;
		this.mstatus = 0;
	};
	
	/* 在监控前处理内容 */
	this.beforestartMonitor = function() {
		var monitorItems = new Array();
		var tables = $(".fccrtable");
		var length = tables.length;
		
		//一共有length个虚拟机：
		for ( var i = 0; i < length; i++) {
			var checkbox = $(tables[i]).find(".fcsinput");
			if (checkbox.attr("checked") == "checked") {
				var vmid = $(tables[i]).find(".fcvmid").html();
				var vmstatus = $(tables[i]).find(".fcstatus").html();
				for(var j = 0; j < vmstatusInfo.length ; j++) {
					if(vmstatusInfo[j] == vmstatus){
						vmstatus = j ;
						break;
					}
				}
				
				var mitem = new MonitorStatusItem();
				mitem.vmid = vmid;
				mitem.vmstatus = vmstatus;
				monitorItemCollectionList.push(mitem);
			}
		}
		if (monitorItemCollectionList.length <= 0) {
			alert("至少选择一台虚拟机!");
			return;
		}
		for(var k = 0 ; k < monitorItemCollectionList.length ; k ++){
			if(monitorItemCollectionList[k].vmstatus >=  2) {
				alert("虚拟机vm-"+monitorItemCollectionList[k].vmid+" 状态不为运行或闲置！");
				return;
			}
		}

		buildMoitorVMInfo();

		this.fcnext(1);
	};
	
	/*
	 * 将被检测的虚拟机ID构成字符串
	 */ 
	getMonitorItemStr = function() {
		var l = monitorItemCollectionList.length;
		var str = "";
		if (l > 0) {
			for ( var i = 0; i < l - 1; i++) {
				str += (monitorItemCollectionList[i].vmid + ",");
			}
			str += monitorItemCollectionList[l - 1].vmid;
		}

		return str;

	};

	
	/*
	 *  构建被检测虚拟机状态列表
	 */
	buildMoitorVMInfo = function() {
		var str = "";
		var length = monitorItemCollectionList.length;
		var count = 0;
		for ( var i = 0; i < length; i++) {
			var vms = findRunVMItemByVmid(monitorItemCollectionList[i].vmid);
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
	
	
	/*
	 * 检测，进度获取
	 */ 
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
	
	/***********************process 4：监控到结束*********************************/
	// Create Report
	// var checkMonitorTimeDis=60000;
	var checkMonitorTimeDis = 30000;
	var maxCheckMonitorTimeDis = 360000;
	var lastFCMonitorTime = 0;

	
	
};