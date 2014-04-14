package com;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.opensymphony.xwork2.ActionContext;

public class Helper {

	/*
	 * 虚拟机的配置信息如下：
	 *   192.168.122.101      xp-32    
	 */
	
	public static String uidSession="uid";
	public static String permissionSession="permission";
	public static int vmstatusgetfail = 2;
	public static String[] vmstatusInfo={"运行中","闲置中","关闭中","获取失败","暂停中","切换中"};
	public static String[] vmscolorInfo={"#93BB3A","#BCEE68","#acaaa9","#fa1d1d","#EEC900","#329ECC" };
	
	//统一格式FileCheck文件名字
	public static String fcrpfileName="fcrp-";
	
	//用户格式sysid-number 一共两个：sysid和number
	public static int usrfomat=2;
	
	//虚拟机运行-时间控制
	public static int lastWaitTime=6000; //6s
	public static int sleepTime=1000; //1s
	
	//虚拟机恢复快照文件存放地点
	public static String restoreFilePath="/home/vm-"; 
	
	public static int getUIDSession()
	{
		Map<String, Object>  session = ActionContext.getContext().getSession();
    	Object obsid=session.get(Helper.uidSession);
    	int sid=-1;
    	if (obsid!=null)
    	{
    		sid=Integer.parseInt(obsid.toString());
    		
    	}
    	return sid;
	}
	
	public static int getPermissionSession()
	{
		Map<String, Object>  session = ActionContext.getContext().getSession();
    	Object obsid=session.get(Helper.permissionSession);
    	int pid=-1;
    	if (obsid!=null)
    	{
    		pid=Integer.parseInt(obsid.toString());
    		
    	}
    	return pid;
	}

	/*
	 *  用命令去实时获取各个虚拟机的状态
	 *  用findStatusFormMsg() 去从返回结果中获取状态
	 */
	public static List<Integer> getAllRunVMStatus() {
		List<Integer> list=new ArrayList<Integer>();
		String cmdWin32="xm list";
		Process p;
		try {
			p = Runtime.getRuntime().exec(cmdWin32);
			BufferedReader br = new BufferedReader(
					new InputStreamReader(p.getInputStream()));
			
			//等待运行结束
			p.waitFor();
			
			String msg = null;
			int count=0;
			int status=2;
			
			//读取返回结果，前2行都是 固定的 ，不要
			while ((msg = br.readLine()) != null)
			{
				count++;
				if (count<=2)
				{
					continue;
				}
				status=2;
				status=findStatusFormMsg(msg);
				System.out.println("status is :"+msg +" id is :" + status);
				list.add(status);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}
	
	/*   从结果中获取状态
	  		r – 运行      0
			b – 阻塞     1
			p – 暂停     4
			s – 关闭      2 
			c – 崩溃      2
			d – 垂死     2
	 */
	public static int findStatusFormMsg(String msg)
	{
		int result=3;
		if (msg.lastIndexOf('r')>=0 )
		{
			result=0;
		}
		else if (msg.lastIndexOf('b')>=0)
		{
			result=1;
		}
		else if (msg.lastIndexOf('p')>=0)
		{
			result=4;
		}
		else
		{
			result=2;
		}
		return result;
	}
	
	/*
	 * 找元素
	 */
	public static int searchInArray(int value,int[] array,int start,int end)
	{
		if (start>end)
		{
			return -1;
		}
		
		int mid=(start+end)/2;
		if (value==array[mid])
		{
			return mid;
		}
		else if (value>array[mid])
		{
			return searchInArray(value,array,mid+1,end);
		}
		else
		{
			return searchInArray(value,array,start,mid-1);
		}
	
	}
	
	/*
	 *  获取运行状态
	 */
	public static int getRunStatusFormCmd(int vmid)
	{
		//统一编号：
		//vm-1   xp
		//vm-2   win7
		
		String cmdWin32="xm list vm-"+vmid;
		int status=3;
		Process p;
		try {
			p = Runtime.getRuntime().exec(cmdWin32);
			BufferedReader br = new BufferedReader(
					new InputStreamReader(p.getInputStream()));
			p.waitFor();
			String msg = null;
			//System.out.println("start-----");
			int count=0;
			while ((msg = br.readLine()) != null)
			{
				count++;
				if (count==1)
				{
					continue;
				}
				
				System.out.println("mgs is :"+  msg);
				
				status=findStatusFormMsg(msg);
				//System.out.println(msg);
			}
			//System.out.println("-------end");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			status=3;
		}
		return status;
	}
	
	
}
