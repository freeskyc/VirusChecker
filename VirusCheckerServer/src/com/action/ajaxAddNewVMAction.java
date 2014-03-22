package com.action;

import com.Helper;
import com.bean.NVMInfoBean;
import com.opensymphony.xwork2.ActionSupport;
import com.work.VMOSWork;

public class ajaxAddNewVMAction extends ActionSupport 
{
	private int sysid;
	private String ipadd;
	private int port;
	private int runstatus;
	private String message;
	public int getSysid() {
		return sysid;
	}
	public void setSysid(int sysid) {
		this.sysid = sysid;
	}
	public String getIpadd() {
		return ipadd;
	}
	public void setIpadd(String ipadd) {
		this.ipadd = ipadd;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public int getRunstatus() {
		return runstatus;
	}
	public void setRunstatus(int runstatus) {
		this.runstatus = runstatus;
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
		this.message="0";
		if (uid>0)
		{
			int pid=Helper.getPermissionSession();
			if (pid==1)
			{
				VMOSWork work=new VMOSWork();
				long l=work.addNewVM(new NVMInfoBean(sysid,ipadd,port,runstatus));
				if (l>0)
				{
					this.message=l+"";
				}
			}
		}
		return SUCCESS;
	}
}
