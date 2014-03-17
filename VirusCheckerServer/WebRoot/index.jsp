<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="com.bean.OSLinkNumBean"%>
<%@ page language="java" import="com.bean.VMInfoBean"%>
<%@ page language="java" import="com.bean.SysInfoBean"%>

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
<script type="text/javascript" SRC="js/jquery-1.8.0.js"></script> 
<script type="text/javascript" SRC="js/jquery-ui-1.8.16.custom.min.js"></script>
<script type="text/javascript" SRC="js/mfunction.js"></script>

<!--  jquery.dataTables.min.js 网上说会table好看些，没感觉啊～～ -->
<script type="text/javascript" SRC="js/jquery.dataTables.min.js"></script>

<!--  jquery.form.js 如果缺了它就会报错：has no ajaxsubmit method -->
<script type="text/javascript" SRC="js/jquery.form.js"></script>

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

</head>

<body>
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
			<span>|</span> <a href="./ExitAction.action">退出</a><br /> 
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
		<fieldset><legend>已有的系统如下</legend>
	<%
		//为了获得systemid 对应 的number
		List<OSLinkNumBean> oslinkList=(List<OSLinkNumBean>)request.getAttribute("oslink"); 
		//system的各个info
		List<SysInfoBean> sysinfo=(List<SysInfoBean>)request.getAttribute("sysinfo");
		
		int oslinkLength=0;
		if (oslinkList!=null)
		{
			oslinkLength=oslinkList.size();
		}
		//if (oslinkLength > 0) 
		//{
			out.print("<table class='display stylized' id='oslinktable'>");
			out.print("<thead>");
			out.print("<tr class='thfcColor'>");
			out.print("<td>编号</td>");
			out.print("<td>操作系统</td>");
			out.print("<td>版本</td>");
			out.print("<td> 安装虚拟机数</td>");
			out.print("<td>操作</td>");
			out.print("</tr>");
			out.print("</thead>");
			out.print("<tbody id='oslinkTbody'>");
			for (int i=0;i<oslinkLength;i++)
			{
					SysInfoBean sbean=sysinfo.get(i);
					OSLinkNumBean obean=oslinkList.get(i);
					int dd=i%2;

					out.print("<tr class='trfcColor"+(i%2+1)+"'>");
					out.print("<td>"+sbean.getSystemid()+"</td>");
					out.print("<td>"+sbean.getName()+"</td>");
					out.print("<td>"+sbean.getVersion()+"</td>");
					out.print("<td>"+obean.getNumber()+"</td>");
					out.print("<td><a class='table-a' href='javascript:void(0)' onclick='manager.deleteVMOS("+sbean.getSystemid()+",this)'>删除</a></td>");
					out.print("</tr>");
			}
			out.print("</tbody></table>");
		//}
	 %>
	 </fieldset>
	 <!--  这里虽然是表单post提交，但是在mfunctions.js中 initUI()中屏蔽掉了，自己替换一个ajax提交 -->
	 <%
			out.print("<fieldset><legend>添加一个系统</legend>");
			out.print("<form id='nOsform' name='nOsform' method='post' enctype='multipart/form-data' action='ajaxAddNewOSAction.action'>");
			out.print("<table class='osaddNewTable'>");
			out.print("<tr>");
			out.print("<td>系统名称</td>");
			out.print("<td><input type='text' id='nOsName' name='nOsName' /></td>");
			out.print("<td>版本</td>");
			out.print("<td><input type='text' id='nOsVersion' name='nOsVersion' /></td>");
			out.print("<td></td></tr><tr>");
			out.print("<td>运行图片</td>");
			out.print("<td><input type='file' id='upload' name='upload' class='osupload'/></td>");
			out.print("<td>故障图片</td>");
			out.print("<td><input type='file' id='upload' name='upload' class='osupload_close'/></td>");
			out.print("<td>");
			out.print("<input type='submit' class='btn btn-green big' value='添加' onclick='manager.addNewOS();' />");
			out.print("</td>");
			out.print("</tr>");
			out.print("</table>");
			out.print("</form>");
			out.print("</fieldset>");
			out.print("<div id='osaddtarget'></div>");
	  %>
	</div>














	</div>
	

	
</body>
</html>
