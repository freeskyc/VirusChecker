package com.action;

import com.Helper;
import com.opensymphony.xwork2.ActionSupport;
import com.work.ControlWork;

public class ajaxStartVMAction extends ActionSupport  {
	
		private String  message;
		private int id;
		
		public String  getMessage(){
			return this.message;
		}
		public void setMessage(String msg){
			this.message = msg;
		}
		public int getId(){
			return this.id;
		}
		public void setId(int id){
			this.id = id;
		}
		
		@Override
		public String execute() throws Exception {
			this.message = "-1";
			if(Helper.getUIDSession() > 0 ){
				ControlWork cw = new ControlWork();
				this.message = cw.startVMById(id)+"";
			}
			return SUCCESS;
		}
		
}
