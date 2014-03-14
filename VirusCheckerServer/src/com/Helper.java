package com;

import java.util.Map;

import com.opensymphony.xwork2.ActionContext;

public class Helper {
	
	public static String uidSession="uid";
	public static String permissionSession="permission";
	
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
}
