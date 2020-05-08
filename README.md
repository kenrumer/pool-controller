# pool-controller
Control pool equipment with raspberry pi and arduino

bin dir does the work

www controls the UI stuff

-----------------------------

Insert sdcard into writer or slot
Download the Raspberry Pi installer:
https://downloads.raspberrypi.org/imager/imager.exe
Install, then choose:
Raspbian, and your SD Card

Or:
On Windows requires 7zip

Download Rapbian with desktop and recommended software:
https://downloads.raspberrypi.org/raspbian_full_latest

Use 7zip to extract the image (img file)

Download Win32DiskImager:
https://sourceforge.net/projects/win32diskimager/
Run win32diskimager
Select the extracted file and choose Write

--------------------------

Insert sdcard into raspberry pi and start it up
You'll need the UI:

Set a new password in the setup program

Do the local stuff ( keyboard, language, etc... )

Setup WIFI

Choose next to update software, then restart.  Had to go back to run again, once. Then reboot and try again...

Launch Raspberry Pi Configuration from the Preferences menu
Navigate to the Interfaces tab
Select Enabled next to SSH
Click OK


--------------------------------

Get the IP address, and mac address:
ifconfig -a

You need this because we won't be using the desktop anymore.  You will need to add this mac address to your router as a static IP.  I cannot provide this documentation

--------------------------------
Need source code
git clone <repo_name>

Need to keep command server and UI running, install supervisor
sudo pip install supervisor

--------------------------------
Setup supervisor
sudo cp files/supervisord.conf > /etc/supervisord.conf

