package com.action;

import java.io.File;

import org.apache.struts2.ServletActionContext;

import com.Helper;
import com.opensymphony.xwork2.ActionSupport;
import com.work.VMOSWork;

public class ajaxDeleteOSAction extends ActionSupport 
{
	private int sysid;
	private String message;

	public int getSysid() {
		return sysid;
	}
	public void setSysid(int sysid) {
		this.sysid = sysid;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	@Override
	public String execute() throws Exception {
		this.message="0";
		int uid=Helper.getUIDSession();
		if (uid>0)
		{
			int pid=Helper.getPermissionSession();
			if (pid==1)
			{
				VMOSWork work=new VMOSWork();
				String imgurl=work.getOSImgUrlByOSId(sysid);
				
				//删除对应的图片
				if (imgurl!=null)
				{
					String path=ServletActionContext.getRequest().getRealPath("/img/osinfo/");
					File file=new File(path+imgurl+".png");
					if (file.exists() && file.isFile())
					{
						file.delete();
					}
					
					file=new File((path+imgurl+"_close.png"));
					if (file.exists() && file.isFile())
					{
						file.delete();
					}
				}
				
				//数据库中删除，message等于1表示成功，等于2表示虚拟机用到了系统，无法删除
				this.message=work.deleteOSByOSId(sysid)+"";
			}
		}
		
		return SUCCESS;
	}
	

}
