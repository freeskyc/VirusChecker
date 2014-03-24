package com.action;

import com.Helper;
import com.opensymphony.xwork2.ActionSupport;
import com.work.VMOSWork;

public class ajaxManagerUserVMNumberAction extends ActionSupport 
{
	private int sysid;
	private int number;
	private String message;
	public int getSysid() {
		return sysid;
	}
	public void setSysid(int sysid) {
		this.sysid = sysid;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
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
			VMOSWork work=new VMOSWork();
			System.out.println("uid is :"+uid+"sysid is;"+sysid+"number is:"+number);
			if (work.changeUserVMNumber(sysid, number, uid))
			{
				this.message="1";
			}
			else
			{
				this.message="0";
			}
			
		}	
		return SUCCESS;
	}
}
