package com.bean;

public class SysInfoBean {
	private int systemid;
	private String name;
	private String version;
	private String imgurl;
	public int getSystemid() {
		return systemid;
	}
	public void setSystemid(int systemid) {
		this.systemid = systemid;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getImgurl() {
		return imgurl;
	}
	public void setImgurl(String imgurl) {
		this.imgurl = imgurl;
	}
	public SysInfoBean(int systemid, String name, String version, String imgurl) {
		super();
		this.systemid = systemid;
		this.name = name;
		this.version = version;
		this.imgurl = imgurl;
	}
	
}
