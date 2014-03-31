package com.action;

import java.util.List;

import com.Helper;
import com.opensymphony.xwork2.ActionSupport;
import com.work.UserWork;

public class ajaxGetHistoryFileAction extends ActionSupport 
{
	private String message;
	private List list;
	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public List getList() {
		return list;
	}

	public void setList(List list) {
		this.list = list;
	}

	@Override
	public String execute() throws Exception {
		int uid=Helper.getUIDSession();
		this.message="-1";
		this.list=null;
		if (uid>0)
		{
			UserWork work=new UserWork();
			this.list=work.getHistoryFileInfo(uid);
			this.message="0";
		}
		return SUCCESS;
	}
	
}
