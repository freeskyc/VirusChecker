package com.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.DBHelper;
import com.bean.User;

public class UserManagerDao {
	
	public User checkUserAndPassword(User user) {
		Connection conn = DBHelper.getConnection();
		PreparedStatement prep = null;
		ResultSet re = null;
		user.setId(-1);
		//String sql = "select * from user where username='"+user.getUsername()+"' and password='"+user.getPassword()+"'";
		//System.out.println(sql);
		String sql = "select * from user where username=? and password=?";
		try {
			
			prep = conn.prepareStatement(sql);
			prep.setString(1, user.getUsername());
			prep.setString(2, user.getPassword());
			re = prep.executeQuery();
			if (re.next()) {
				user.setId(re.getInt(1));  
				user.setPermission(re.getInt(4)); // permission :amdin or user?
			}
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return user;
	}
	
	public boolean checkUserExist(User user) {
		boolean bl = false;
		Connection conn = DBHelper.getConnection();
		PreparedStatement prep = null;
		ResultSet re = null;
		String sql = "select * from user where username=?";
		try {
			prep = conn.prepareStatement(sql);
			prep.setString(1, user.getUsername());
			re = prep.executeQuery();
			if (re.next()) {
				bl = true;
			}
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return bl;
	}
	
	public long addUser(User user) {
		long bl = 0;
		Connection conn = DBHelper.getConnection();
		PreparedStatement prep = null;
		String sql = "insert user(username,password,mail) values(?,?,?)";
		String sql3 = "select LAST_INSERT_ID()";
		try {
			prep = conn.prepareStatement(sql);
			prep.setString(1, user.getUsername());
			prep.setString(2, user.getPassword());
			prep.setString(3, user.getMail());
			if (prep.executeUpdate() > 0) {
				prep = conn.prepareStatement(sql3);
				ResultSet rs = prep.executeQuery();
				if (rs.next()) {
					bl = rs.getLong(1);
				}
			}
			conn.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return bl;
	}
}
