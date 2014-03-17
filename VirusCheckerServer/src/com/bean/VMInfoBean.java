package com.bean;

public class VMInfoBean {
	private int vmid;
	private int systemid;
	private int underwork;
	private String ipadd;
	private int port;
	private int runstatus;
	private String osname;
	private String osversion;
	private String runstatusInfo;
	
	public String getOsname() {
		return osname;
	}
	public void setOsname(String osname) {
		this.osname = osname;
	}
	public String getOsversion() {
		return osversion;
	}
	public void setOsversion(String osversion) {
		this.osversion = osversion;
	}
	public String getRunstatusInfo() {
		return runstatusInfo;
	}
	public void setRunstatusInfo(String runstatusInfo) {
		this.runstatusInfo = runstatusInfo;
	}
	public int getVmid() {
		return vmid;
	}
	public void setVmid(int vmid) {
		this.vmid = vmid;
	}
	public int getSystemid() {
		return systemid;
	}
	public void setSystemid(int systemid) {
		this.systemid = systemid;
	}
	public int getUnderwork() {
		return underwork;
	}
	public void setUnderwork(int underwork) {
		this.underwork = underwork;
	}
	
	public String getIpadd() {
		return ipadd;
	}
	public void setIpadd(String ipadd) {
		this.ipadd = ipadd;
	}
	public int getPort() {
		return port;
	}
	public void setPort(int port) {
		this.port = port;
	}
	public int getRunstatus() {
		return runstatus;
	}
	public void setRunstatus(int runstatus) {
		this.runstatus = runstatus;
	}
	
	
	public VMInfoBean(int vmid, int systemid, int underwork, String ipadd,
			int port, String osname,String osversion) {
		this.vmid = vmid;
		this.systemid = systemid;
		this.underwork = underwork;
		this.ipadd = ipadd;
		this.port = port;
		//this.runstatus = runstatus;
		this.osname=osname;
		this.osversion=osversion;
	}
	
}
