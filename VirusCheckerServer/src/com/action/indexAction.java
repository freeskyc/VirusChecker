package com.action;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.bean.VMInfoBean;
import com.opensymphony.xwork2.Action;
import com.work.VMOSWork;
import com.Helper;

public class indexAction implements Action {

	@Override
	public String execute() throws Exception {
		// TODO Auto-generated method stub
		int uid = Helper.getUIDSession();
		int pid = Helper.getPermissionSession();
		
		System.out.println(uid);
		if (uid>0)
		{
			HttpServletRequest request = ServletActionContext.getRequest();
			request.setAttribute("permission", pid);
			System.out.println(uid+"l");
			
			//设置虚拟机状态 + 颜色
			request.setAttribute("vmstatus", Helper.vmstatusInfo);
			request.setAttribute("vmclinfo", Helper.vmscolorInfo);
			
			
			if (pid==1)
			{
				VMOSWork work=new VMOSWork();
				List oslink=work.getAllLinkOS();			
				request.setAttribute("oslink",oslink);
				
				//所有的sysinfo表的信息
				//元素是：com.bean.SysInfoBean
				List syslist=work.getAllVMSystemData();
				request.setAttribute("sysinfo", syslist);
				
				//os 和 vm 的link number 关系信息，systemid - number 这样子映射
				//元素是：com.bean.SidVMLinkNumberInfo
				List SidVMNumberInfoList=work.getShortUserVMInfo(uid);
				request.setAttribute("SidVMNumberInfoList", SidVMNumberInfoList);
				
				//设置下虚拟机的所有信息，当然status是单独设置的
				List<VMInfoBean> avmdata=(List<VMInfoBean>)work.getAllVMData();
				request.setAttribute("allvmdata",avmdata);
				int size=avmdata.size();
				for (int i=0;i<size;i++)
				{
					VMInfoBean item=avmdata.get(i);
					item.setRunstatusInfo(Helper.vmstatusInfo[item.getRunstatus()]);
				}
				
			}
			

			
			return SUCCESS;
		}
		else{
			return "notLogin";
		}
		
	}

}
