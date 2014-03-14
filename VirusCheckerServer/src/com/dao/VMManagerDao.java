package com.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class VMManagerDao {

	public void DisposeVMOS(Connection conn,int sid)
	{
		PreparedStatement prep = null;
		String sql = "update vminfo set underwork=0 where underwork=?";
		try {
			prep = conn.prepareStatement(sql);
			prep.setInt(1,sid);
			prep.executeUpdate();
		}catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
