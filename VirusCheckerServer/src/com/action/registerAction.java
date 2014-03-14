package com.action;

//import com.config;
import com.bean.User;
import com.opensymphony.xwork2.Action;
import com.work.UserWork;

public class registerAction implements Action {

	private String username;
	private String password;
	private String mail;
	private String agpassword;
	private String message;
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
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public String getAgpassword() {
		return agpassword;
	}
	public void setAgpassword(String agpassword) {
		this.agpassword = agpassword;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	@Override
	public String execute() throws Exception {
		User user=new User(username,password,agpassword,mail);
		UserWork work=new UserWork();
		/*
		 * 5种msg： 
		 * userExist="1" 
		 * pwdNotMatch="2" 
		 * nullError="3"  
		 * addUserFail="4"
		 * rgsuccess="ok"
		*/
		this.message=work.register(user);
		System.out.println(message);
		
		if (message.equals("ok"))
		{
			return SUCCESS;
		}
		else
		{
			return "fail";
		}
	}

}
