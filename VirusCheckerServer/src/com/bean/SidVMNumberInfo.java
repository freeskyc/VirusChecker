package com.bean;

public class SidVMNumberInfo {
	private int systemid;
	private int number;
	public int getSystemId() {
		return systemid;
	}
	public void setSystemId(int systemid) {
		this.systemid = systemid;
	}
	public int getNumber() {
		return number;
	}
	public void setNumber(int number) {
		this.number = number;
	}
	public SidVMNumberInfo(int systemid, int number) {
		super();
		this.systemid = systemid;
		this.number = number;
	}
}
