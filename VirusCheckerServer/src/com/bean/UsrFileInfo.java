package com.bean;

import java.util.Date;

public class UsrFileInfo {
	private int fid;
	private int id;
	private String fileName;
	private String bfileName;
	private Date date;
	public int getFid() {
		return fid;
	}
	public void setFid(int fid) {
		this.fid = fid;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getBfileName() {
		return bfileName;
	}
	public void setBfileName(String bfileName) {
		this.bfileName = bfileName;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public UsrFileInfo(int fid, int id, String fileName, String bfileName,
			Date date) {
		super();
		this.fid = fid;
		this.id = id;
		this.fileName = fileName;
		this.bfileName = bfileName;
		this.date = date;
	}
	
	
}
