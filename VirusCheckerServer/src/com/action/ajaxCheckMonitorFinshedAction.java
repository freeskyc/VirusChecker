package com.action;

import org.apache.struts2.ServletActionContext;

import com.Helper;
import com.opensymphony.xwork2.ActionSupport;
import com.work.ControlWork;

public class ajaxCheckMonitorFinshedAction extends ActionSupport 
{
	public String message;
	public String vmids;
	public int[] status;
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getVmids() {
		return vmids;
	}
	public void setVmids(String vmids) {
		this.vmids = vmids;
	}
	
	public int[] getStatus() {
		return status;
	}
	public void setStatus(int[] status) {
		this.status = status;
	}
	
	@Override
	public String execute() throws Exception {
		int uid = Helper.getUIDSession();
		this.message="-1";
		if (uid>0 && vmids!=null && !vmids.equals(""))
		{
			String[] pvmids=vmids.split(",");
			ControlWork work=new ControlWork();
			String basePath=ServletActionContext.getRequest().getRealPath("/tmp/"+uid+"/")+"/";
			this.status=work.checkFCMonitorOver(pvmids,basePath);
			if (this.status!=null)
			{
				this.message="0";
			}
		}
		return SUCCESS;
	}
	
	
}
