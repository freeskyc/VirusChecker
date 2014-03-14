package com.bean;

public class User {
	private int id;
	private String username;
	private String password;
	private int permission;
	private String mail;
	private String agpassword;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
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
	
	
	public String getAgpassword() {
		return agpassword;
	}
	public void setAgpassword(String agpassword) {
		this.agpassword = agpassword;
	}
	public int getPermission() {
		return permission;
	}
	public void setPermission(int permission) {
		this.permission = permission;
	}
	
	public String getMail() {
		return mail;
	}
	public void setMail(String mail) {
		this.mail = mail;
	}
	public User(String username, String password) {
		super();
		this.username = username;
		this.password = password;
	}
	public User(int id, String username, String password, int permission,String mail) {
		super();
		this.id = id;
		this.username = username;
		this.password = password;
		this.permission = permission;
		this.mail=mail;
	}
	
	public User(String username, String password,
			String agpassword,String mail) {
		this.username = username;
		this.password = password;
		this.mail = mail;
		this.agpassword = agpassword;
	}

	public boolean checkRegisterInfoNotNull()
	{
		boolean bl;
		if (this.username==null || this.username.equals(""))
		{
			bl=false;
		}
		else if (this.password==null || this.password.equals(""))
		{
			bl=false;
		}
		else if (this.agpassword==null || this.agpassword.equals(""))
		{
			bl=false;
		}
		else if (this.mail==null || this.mail.equals(""))
		{
			bl=false;
		}
		else
		{
			bl=true;
			
		}		
		return bl;
	}
	
	public boolean checkAgPwdEqPwd()
	{
		return password.equals(agpassword);
	}
	
	
}
