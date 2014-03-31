package com.bean;

import java.util.Date;

public class HistoryFileInfoBean {
	private int fid;
	private int id;
	private String filename;
	private String bfilename;
	private Date date;
	private int isvirus;
	private Date ldate;
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
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	public int getIsvirus() {
		return isvirus;
	}
	public void setIsvirus(int isvirus) {
		this.isvirus = isvirus;
	}
	public Date getLdate() {
		return ldate;
	}
	public void setLdate(Date ldate) {
		this.ldate = ldate;
	}
	
	public String getFilename() {
		return filename;
	}
	public void setFilename(String filename) {
		this.filename = filename;
	}
	
	
	public String getBfilename() {
		return bfilename;
	}
	public void setBfilename(String bfilename) {
		this.bfilename = bfilename;
	}
	public HistoryFileInfoBean(int fid, int id, String filename,String bfilename,Date date, int isvirus,
			Date ldate) {
		this.fid = fid;
		this.id = id;
		this.filename=filename;
		this.bfilename=bfilename;
		this.date = date;
		this.isvirus = isvirus;
		this.ldate = ldate;
	}
	
}
