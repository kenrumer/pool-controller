#!/bin/bash

/home/pi/bin/send_commands.php 010001
sleep 2
/home/pi/bin/send_commands.php 030001
sleep 2
/home/pi/bin/send_commands.php 050003
sleep 2
touch spa_run
