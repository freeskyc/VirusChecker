VManager = function() {
	
	var tabFuntions = new Array(); //tab 的 函数们
	
	this.init = function(){
		this.initUI();
		this.initData();
	}
	
	this.initUI = function(){
		$("#tabs").tabs();
	}
	
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
};