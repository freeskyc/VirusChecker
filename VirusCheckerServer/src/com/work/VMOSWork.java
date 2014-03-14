package com.work;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.DBHelper;
import com.dao.VMManagerDao;

public class VMOSWork {

	public void disposeVMOS(int sid) {
		Connection conn = DBHelper.getConnection();
		try {
			//DBHelper.lockTabWithWE(conn);
			
			VMManagerDao dao = new VMManagerDao();
			dao.DisposeVMOS(conn, sid);
			
			//DBHelper.unlockTable(conn);
			conn.close();
		
		} catch (Exception e) {
			e.printStackTrace();
			if (conn != null){
				//DBHelper.unlockTable(conn);
				try {
					conn.close();
				} catch (SQLException e1) {
					// TODO Auto-generated catch block
					e1.printStackTrace();
				}
			}
		}
	}

	
}
