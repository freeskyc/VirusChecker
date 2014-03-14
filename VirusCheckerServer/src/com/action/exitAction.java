package com.action;

import com.opensymphony.xwork2.Action;
import com.work.VMOSWork;
import com.Helper;

public class exitAction implements Action {

	@Override
	public String execute() throws Exception {
		// TODO Auto-generated method stub
		int sid=Helper.getUIDSession();
		if (sid>0)
		{
			VMOSWork work=new VMOSWork();
			work.disposeVMOS(sid);
		}	
		return SUCCESS;
	}

}
