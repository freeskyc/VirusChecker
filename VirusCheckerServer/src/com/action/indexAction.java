package com.action;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.Action;
import com.Helper;

public class indexAction implements Action {

	@Override
	public String execute() throws Exception {
		// TODO Auto-generated method stub
		int uid = Helper.getUIDSession();
		System.out.println(uid);
		if (uid>0)
		{
			HttpServletRequest request = ServletActionContext.getRequest();
			int pid = Helper.getPermissionSession();
			request.setAttribute("permission", pid);
			System.out.println(uid+"l");
			return SUCCESS;
		}
		else{
			return "notLogin";
		}
		
	}

}
