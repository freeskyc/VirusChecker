<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ page language="java" import="com.bean.OSLinkNumBean"%>
<%@ page language="java" import="com.bean.VMInfoBean"%>
<%@ page language="java" import="com.bean.SysInfoBean"%>
<%@ page language="java" import="com.bean.SidVMNumberInfo"%>

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









<%
//把一些公共的东东放到这里：
//sysinfo
List<SysInfoBean> sysinfo=(List<SysInfoBean>)request.getAttribute("sysinfo");
int sysinfoLength=0;
if (sysinfo!=null )
{	
	sysinfoLength=sysinfo.size();
}

//vminfoblist
List<VMInfoBean> vminfoblist=(List<VMInfoBean>)request.getAttribute("allvmdata");

//运行状态的集合
String runStringS="<select class='rstatusSelect'><option value='0'>运行中</value><option value='1'>关闭中</value><option value='2'>故障中</value><option value='3'>维护中</value></select>";

//osOptions是操作系统OS的集合
String osOptions="";
for (int i=0;i<sysinfoLength;i++){
	SysInfoBean svm=sysinfo.get(i);
	osOptions+="<option value='"+svm.getSystemid()+"'>"+svm.getName()+" "+svm.getVersion()+"</option>";
}

//初始化虚拟机们的信息 -> NowSysVMInfo这个list中
for (int i=0;i<sysinfoLength;i++)
{
	SysInfoBean tmp=sysinfo.get(i);
	out.print("<script>manager.addNowSysVMInfo("+tmp.getSystemid()+",'"
	+tmp.getName()+"','"+tmp.getVersion()+"','"+tmp.getImgurl()+"')</script>");
}

//初始化虚拟机们的状态
String[] vmstinfo=(String[])request.getAttribute("vmstatus");
String[] vmstcolor=(String[])request.getAttribute("vmclinfo");
int le=vmstinfo.length;
for (int i=0;i<le;i++)
{
	out.print("<script>manager.addStatusInfo('"+vmstinfo[i]+"','"+vmstcolor[i]+"')</script>");
}

//初始化systemid和个数number的映射列表
List<SidVMNumberInfo> sidVMNumberInfoList = (List<SidVMNumberInfo>)request.getAttribute("SidVMNumberInfoList");
int sidVMNumberInfoListLength = 0;
if(sidVMNumberInfoList != null){
	sidVMNumberInfoListLength = sidVMNumberInfoList.size();
}


 %>


	<div id="tab-filecheck" class="wrapper minsize">

	</div>

	<div id="tab-historyfile" class="wrapper minsize">

	</div>



	<div id="tab-vmmanager" class="wrapper minsize">
		<fieldset>
				<legend>当前您登录的虚拟机</legend>
				<div id="VMManagerListDiv" >
				<%
						if(sidVMNumberInfoList != null){
									String str = "";
									for (int i=0;i<sidVMNumberInfoListLength;i++)
						    		{
											SidVMNumberInfo item=sidVMNumberInfoList.get(i);
    										int systemid=item.getSystemId();
    										int number = item.getNumber();
    										int j = 0;
    										for (j =0; j<sysinfoLength;j ++)
							    			{
								    				SysInfoBean tmp=sysinfo.get(j);
								    				if (tmp.getSystemid()==systemid)
								    				{
								    					break;
								    				}
							    			}
							    			//如果找不到对应的sysinfo，这个情况不可能发生
							    			if(j >= sysinfoLength){
							    					continue;
							    			}
							    			SysInfoBean sysitem=sysinfo.get(j);
							    			String sysurl=sysitem.getImgurl();
							    			String sysname=sysitem.getName();
							    			String sysversion=sysitem.getVersion();
							    			str+="<div class='fcvmslistitem'>"; 
							    			str+="<div class='fcvmslisticon'>";
							    			str+="<img src='./img/osinfo/"+sysurl+".png' />";
							    			str+="</div>";
											    		
											str+="<div>";
							    			str+="<table  class='usostable'><thead class='mhiden'><tr><td></td><td></td><td></td><td></td><tr></thead>";
							    			str+="<tbody>";
							    			str+="<tr class='trfcColor1'><td><b>系统</b></td><td>"+sysname+"</td></tr>";
							    			str+="<tr class='trfcColor2'><td><b>版本</b></td><td>"+sysversion+"</td></tr>";
							    			str+="<tr class='trfcColor1'><td><b>数量</b></td><td class='usostabletd'>"+number+"</td></tr>";
							    			str+="<tr class='trfcColor2'><td><a class='table-a' href='javascript:void(0)' onclick='manager.addOrDeleteUserOS("+systemid+",1,this)'><b>增加</b></a></td>";
							    			str+="<td><a class='table-a' href='javascript:void(0)' onclick='manager.addOrDeleteUserOS("+systemid+",-1,this)'><b>删除</b></a></td></tr>";
							    			str+="</tobdy>";
							    			str+="</table>";
							    			str+="</div>";
							    			str+="</div>";
							    			
							    			//把一个新的NowUserOwnSidVMNumberInfo存到NowUserOwnSidVMNumberInfoList中
							    			//妹的，名气其太长了也不好，就是当前用户的Systemid 和 vm的数量的一个info
							    			out.print("<script>manager.addNowUserOwnSidVMNumberInfo("+systemid+","+number+")</script>");
									}
									out.print(str);
						}	
				 %>
				 <!-- 闭合  div id="VMManagerListDiv-->
				 </div>
		<!--  闭合一个 fieldset-->		
		</fieldset>

		<div class='clearB heigth20'></div>
			<div class='upnextArea'>
			<span>选择一个系统</span>
			<span>
			<select class="jq_chosen dyosselect" >
			<%
			out.print(osOptions);
			%>
			</select>
			</span>
					&nbsp;&nbsp;&nbsp;<input type="button" class="btn btn-green big" value="添加" onclick='manager.addNewUserOS();' />
			</div>
		
	</div>





	<div id="tab-vmdetail" class="wrapper minsize">
		<fieldset>
			<legend>所有虚拟机状态</legend>
				<table class='display stylized' id='vmmanagetable'>
					<thead>
						<tr class='thfcColor'>
							<td>编号</td>
							<td>操作系统</td>
							<td>版本</td>
							<td>IP地址</td>
							<td>端口</td>
							<td>使用人员ID</td>
							<td>运行状态</td>
							<td>操作</td>
						</tr>
						</thead>
			
	 				<tbody id='VMManagerListTbody'>
	 				<%
	 				
					int size=0;
					if (vminfoblist!=null)
					{
						size=vminfoblist.size();
					}
					for (int i=0;i<size;i++)
					{
						VMInfoBean item=vminfoblist.get(i);
						int dd=i%2;
						out.print("<tr class='trfcColor"+(i%2+1)+"'>");
						out.print("<td>"+item.getVmid()+"</td>");
						out.print("<td>"+item.getOsname()+"</td>");
						out.print("<td>"+item.getOsversion()+"</td>");
						out.print("<td>"+item.getIpadd()+"</td>");
						out.print("<td>"+item.getPort()+"</td>");
						
						//是哪个用户再使用？
						if (item.getUnderwork()==0)
						{
							out.print("<td>/</td>");
						}
						else
						{
							out.print("<td>"+item.getUnderwork()+"</td>");
						}
						out.print("<td>"+item.getRunstatusInfo()+"</td>");
						out.print("<td><a class='table-a' href='javascript:void(0)' onclick='manager.deleteVM("+item.getVmid()+",this)'>删除</a></td>");
						out.print("</tr>");
					}
	 				 %>
					</tbody>
			</table>
			</fieldset>


			<fieldset><legend>添加一台虚拟机</legend>
					<table class='vmaddNewTable'>
						<tr>
						<td>操作系统</td>
						<td>
						<select class='jq_chosenV dyosselect' >
								<% 
								out.print(osOptions);//获取OS 
								%>
						</select>
						</td>
						<td>IP地址</td>
						<td><input type='text' id='nVmIp' name='nVmip' /></td>
						<td>端口</td>
						<td><input type='text' id='nVmPort' name='nVmPort' /></td>
						<td>运行状态</td>
						<td>
						<%
						out.print(runStringS); //运行状态 
						%>
						</td>
						<td>
						<input type='button' class='btn btn-green big' value='添加' onclick='manager.addNewVM();' />
						</td>
						</tr>
						</table>
						</fieldset>
</div>







	<div id="tab-vmos" class="wrapper minsize">
		<fieldset><legend>已有的系统如下</legend>
	<%
		//为了获得systemid 对应 的number
		List<OSLinkNumBean> oslinkList=(List<OSLinkNumBean>)request.getAttribute("oslink"); 
		//system的各个info
		//List<SysInfoBean> sysinfo=(List<SysInfoBean>)request.getAttribute("sysinfo");
		
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
