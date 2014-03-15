<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <base href="<%=basePath%>">
    
    <title>用户注册</title>
    
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
	<meta http-equiv="description" content="This is my page">
	
	
	<link rel="stylesheet" href="css/style.css" type="text/css" />
	

  </head>
  
  <body>
  <!-- Header -->
	<header id="top">
	<div class="wrapper-login">
		<!-- Title/Logo - can use text instead of image -->
		<div id="title">
			<img SRC="img/logo.png" alt="Administry" />
			<!--<span>Administry</span> demo-->
		</div>
		<!-- Main navigation -->
		<nav id="menu">
		<ul class="sf-menu">
			<li ><a href="login.jsp">登录</a>
			<li class="current"><a href="register.jsp">注册</a>
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
			<h3>请填写以下信息进行注册</h3>

			<form id="loginform" method="post" action="registerAction.action">
				<p>
					<label class="required" for="username">用户名:</label><br /> <input
						type="text" id="username" class="full" value="" name="username" />
				</p>

				<p>
					<label class="required" for="password">密码:</label><br /> <input
						type="password" id="password" class="full" value=""
						name="password" />
				</p>
				
				<p>
					<label class="required" for="agpassword">重复密码:</label><br /> <input
						type="password" id="agpassword" class="full" value=""
						name="agpassword" />
				</p>

				<p>
					<label class="required" for="mail">邮箱:</label><br /> <input
						type="text" id="mail" class="full" value="" name="mail" />
				</p>

				<p>
					<input type="submit" class="btn btn-green big" value="注册" />
				</p>
				<div class="clear">&nbsp;</div>
				<p><% 
				String message=(String)request.getAttribute("message");
				if (message!=null)
					if (message.equals("1"))
					{
						out.print("用户名已经存在!");
					}
					else if (message.equals("2"))
					{
						out.print("密码不一致!");
					}
					else if (message.equals("3"))
					{
						out.print("必要信息不能为空!");
					}
					else 
					{
						out.print("注册用户失败!");
					}
				%></p><br/>
			</form>

			</section>
			<!-- End of login form -->

		</div>
		<!-- End of Wrapper -->
	</div>
	<!-- End of Page content -->
	
  </body>
</html>
