package com.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.DBHelper;
import com.bean.NVMInfoBean;
import com.bean.OSLinkNumBean;
import com.bean.SysInfoBean;
import com.bean.VMInfoBean;
import com.bean.VMList;
import com.bean.VMRunStatus;

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

	public List getAllLinkOS() {
		// TODO Auto-generated method stub
		List<OSLinkNumBean> list =new ArrayList<OSLinkNumBean>();
		PreparedStatement prep = null;
		Connection conn=DBHelper.getConnection();
		//这SQL请教M大神！
		//太屌了～～
		//能够查出id,number
		String sql="select s.systemid,count(v.vmid) from sysinfo s left join vminfo v on v.systemid=s.systemid group by s.systemid order by s.systemid asc";
		try{
			prep = conn.prepareStatement(sql);
			ResultSet rs = prep.executeQuery(); 
			while (rs.next())
			{
				OSLinkNumBean bean=new OSLinkNumBean(rs.getInt(1),rs.getInt(2));
				list.add(bean);
			}
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return list;
	}

	public long addNewOS(SysInfoBean sysInfoBean) {

		long sysid=0;
		PreparedStatement prep = null;
		Connection conn=DBHelper.getConnection();
		String sql="insert into sysinfo(name,version,imgurl) values (?,?,?)";
		String sql3="select LAST_INSERT_ID()";
		try{
			prep = conn.prepareStatement(sql);
			prep.setString(1, sysInfoBean.getName());
			prep.setString(2, sysInfoBean.getVersion());
			prep.setString(3, sysInfoBean.getImgurl());
			if (prep.executeUpdate()>0)
			{
				prep=conn.prepareStatement(sql3);
				ResultSet re=prep.executeQuery();
				if (re.next())
				{
					sysid=re.getLong(1);
				}
			}
			
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return sysid;
	
	}

	public List getAllVMSystemData() {
		PreparedStatement prep = null;
		ArrayList<SysInfoBean> list=new ArrayList<SysInfoBean>();
		ResultSet re = null;
		Connection conn=DBHelper.getConnection();
		String sql = "select * from sysinfo order by systemid asc";
		try {
			prep = conn.prepareStatement(sql);
			re = prep.executeQuery();
			while (re.next()) {
				//System.out.println("in VMManagerDao.getAllVMSystemData(): url is: "+re.getString(4));
				list.add(new SysInfoBean(re.getInt(1),re.getString(2),re.getString(3),re.getString(4)));
			}
			conn.close();
		}catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	public String getOSImgUrlByOSId(int sysid) {
		// TODO Auto-generated method stub
		PreparedStatement prep = null;
		String r=null;
		Connection conn=DBHelper.getConnection();
		String sql="select imgurl from sysinfo where systemid=?";
		try{
			prep = conn.prepareStatement(sql);
			prep.setInt(1, sysid);
			ResultSet re=prep.executeQuery();
			if (re.next())
			{
				r=re.getString(1);
			}
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return r;
	}

	public int isOSLinkMoreVM(int sysid)
	{
		int r=0;
		PreparedStatement prep = null;
		Connection conn=DBHelper.getConnection();
		String sql="select count(v.vmid) from vminfo v,sysinfo s where v.systemid=s.systemid and s.systemid=?";
		try{
			prep = conn.prepareStatement(sql);
			prep.setInt(1, sysid);
			ResultSet rs = prep.executeQuery(); 
			if (rs.next())
			{
				r=rs.getInt(1);
			}
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		
		return r;
	}

	public boolean deleteOSByID(int sysid)
	{
		boolean r=false;
		PreparedStatement prep = null;
		Connection conn=DBHelper.getConnection();
		String sql="delete from sysinfo where systemid=?";
		try{
			prep = conn.prepareStatement(sql);
			prep.setInt(1, sysid);
			if (prep.executeUpdate()>0)
			{
				r=true;
			}
			conn.close();
		}
		catch(Exception e)
		{
			 r=false;;
			e.printStackTrace();
		}
		return r;
	}

	/*
	 * 涉及到三个表的查询：vminfo,vmstatus,sysinfo
	 */
	public List<VMInfoBean> getAllVMData() {
		List<VMInfoBean> list=new ArrayList<VMInfoBean>();
		PreparedStatement prep = null;
		ResultSet re = null;
		Connection conn=DBHelper.getConnection();
		//String sql = "select v.vmid,v.systemid,v.underwork, s.ipadd,s.port,s.runstatus,i.name,i.version from vminfo v,vmstatus s,sysinfo i where v.vmid=s.vmid and i.systemid=v.systemid";
		String sql = "select v.vmid,v.systemid,v.underwork, s.ipadd,s.port,i.name,i.version from vminfo v,vmstatus s,sysinfo i where v.vmid=s.vmid and i.systemid=v.systemid";
		try {
			prep = conn.prepareStatement(sql);
			re = prep.executeQuery();
			while (re.next()) {
				//VMInfoBean bean=new VMInfoBean(re.getInt(1),re.getInt(2),re.getInt(3),re.getString(4),re.getInt(5),re.getInt(6),re.getString(7),re.getString(8));
				VMInfoBean bean=new VMInfoBean(re.getInt(1),re.getInt(2),re.getInt(3),re.getString(4),re.getInt(5),re.getString(6),re.getString(7));
				
				System.out.println(re.getInt(1)+" "+re.getInt(2)+" "+re.getInt(3)+" "+re.getString(4)+" "+re.getInt(5)+" "+re.getString(6)+" "+re.getString(7));
				
				list.add(bean);
			}
			conn.close();
		}catch (Exception e) {
			e.printStackTrace();
		}
		return list;
	}

	/*
	 * 添加虚拟机的话
	 * 要涉及到两个表
	 * vminfo： vmid | systemid | underwork  这个表用来看谁在用这个VM
	 * vmstatus：vmid | ipadd | port |runstatus 这个表用来看当前的VM状态
	 */
	public long addNewVM(NVMInfoBean bean)
	{
		long bl=0;
		PreparedStatement prep = null;
		long lastId=0;
		Connection conn=DBHelper.getConnection();
		String sql="insert into vminfo(systemid,underwork) values(?,0)";
		String sql2="insert into vmstatus(vmid,ipadd,port) values(?,?,?)";
		String sql3="select LAST_INSERT_ID()";
		try{
			prep = conn.prepareStatement(sql);
			prep.setInt(1, bean.getSysid());
			if (prep.executeUpdate()>0)
			{
				prep= conn.prepareStatement(sql3);
				ResultSet rs = prep.executeQuery(); 
				if (rs.next()){
					lastId=rs.getLong(1);
				}
				
				if (lastId>0)
				{
					prep= conn.prepareStatement(sql2);
					prep.setLong(1, lastId);
					prep.setString(2, bean.getIpadd());
					prep.setInt(3, bean.getPort());
					//prep.setInt(4, bean.getRunstatus());
					if (prep.executeUpdate()>0)
					{
						bl=lastId;
					}
				}
			}
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			bl=0;
		}
		
		
		return bl;
	}

	public boolean deleteVMById(int vmid) {
		boolean bl=false;
		PreparedStatement prep = null;
		Connection conn=DBHelper.getConnection();
		String sql1="delete from vminfo where vmid=?";
		String sql2="delete from vmstatus where vmid=?";
		try{
			prep = conn.prepareStatement(sql1);
			prep.setInt(1, vmid);
			int b=prep.executeUpdate();
			prep=conn.prepareStatement(sql2);
			prep.setInt(1, vmid);
			int c=prep.executeUpdate();
			if (b>0 && c>0)
			{
				bl=true;
			}
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			bl=false;
		}
		return bl;
	}

	public String getShortUserVMInfo(int uid) {
			PreparedStatement prep = null;
			ResultSet re = null;
			String res= null;
			Connection conn=DBHelper.getConnection();
			String sql = "select os from usrvminfo";
			try {
				prep = conn.prepareStatement(sql);
				re = prep.executeQuery();
				if (re.next()) {
					res=re.getString(1);
				}
				conn.close();
			}catch (Exception e) {
				e.printStackTrace();
			}
			return res;
	}

	public boolean updateUserVMNumber(String rest, int sysid,int flag) {
		PreparedStatement prep = null;
        boolean res=false;
		Connection conn=DBHelper.getConnection();
		String sql = "";
		if (flag == 0){
			sql = "update usrvminfo set os=? where id=?";
		}else{
			 sql = "insert into  usrvminfo(os,id)  values(?,?)";
		}
		
		try {
			prep = conn.prepareStatement(sql);
			prep.setString(1, rest);
			prep.setInt(2, sysid);
			if (prep.executeUpdate()>0)
			{
				res=true;
			}
			conn.close();
		}catch (Exception e) {
			e.printStackTrace();
			res=false;
		}
		return res;
	}

	/*
	 * 在上传样本文件时候，更新数据库
	 */
	public boolean addUsrUploadFile(String fileName, String bFileName, int uid) {
		PreparedStatement prep = null;
		boolean bl=false;
		Connection conn=DBHelper.getConnection();
		String sql="insert into usrfileinfo(id,filename,bfilename,date) values(?,?,?,?)";
		try{
			prep = conn.prepareStatement(sql);
			prep.setInt(1,uid);
			prep.setString(2, fileName);
			prep.setString(3, bFileName);
			java.util.Date date=new java.util.Date();
			prep.setDate(4, new Date(date.getTime()));
			if (prep.executeUpdate()>0)
			{
				bl=true;	
			}
			conn.close();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			bl=false;
		}
		
		return bl;
	}

	public ArrayList<VMList> getUseableVM(Connection conn) {
		ArrayList<VMList> list=new ArrayList<VMList>();
		PreparedStatement prep = null;
		ResultSet re = null;
		String sql = "select vminfo.vmid,vminfo.systemid,sysinfo.name,sysinfo.version,sysinfo.imgurl from vminfo,sysinfo where vminfo.underwork=0 and vminfo.systemid=sysinfo.systemid order by vminfo.systemid";
		try {
			int psysid=-1;
			prep = conn.prepareStatement(sql);
			re = prep.executeQuery();
			while (re.next()) {
				int sysid=re.getInt(2);
				if (psysid!=sysid)
				{
					list.add(new VMList(re.getInt(2),re.getString(3),re.getString(4),re.getString(5)));
				}
				VMList vlist=list.get(list.size()-1);
				int e=re.getInt(1);
				vlist.addVmid(e);	
			}		
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return list;
	
	}


	public void UpdateVMInfo(Connection conn, ArrayList<Integer> updateList,
			int uid) {
			PreparedStatement prep = null;
			String sql = "update vminfo set underwork=? where vmid=?";
			try {
				prep = conn.prepareStatement(sql);
				int length=updateList.size();
				prep.setInt(1,uid);
				for (int i=0;i<length;i++)
				{
					prep.setInt(2, updateList.get(i));
					prep.executeUpdate();
				}	
			}catch (Exception e) {
				e.printStackTrace();
			}
	}

	public VMRunStatus getVMRunStatus(int vmid, Connection conn) {
		PreparedStatement prep = null;
		VMRunStatus status=null;
		ResultSet re = null;
		////////////////
		String sql = "select * from vmstatus where vmid=?";
		try {
			prep = conn.prepareStatement(sql);
			prep.setInt(1,vmid);
			re = prep.executeQuery();
			if (re.next()) {
				status=new VMRunStatus(re.getInt(1),re.getString(2),re.getInt(3));
			}
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		return status;
	}
	
	
}
