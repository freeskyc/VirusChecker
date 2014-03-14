package com;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBHelper {
	public static String database="virusmonitor";
	public static String user="root";
	//public static String password="";
	public static String password="123qwe";
	
	public static void initDBHelper(String database,String user,String password)
	{
		DBHelper.database=database;
		DBHelper.user=user;
		DBHelper.password=password;
	}
	
	public static Connection getConnection(){
	    Connection conn = null ; 
	     try {
			Class.forName("com.mysql.jdbc.Driver");
			conn  = DriverManager.getConnection("jdbc:mysql://127.0.0.1:3306/"+database+"?characterEncoding=utf-8",user,password);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	     catch (Exception e)
	     {
	    	 e.printStackTrace();
	     }
	    return  conn ;
		}
	
}
