package com.bean;

import java.util.ArrayList;
import java.util.Date;

public class VMList {
	
	private int systemid;
	private String sysname;
	private String sysversion;
	private String sysurl;
	
	private ArrayList<Integer> vmid;
	private ArrayList<Integer> status;
	private ArrayList<String> iplist;
	private ArrayList<Integer> portlist;
	
	
	public  ArrayList<Integer> getVmid() {
		return vmid;
	}
	public void setVmid( ArrayList<Integer> vmid) {
		this.vmid = vmid;
	}
	public int getSystemid() {
		return systemid;
	}
	public void setSystemid(int systemid) {
		this.systemid = systemid;
	}
	public String getSysname() {
		return sysname;
	}
	public void setSysname(String sysname) {
		this.sysname = sysname;
	}
	public String getSysversion() {
		return sysversion;
	}
	public void setSysversion(String sysversion) {
		this.sysversion = sysversion;
	}
	public String getSysurl() {
		return sysurl;
	}
	public void setSysurl(String sysurl) {
		this.sysurl = sysurl;
	}
	
	
	
	public ArrayList<String> getIplist() {
		return iplist;
	}
	public void setIplist(ArrayList<String> iplist) {
		this.iplist = iplist;
	}
	public ArrayList<Integer> getPortlist() {
		return portlist;
	}
	public void setPortlist(ArrayList<Integer> portlist) {
		this.portlist = portlist;
	}
	public VMList(int systemid, String sysname, String sysversion, String sysurl) {
		super();
		this.systemid = systemid;
		this.sysname = sysname;
		this.sysversion = sysversion;
		this.sysurl = sysurl;
		this.vmid=new ArrayList<Integer>();
		
		this.status=new ArrayList<Integer>();
		this.iplist=new ArrayList<String>();
		this.portlist=new ArrayList<Integer>();
	}
	
	public VMList() {
		// TODO Auto-generated constructor stub
	}
	public void addVmid(int vmid)
	{
		this.vmid.add(vmid);
	}
	
	public  int getVmidLength()
	{
		return this.vmid.size();
	}
	public ArrayList<Integer> getStatus() {
		return status;
	}
	public void setStatus(ArrayList<Integer> status) {
		this.status = status;
	}
	
	public void addStatus(int status)
	{
		this.status.add(status);
	}
	
	public void addIp(String ip)
	{
		this.iplist.add(ip);
	}
	
	public void addPort(int port)
	{
		this.portlist.add(port);
	}
	
	
}
