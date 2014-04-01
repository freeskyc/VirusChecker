package com.work;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.DBHelper;
import com.Helper;
import com.bean.NVMInfoBean;
import com.bean.SidVMNumberInfo;
import com.bean.SysInfoBean;
import com.bean.VMInfoBean;
import com.dao.UserManagerDao;
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

	/*
	 * 返回一个记录 ：systemid - number 的list
	 */
	public List getShortUserVMInfo(int uid) {
			VMManagerDao dao=new VMManagerDao();
			String res=dao.getShortUserVMInfo(uid);
			//假设res 是 1-1,2-1,3-1
			if (res!=null)
			{
				try{
					List list=new ArrayList<SidVMNumberInfo>();
					String[] pt=res.split(",");
					int length=pt.length;
					for (int i=0;i<length;i++)
					{
						String[] pb=pt[i].split("-");
						if (pt[i]==null || pt[i].equals(""))
						{
							continue;
						}
						SidVMNumberInfo ss=new SidVMNumberInfo(Integer.parseInt(pb[0]),Integer.parseInt(pb[1]));
						list.add(ss);
					}
					return list;
				}
				catch(Exception e)
				{
					e.printStackTrace();
					return null;
				}
			}
			else
			{
				return null;
			}
	}

	public boolean changeUserVMNumber(int sysid, int number, int uid) {
			VMManagerDao dao=new VMManagerDao();
			String info=dao.getShortUserVMInfo(sysid);
			System.out.println("change user vm num 's info:"+info);
			if (info==null || info.equals(""))
			{
					//return dao.updateUserVMNumber(sysid+"-"+number, sysid,1);
					return dao.updateUserVMNumber(sysid+"-"+number, uid,1);
			}
			else
			{
				String target=sysid+"-";
				int index=info.indexOf(target);
				String rest="";
				
				if(index > 0){
						String[] pb;
						String up;
						if(index-1>=0)
						{
							up=info.substring(0,index-1);	
						}
						else
						{
							up="";
						}
					
						String back=info.substring(index);
						//System.out.println("up!"+up);
						//System.out.println("back!"+back);
						int bindex=back.indexOf(",");
						//System.out.println("bindex"+bindex);
						if (bindex<0)
						{
							pb=back.split("-");
						}
						else
						{
							String tmp=back.substring(0,bindex);
							back=back.substring(bindex);
							System.out.println("newback!"+back);
							pb=tmp.split("-");
						}
						
						int n=Integer.parseInt(pb[1]);
						n=n+number;
						//System.out.println("n="+n+",pb[0]="+pb[1]);
						if (n<=0)
						{
							if (bindex>=0)
							{
								rest=up+back;
							}
							else
							{
								rest=up;
							}
						}
						else
						{
							if (bindex>=0)
							{
								if (!up.equals(""))
								{
									rest=up+","+sysid+"-"+n+back;
								}
								else
								{
									rest=sysid+"-"+n+back;
								}
							}
							else
							{
								if (!up.equals(""))
								{
									rest=up+","+sysid+"-"+n;
								}
								else
								{
									rest=sysid+"-"+n;
								}
							}
						}
						
						//return dao.updateUserVMNumber(rest, sysid,0);
						return dao.updateUserVMNumber(rest, uid,0);
				}
				else
				{
					if (number<0)
					{
						return false;
					}
					else 
					{
						rest=info+","+sysid+"-"+number;
						System.out.println("rest : "+rest);
						return dao.updateUserVMNumber(rest, uid,0);
						//return dao.updateUserVMNumber(rest, sysid,0);
					}
				}
				
			}
			
			
	}

	public List getHistoryFile(int uid) {
		UserManagerDao dao=new UserManagerDao();
		return dao.getHistoryFile(uid);
	}

	
}
