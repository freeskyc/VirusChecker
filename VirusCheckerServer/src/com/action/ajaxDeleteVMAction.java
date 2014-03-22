package com.action;

import com.Helper;
import com.opensymphony.xwork2.ActionSupport;
import com.work.VMOSWork;

public class ajaxDeleteVMAction extends ActionSupport 
{
	private int vmid;
	private String message;
	public int getVmid() {
		return vmid;
	}
	public void setVmid(int vmid) {
		this.vmid = vmid;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	@Override
	public String execute() throws Exception {
		int uid=Helper.getUIDSession();
		this.message="0";
		if (uid>0)
		{
			int pid=Helper.getPermissionSession();
			if (pid==1)
			{
				VMOSWork work=new VMOSWork();
				if (work.deleteVMById(this.vmid))
				{
					this.message="1";
				}
			}
		}
		return SUCCESS;
	}
	
	
	
}
