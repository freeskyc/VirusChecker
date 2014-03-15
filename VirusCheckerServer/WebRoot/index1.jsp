<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">

<title>监测中心</title>

<meta http-equiv="pragma" content="no-cache">
<meta http-equiv="cache-control" content="no-cache">
<meta http-equiv="expires" content="0">
<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
<meta http-equiv="description" content="This is my page">


<link rel="stylesheet" href="css/style.css" type="text/css" />

<script type="text/javascript" SRC="js/jquery-1.4.2.min.js"></script>
<script type="text/javascript" SRC="js/jquery-ui-1.8.16.custom.min.js"></script>
<script type="text/javascript" SRC="js/mfunction.js"></script>

<script>	
	var manager=new VManager();
	$(function(){
		manager.init();
		
		window.onbeforeunload=function()
		{
			if (!manager.unloadStatus) {
				manager.unload();
			}
		};
		
		
		$('#tableexp').dataTable({"bFilter": false,"bSort": false,"bPaginate": false,"bLengthChange": false,"bInfo": false,"bAutoWidth": false});
	});
	
	
	
	
</script>
<script src="js/spcheckout.js" type="text/javascript"></script>
<link rel="stylesheet" href="css/mystyle.css" type="text/css" />
<link rel="stylesheet" href="css/chosen.css" type="text/css" />
<link rel="stylesheet" href="css/plot.min.css" type="text/css" />





</head>

<body>
	<%
	  
	
	%>
	<!-- Header -->
	<div id="tabs">
	<header id="top">
	<div class="wrapper">
		<!-- Title/Logo - can use text instead of image -->
		<div id="title">
			<img SRC="img/logo.png" alt="Administry" />
			<!--<span>Administry</span> demo-->
		</div>
		<!-- Top navigation -->
		<div id="topnav">
			<a href="#"><img class="avatar" SRC="img/user_32.png" alt="" /></a>
			以<b>
			<%
			 int pid=(Integer)request.getAttribute("permission");
			 out.print("<script>manager.setPid("+pid+")</script>");
			 if (pid==1)
			 {
				 out.print("管理员");
			 }
			 else
			 {
				 out.print("用户");
			 }
			%></b>身份登录 <span>|</span>
			<span>|</span> <a href="./exitAction.action">退出</a><br /> 
		</div>
		<!-- End of Top navigation -->
		<!-- Main navigation -->
		<nav id="menu">
		<ul>
			<li><a HREF="#tab-index" onclick='manager.changeTab(0);'>首页</a></li>
			<li><a HREF="#tab-filecheck" onclick='manager.changeTab(1);'>样本监测</a></li>
			<li><a HREF="#tab-vmmanager" onclick='manager.changeTab(2);'>个人机器管理</a></li>
			<li><a HREF="#tab-historyfile" onclick='manager.changeTab(5);'>历史样本</a></li>
			<%
			
			 if (pid==1)
			 {
				 out.print("<li><a HREF='#tab-vmdetail' onclick='manager.changeTab(3);'><b class='manager_tab_style'>虚拟机管理</b></a></li>");
				 out.print("<li><a HREF='#tab-vmos' onclick='manager.changeTab(4);' ><b  class='manager_tab_style'>系统管理</b></a></li>");
			 }
			%>
		</ul>
		</nav>
		<!-- End of Main navigation -->
		<!-- Aside links -->
		<aside></aside>
		<!-- End of Aside links -->
	</div>
	</header>
	<!-- End of Header -->
	<!-- Page title -->
	<div id="pagetitle">
		<div class='wrapper'><h1>欢迎使用</h1></div>
	</div>
	<!-- End of Page title -->

	<div id="tab-index" class="wrapper minsize">
	
	</div>
	
	<div id="tab-filecheck" class="wrapper minsize">
	
	</div>
	
	<div id="tab-vmmanager" class="wrapper minsize">
	
	</div>
	
	<div id="tab-historyfile" class="wrapper minsize">
	
	</div>
	
	<div id="tab-vmdetail" class="wrapper minsize">
	
	</div>
	
	<div id="tab-vmos" class="wrapper minsize">
	
	</div>
	
	
	</div>
</body>
</html>
