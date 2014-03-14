<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>My JSP 'index.jsp' starting page</title>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<script>
	$(function(){		
		$('#tableexp').dataTable({"bFilter": false,"bSort": false,"bPaginate": false,"bLengthChange": false,"bInfo": false,"bAutoWidth": false});
	});
</script>
	
	
  </head>
  
  <body>

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
			 //out.print("<script>manager.setPid("+pid+")</script>");
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
		</div>
		</header>
		</div>
		

  </body>
</html>
