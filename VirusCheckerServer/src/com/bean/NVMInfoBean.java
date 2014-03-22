package com.bean;

public class NVMInfoBean {
	private int sysid;
	private String ipadd;
	private int port;
	private int runstatus;
	public int getSysid() {
		return sysid;
	}
	public void setSysid(int sysid) {
		this.sysid = sysid;
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
	public NVMInfoBean(int sysid, String ipadd, int port, int runstatus) {
		super();
		this.sysid = sysid;
		this.ipadd = ipadd;
		this.port = port;
		this.runstatus = runstatus;
	}
}
