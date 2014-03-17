package com.work;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.DBHelper;
import com.bean.SysInfoBean;
import com.bean.VMInfoBean;
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

	public List getAllLinkOS() {
		// TODO Auto-generated method stub
		VMManagerDao dao=new VMManagerDao();
		return dao.getAllLinkOS();
	}

	public long addNewOS(SysInfoBean sysInfoBean) {
		// TODO Auto-generated method stub
		VMManagerDao dao=new VMManagerDao();
		return dao.addNewOS(sysInfoBean);
	}

	public List getAllVMSystemData() {
		// TODO Auto-generated method stub
		VMManagerDao dao=new VMManagerDao();
		return dao.getAllVMSystemData();	
	}

	/*
	 * 辅助函数
	 * 为了在删除系统的时候顺便删除图片！
	 * */
	public String getOSImgUrlByOSId(int sysid) {
		// TODO Auto-generated method stub
		VMManagerDao dao=new VMManagerDao();
		return dao.getOSImgUrlByOSId(sysid);
	}

	public int deleteOSByOSId(int sysid)
	{
		/*
		 * r 表示一个变量，初始化为0
		 * 等于2的时候，表示不能删除，因为有虚拟机在用这个系统
		 * 等于1的时候，表示能删除且删除成功。。
		 * */
		int r=0;
		VMManagerDao dao=new VMManagerDao();
		int leftnumber=dao.isOSLinkMoreVM(sysid);
		if (leftnumber>0)
		{
			r=2;
		}
		else
		{
			if (dao.deleteOSByID(sysid))
			{
				r=1;
			}		
		}
		
		return r;
	}

	

	
}
