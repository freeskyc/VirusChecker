<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>用户登录</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->

  </head>
  
  <body>
    	<!-- Header -->
	<header id="top">
	<div class="wrapper-login">
		<!-- Title/Logo - can use text instead of image -->
		<div id="title">
			<img SRC="img/logo.png" alt="Administry" />
		</div>
		<!-- Main navigation -->
		<nav id="menu">
		<ul class="sf-menu">
			<li class="current"><a href="login.jsp">登录</a>
			<li><a href="register.jsp">注册</a>
			</li>
		</ul>
		</nav>
		<!-- End of Main navigation -->
		<!-- Aside links -->
		<aside>
		<!-- End of Aside links -->
	</div>
	</header>
	<!-- End of Header -->
	
	<!-- Page content -->
	<div id="page" class="salesperson_login">
		<!-- Wrapper -->
		<div class="wrapper-login">
			<!-- Login form -->
			<section class="full">
			<br/><br/><br/>
			<h3>欢迎使用恶意代码监测中心</h3>


			<form id="loginform" method="post" action="loginAction.action">
				<p>
					<label class="required" for="username">用户名:</label><br /> 
					<input type="text" id="username" class="full" value=""  name="username" />
				</p>

				<p>
					<label class="required" for="password">密码:</label><br /> <input
						type="password" id="password" class="full" value="" name="password" />
				</p>


				<p>
					<input type="submit" class="btn btn-green big" value="登录" />
					&nbsp;
				</p>
				<div class="clear">&nbsp;</div>
				<br/>
				<p>
				<% 
				String message=(String)request.getAttribute("message");
				if (message!=null)
					out.println("用户名或密码错误！");
				%>
				</p>
			</form>
			
			<!-- End of login form -->
		</section>
			

		</div>
		<!-- End of Wrapper -->
	</div>
	<!-- End of Page content -->
	
  </body>
</html>
