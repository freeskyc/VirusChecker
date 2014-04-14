package com.bean;

public class VMRunStatus {
	
	private int vmid;
	private String ipadd;
	private int port;
	private int runstatus;
	
	
	public int getVmid() {
		return vmid;
	}
	public void setVmid(int vmid) {
		this.vmid = vmid;
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
	public VMRunStatus(int vmid, String ipadd, int port) {
		super();
		this.vmid = vmid;
		this.ipadd = ipadd;
		this.port = port;
		//this.runstatus = runstatus;
	}
	
}
