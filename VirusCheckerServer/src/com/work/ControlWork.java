package com.work;

import java.io.File;
import java.io.IOException;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

import com.DBHelper;
import com.Helper;
import com.bean.VMRunStatus;
import com.dao.VMManagerDao;
import com.net.VMFCDownloadClientThread;

public class ControlWork {

	public void startMonitor(String[] vmids, int userId, String fileName,
			String filePath) {
		try {
			VMManagerDao dao = new VMManagerDao();
			List<VMRunStatus> list = new ArrayList<VMRunStatus>();
			int l = vmids.length;
			Connection conn = DBHelper.getConnection();
			for (int i = 0; i < l; i++) {
				list.add(dao.getVMRunStatus(Integer.parseInt(vmids[i]), conn));
			}
			conn.close();

			sendDownloadCmdToVMCollection(list, userId, fileName, filePath);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	private void sendDownloadCmdToVMCollection(List<VMRunStatus> list,
			int userId, String fileName, String filePath) {
		int l = list.size();
		for (int i = 0; i < l; i++) {
			VMRunStatus item = list.get(i);
			VMFCDownloadClientThread thread = new VMFCDownloadClientThread(
					item.getIpadd(), item.getPort(), userId, fileName,
					filePath, item.getVmid());
			thread.start();
		}

		// extist hidden errors;
	}

	public void clearFCMonitorContent(String rpath, String[] vmids) {
		int l = vmids.length;
		for (int i = 0; i < l; i++) {
			//临时文件删除
			File file = new File(rpath + vmids[i] + ".txt");
			if (file.exists() && file.isFile()) {
				file.delete();
			}
		}
	}

	public int[] checkFCMonitorOver(String[] vmids, String basePath) {
		int l = vmids.length;
		int[] status = new int[l];
		// System.out.println("Monitor-again base path="+basePath);
		for (int i = 0; i < l; i++) {
			status[i] = checkFCMonitorFileExist(basePath + Helper.fcrpfileName
					+ vmids[i] + ".txt");
		}
		return status;
	}

	private int checkFCMonitorFileExist(String filename) {
		File file = new File(filename);
		if (file.exists() && file.isFile()) {
			return 1;
		} else {
			return 0;
		}
	}

	public int startVMById(int vmid) {
		String cmd = "xm start vm-"+vmid;
		return this.waitForStatusOver(vmid, new int[] { 0, 1 }, cmd,
				Helper.lastWaitTime);
	}

	public int shutdownVMById(int vmid) {
		String cmd = "xm shutdown vm-"+vmid;
		return this.waitForStatusOver(vmid, new int[] { 2 }, cmd,
				Helper.lastWaitTime);
	}
	

	public int restartVMById(int vmid) {
		//即使已经关机，也不出错
		//得先关机才能操作
		String cmd = "xm shutdown vm-"+vmid;
		 this.waitForStatusOver(vmid, new int[] { 2 }, cmd,
				Helper.lastWaitTime));
				
				
		cmd = "xm restore  "+Helper.restoreFilePath + vmid;
		return this.waitForStatusOver(vmid, new int[] { 0, 1 }, cmd,
				Helper.lastWaitTime);
		
	}

	
	private int waitForStatusOver(int vmid, int[] status, String cmd,
			int maxTime) {
		doControlCmd(cmd);
		
		int result = 3;//一个无关紧要的状态 ,0,1 是运行和挂起,2是崩溃，4是暂停
		int length = status.length;
		boolean flag = false;
		
		while(maxTime > 0 ){ //一共运行maxTime/1000 s
			int nowStatus = Helper.getRunStatusFormCmd(vmid);
			for(int i=0;i<length;i++){ //比如开机传入0,1，nowstatus匹配任何一个状态，就是成功
				if(nowStatus == status[i]){
					flag = true;
					result = nowStatus;
					break;
				}
			}
			
			if(flag){
				break;
			}
			
			try {
				Thread.sleep(Helper.sleepTime);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				break;
			}
			
			maxTime -= Helper.sleepTime;
			
		}
		
		return result;
	}
	
	/*
	 * 调用shell 去 执行命令
	 */
	private void doControlCmd(String cmd) {
			Process p;
			try {
				p = Runtime.getRuntime().exec(cmd);
				try {
					p.waitFor();
				} catch (InterruptedException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	}



	
}
