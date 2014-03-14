package com.work;

import com.bean.User;
import com.dao.UserManagerDao;

public class UserWork {
	
	//check the username and password
	public User checkLogin(User user)
	{
		UserManagerDao dao=new UserManagerDao();
		return dao.checkUserAndPassword(user);
	}
}
