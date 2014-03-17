package com.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.DBHelper;
import com.bean.OSLinkNumBean;
import com.bean.SysInfoBean;

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
	
	
}
