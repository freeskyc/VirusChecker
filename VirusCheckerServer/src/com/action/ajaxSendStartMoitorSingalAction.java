package com.action;

import org.apache.struts2.ServletActionContext;

import com.Helper;
import com.opensymphony.xwork2.ActionSupport;
import com.work.ControlWork;

public class ajaxSendStartMoitorSingalAction extends ActionSupport 
{
	private String filename;
	private String vmids;
	private String message;
	public String getVmids() {
		return vmids;
	}
	public void setVmids(String vmids) {
		this.vmids = vmids;
	}
	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	@Override
	public String execute() throws Exception {
		
		int uid = Helper.getUIDSession();
		this.message="-1";
		System.out.println(vmids+"\n"+filename);
		if (uid>0 && vmids!=null && !vmids.equals(""))
		{
			String[] pvid=vmids.split(",");
			ControlWork work=new ControlWork();
			
			String rfileName=ServletActionContext.getRequest().getRealPath("/upload/"+uid+"/")+"/"+filename;
			String rpath=ServletActionContext.getRequest().getRealPath("/tmp/"+uid+"/")+"/"+Helper.fcrpfileName;
			
			work.clearFCMonitorContent(rpath, pvid);
			work.startMonitor(pvid,uid,filename,rfileName);
			System.out.println(rfileName);
			this.message="0";
		}
		return SUCCESS;
	}
	
	
	
}
