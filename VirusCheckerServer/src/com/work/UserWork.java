package com.work;

import java.io.File;

import org.apache.struts2.ServletActionContext;

import com.bean.User;
import com.dao.UserManagerDao;

public class UserWork {
	
	//check the username and password
	public User checkLogin(User user)
	{
		UserManagerDao dao=new UserManagerDao();
		return dao.checkUserAndPassword(user);
	}
	
	public String register(User user)
	{
		String userExist="1";
	    String pwdNotMatch="2";
		String nullError="3";
		String rgsuccess="ok";
		String addUserFail="4";
			
		UserManagerDao dao=new UserManagerDao();
		String msg="";
		//每个text 不能为空
		if (!user.checkRegisterInfoNotNull()) 
		{
			msg=nullError;
		}
		//两个密码是否匹配
		else if (!user.checkAgPwdEqPwd())
		{
			msg=pwdNotMatch;
		}
		//数据库中是否已经存在要注册的?
		else if (dao.checkUserExist(user))
		{
			msg=userExist;
		}
		else 
		{
			long uid=dao.addUser(user);
			if (uid>0)
			{
				msg=rgsuccess;
			}
			else{
				msg = addUserFail;
			}
		}
		return msg;
	}
}
