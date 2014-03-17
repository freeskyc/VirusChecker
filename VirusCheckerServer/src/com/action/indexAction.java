package com.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.opensymphony.xwork2.Action;
import com.work.VMOSWork;
import com.Helper;

public class indexAction implements Action {

	@Override
	public String execute() throws Exception {
		// TODO Auto-generated method stub
		int uid = Helper.getUIDSession();
		int pid = Helper.getPermissionSession();
		
		System.out.println(uid);
		if (uid>0)
		{
			HttpServletRequest request = ServletActionContext.getRequest();
			request.setAttribute("permission", pid);
			System.out.println(uid+"l");
			
			if (pid==1)
			{
				VMOSWork work=new VMOSWork();
				List oslink=work.getAllLinkOS();			
				request.setAttribute("oslink",oslink);
				
				List syslist=work.getAllVMSystemData();
				request.setAttribute("sysinfo", syslist);				
			}
			

			
			return SUCCESS;
		}
		else{
			return "notLogin";
		}
		
	}

}
