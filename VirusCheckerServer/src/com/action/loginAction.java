package com.action;

import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import org.apache.struts2.ServletActionContext;
import com.opensymphony.xwork2.Action;
import com.opensymphony.xwork2.ActionContext;

import com.Helper;
import com.bean.User;
import com.work.UserWork;

public class loginAction implements Action {

	private String message;
	private String username;
	private String password;
	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public String getPassword() {
		return password;
	}
	
	public void setPassword(String password) {
		this.password = password;
	}
	
	@Override
	public String execute() throws Exception {
		//System.out.println(username+" "+password);
		
		UserWork work=new UserWork();
		User user=work.checkLogin(new User(username,password));
		
		if (user.getId()>0)
		{
			Map<String, Object>  session = ActionContext.getContext().getSession();
        	session.put(Helper.uidSession,user.getId());
        	session.put(Helper.permissionSession, user.getPermission());
        	return SUCCESS;
		}
		message = "username or password is ok?";
		return "fail";
	}

}