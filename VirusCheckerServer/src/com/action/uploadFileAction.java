package com.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.Helper;
import com.dao.VMManagerDao;
import com.opensymphony.xwork2.Action;

public class uploadFileAction implements Action {

	private String message;
	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	private File[] upload;// 文件上传时文件映射
	private String[] uploadContentType;// 文件上传时文件的扩展名映射
	private String[] uploadFileName;// 文件上传时文件名映射
	private final static String DOWNLOADFILEPATH = "/upload/";// 文件上传的相对基本路径名

	public File[] getUpload() {
		return upload;
	}

	public void setUpload(File[] upload) {
		this.upload = upload;
	}

	public String[] getUploadContentType() {
		return uploadContentType;
	}

	public void setUploadContentType(String[] uploadContentType) {
		this.uploadContentType = uploadContentType;
	}

	public String[] getUploadFileName() {
		return uploadFileName;
	}

	public void setUploadFileName(String[] uploadFileName) {
		this.uploadFileName = uploadFileName;
	}

	private String getExName(String name) {
		int l = name.lastIndexOf(".");
		return name.substring(l);
	}

	private String getSavePath() throws Exception {
		return ServletActionContext.getRequest().getRealPath(DOWNLOADFILEPATH);
	}
	
	
	private String codeToString(String str) {
		String s = str;
		try {
			byte tempB[] = s.getBytes("utf-8");
			s = new String(tempB, "utf-8");
			System.out.println(s);
			return s;
		} catch (Exception e) {
			return s;
		}
	}
	
	
	
	@Override
	public String execute() throws Exception {
		int uid=Helper.getUIDSession();
		if (uid<=0)
		{
			this.message="no";
			return SUCCESS;
		}
	    
		this.message="yes";
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		
		String filePath = "";
		String filetempName = null;
		String serverFileName = "";
		SimpleDateFormat sdff = new SimpleDateFormat("yyyyMMddHHmmss");
		
		System.out.println("1 msg : " + this.message);
		
		try {
			File[] files = this.getUpload();//获得上传的文件
			if (files==null)
			{
				request.setAttribute("message", this.message);
				this.message="no";
				return SUCCESS;
			}
			
			System.out.println("2 msg : " + this.message);
			
			int ll=files.length;
			String savePath = getSavePath();
			for (int i = 0; i < ll; i++) {
				filetempName = uploadFileName[i];
				String dat=sdff.format(new Date());
				
				serverFileName=dat+filetempName.substring(filetempName.lastIndexOf("."));
				filePath += serverFileName + ",";
				
				
				
				//不存在 /upload/uid/文件夹就创建一个
				 File file = new File(savePath+"/"+uid);
				 if (!file.exists()) {
				   file.mkdirs();
				 }
				 
				// 以服务器的文件保存地址和原文件名建立上传文件输出流
				FileOutputStream fos = new FileOutputStream(savePath + "/"+uid+"/"+ serverFileName); //upload/uid/file.exe
				FileInputStream fis = new FileInputStream(files[i]);
				byte[] buffer = new byte[1024];
				int len = 0;
				while ((len = fis.read(buffer)) > 0) {
					fos.write(buffer, 0, len);
				}
				fis.close();
				fos.close();
				
				//数据库更新
				VMManagerDao dao=new VMManagerDao();
				if (dao.addUsrUploadFile(serverFileName, uploadFileName[0], uid))
				{
					this.message=serverFileName;
				}
				else
				{
					this.message="no";
				}
			}
		}
		catch (Exception e) {
				e.printStackTrace();
				this.message="no";
		}
		
		System.out.println("3 msg : " + this.message);
		
		
		return SUCCESS;
	}
	

}
