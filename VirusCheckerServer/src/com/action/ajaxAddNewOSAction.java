package com.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.Helper;
import com.bean.SysInfoBean;
import com.opensymphony.xwork2.ActionSupport;
import com.work.VMOSWork;

public class ajaxAddNewOSAction extends ActionSupport {

	private String message;
	private String nOsVersion;
	private String nOsName;
	private File[] upload;// 文件上传时文件映射
	private String[] uploadContentType;// 文件上传时文件的扩展名映射
	private String[] uploadFileName;// 文件上传时文件名映射
	private final static String DOWNLOADFILEPATH = "/img/osinfo/";// 文件上传的相对基本路径名
	
	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
	
	public String getnOsVersion() {
		return nOsVersion;
	}

	public void setnOsVersion(String nOsVersion) {
		this.nOsVersion = nOsVersion;
	}

	public String getnOsName() {
		return nOsName;
	}

	public void setnOsName(String nOsName) {
		this.nOsName = nOsName;
	}

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
	
	@SuppressWarnings("deprecation")
	private String getSavePath() throws Exception {
		return ServletActionContext.getRequest().getRealPath(DOWNLOADFILEPATH);
		/*
		 * 
		 * 在servlet里用this.getServletContect().getRealPath()
			在struts里用this.getServlet().getServletContext().getRealPath()
			在Action里用ServletActionContext.getRequest().getRealPath();
		 */
	}

	
	@Override
	public String execute() throws Exception {
		
		//判断是不是正常用户，不是就跳走
		int uid = Helper.getUIDSession();
		if (uid <= 0) {
			this.message = "0";
			return SUCCESS;
		}
		
		this.message = "0";
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		
		try {
				/*
				 *         上传文件
				 */
				// 获得上传的文件
				File[] files = this.getUpload();
				if (files == null) { //文件为空的处理
					request.setAttribute("message", this.message);
					this.message = "0";
					return SUCCESS;
				}
				List fname = new ArrayList();
				String filePath = "";
				String filetempName = null;
				String fileName = "";
				SimpleDateFormat sdff = new SimpleDateFormat("yyyyMMddHHmmss");
				int ll = files.length;
				String saveFileName;
				String savePath = getSavePath();
				filetempName = uploadFileName[0];
				
				System.out.println("上传文件夹: "+savePath);
				System.out.println(request.getContextPath());
				//上传文件夹: /home/ouyang/WorkSpace/.metadata/.me_tcat/webapps/VirusCheckerServer/img/osinfo
				// /root/Workspaces/MyEclipse 10/.metadata/.me_tcat/webapps/VirusCheckerServer/img/osinfo
				
				//判断上传文件夹是否存在，不存在就创建一个
				//记住是mkdirs，而不是mkdir
				  File file = new File(savePath);
				  if (!file.exists()) {
				   file.mkdirs();
				  }
				  
				System.out.println("filetempName: "+filetempName);
				
				fileName = filetempName;
				saveFileName=filetempName.substring(0,filetempName.lastIndexOf("."));
				filePath += fileName + ",";
				fname.add(fileName);
		
				// 以服务器的文件保存地址和原文件名建立上传文件输出流
				FileOutputStream fos = new FileOutputStream(savePath + "/"+ fileName);
				FileInputStream fis = new FileInputStream(files[0]);
				byte[] buffer = new byte[1024];
				int len = 0;
				while ((len = fis.read(buffer)) > 0) {
					fos.write(buffer, 0, len);
				}
				fis.close();
				fos.close();
					
				filetempName = uploadFileName[1];
				fileName = filetempName.substring(0,filetempName.lastIndexOf("."))+"_close"
						+ filetempName.substring(filetempName.lastIndexOf("."));
				
				fos = new FileOutputStream(savePath + "/"
						+  fileName);
				fis = new FileInputStream(files[1]);
				while ((len = fis.read(buffer)) > 0) {
					fos.write(buffer, 0, len);
				}
				fis.close();
				fos.close();
				
				/*
				 *  写入数据库
				 */
				VMOSWork work=new VMOSWork();
				nOsName=request.getParameter("nOsName");
				nOsVersion=request.getParameter("nOsVersion");
				long nsysid=work.addNewOS(new SysInfoBean(0,nOsName,nOsVersion,saveFileName));
				
				if (nsysid>0)
				{
					this.message=nsysid+"!"+nOsName+"!"+nOsVersion+"!"+saveFileName;
				}	
				else
				{
					this.message = "0";
				}
		}catch (Exception e) {
			e.printStackTrace();
			this.message = "0";
		}
		
		System.out.println("message: " + this.message);
		
		return SUCCESS;
		
	}
}
