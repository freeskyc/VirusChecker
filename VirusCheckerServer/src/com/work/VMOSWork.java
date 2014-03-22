package com.work;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.DBHelper;
import com.Helper;
import com.bean.NVMInfoBean;
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
	 * 删除系统
	 * r 表示一个变量，初始化为0
	 * 等于2的时候，表示不能删除，因为有虚拟机在用这个系统
	 * 等于1的时候，表示能删除且删除成功。。
	 * */
	public int deleteOSByOSId(int sysid)
	{
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

	/*
	 * 删除OS的辅助函数
	 * 为了在删除系统的时候顺便删除图片！
	 * */
	public String getOSImgUrlByOSId(int sysid) {
		// TODO Auto-generated method stub
		VMManagerDao dao=new VMManagerDao();
		return dao.getOSImgUrlByOSId(sysid);
	}
	
	/*
	 * 获取所有虚拟机的信息，随便获取他们的状态
	 */
	public List<VMInfoBean> getAllVMData() {
		VMManagerDao dao=new VMManagerDao();
		
		//从数据库获取VM的所有信息，但是获取 不到status，需要配合下面的Helper.getAllRunVMStatus();获取状态
		List<VMInfoBean> list=dao.getAllVMData();
		
		//实时去获取(xm list)状态
		List<Integer> rslist=Helper.getAllRunVMStatus();
		
		if (list!=null && rslist!=null)
		{
			int l1=list.size();
			int l2=rslist.size();
			if (l1==l2)
			{
				for (int i=0;i<l1;i++)
				{
					//把rslist 的状态赋值给对应的list的项
					VMInfoBean bean=list.get(i);
					bean.setRunstatus(rslist.get(i));
				}
			}
			else
			{
				setListVMStatusError(list);
			}
		}
		else if(rslist==null)
		{
			setListVMStatusError(list);
		}		
		return list;	
	
	}

	/*
	 * 获取虚拟机信息的辅助函数
	 * 这函数是备用的 ，当实时获取状态失败的时候，用默认的状态赋值
	 */
	public void setListVMStatusError(List<VMInfoBean> list)
	{
		int l=list.size();
		
		for (int i=0;i<l;i++)
		{
			VMInfoBean bean=list.get(i);
			int runstatus = Helper.vmstatusgetfail; //2 表示 为 关闭等一切不好的状态，项目默认为关闭
			bean.setRunstatus(runstatus);
		}
	}

	public long addNewVM(NVMInfoBean nvmInfoBean) {
		VMManagerDao dao=new VMManagerDao();
		return dao.addNewVM(nvmInfoBean);
	}

	public boolean deleteVMById(int vmid) {
		VMManagerDao dao=new VMManagerDao();
		return dao.deleteVMById(vmid);
	}

	
}
