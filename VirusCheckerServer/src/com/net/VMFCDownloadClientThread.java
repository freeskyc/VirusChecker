package com.net;
import java.io.BufferedInputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.net.Socket;


public class VMFCDownloadClientThread extends Thread 
{
	private String ipadd;
	private int port;
	private String fileName;
	private String filePath;
	private int bufferSize=1024;
	private int userId;
	private int vmid;
	public  VMFCDownloadClientThread(String ipadd,int port,int userId,String fileName,String filePath,int vmid)
	{
		this.ipadd=ipadd;
		this.port=port;
		this.fileName=fileName;
		this.filePath=filePath;
		this.userId=userId;
		this.vmid=vmid;
	}
	@Override
	public void run() {
		try
		{
			File filein = new File(filePath);
			Socket socket = new Socket(ipadd, port);
			
			System.out.println("Send File Before");
			
			DataInputStream fis = new DataInputStream(new BufferedInputStream(
					new FileInputStream(filein)));

			DataOutputStream ps = new DataOutputStream(socket.getOutputStream());
			//ps.writeChars("downloadFile\n");
			ps.writeChar(VMNetCmd.fileDownload);
			ps.flush();
			
			ps.writeInt(this.userId);
			ps.flush();
			
			ps.writeInt(this.vmid);
			ps.flush();
			
			ps.writeUTF(fileName);
			ps.flush();
			//ps.writeLong((long) filein.length());
			//ps.flush();
			byte[] buf = new byte[bufferSize];

			while (true)
			{
				int read = 0;
				if (fis != null)
				{
					read = fis.read(buf);
				}

				if (read == -1)
				{
					break;
				}
				ps.write(buf, 0, read);
			}
			ps.flush();

			fis.close();
			ps.close();
			socket.close();
			
			System.out.println("Send File Finished");
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}

	}
	
}
