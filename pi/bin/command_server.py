#!/usr/bin/python

import socket
import serial
import sys
import time
import re
import os
import random
import datetime
from threading import Thread, Lock

MSG_LENGTH = 14
LOG_FILE = "/home/pi/logs/command_server_error.log"

ser = serial.Serial('/dev/ttyACM0', 9600, timeout=2)

def logger(string):
  log_file = open(LOG_FILE, 'a')
  log_file.write(datetime.datetime.now().strftime("%c")+" : "+string+"\n")
  log_file.close()

def clearSerial():
  deletedControl = ""
  control = ser.read(1)
  totalCleared = 0
  while len(control) == 1:
    deletedControl = deletedControl + control
    totalCleared = totalCleared + 1
    control = ser.read(1)
  if totalCleared > 0:
    logger("*** clearSerial: Removed from buffer: " + deletedControl)
  return totalCleared

def isControlValid(control):
  if len(control) != MSG_LENGTH:
    return False
  if control[0] != '<' or control[13] != '>':
    logger("*** isControlValid[1]: Control format invalid " + control + " <[0]:" + control[0] + ">[13]:" + control[13])
    return False
  if control[1] != '@' and control[1] != '*' and control[1] != '#' and control[1] != '&':
    logger("*** isControlValid[2]: Control format invalid " + control)
    return False
  if control[1] != control[12]:
    logger("*** isControlValid[3]: Control format invalid " + control)
    return False
  return True

def serialWrite(message):
  ser.write(message)
  response = ser.read(MSG_LENGTH)
  if (not isControlValid(response)):
    logger("**** serialWrite: Failed to get valid a response for: "+message)
    return "-1"
  return response

def buttonCommand(command):
  response = serialWrite(command)

def serialWatch(lock):
  while 1:
    lock.acquire()
    control = ser.read(MSG_LENGTH)
    if isControlValid(control):
      m = re.search('<&(.*)&>', control)
      if m != None:
        controlString = m.group(1)
        controlId = controlString[0:4]
        controlType = controlString[4:6]
        buttonAction = controlString[6:8]
        button = controlString[8:10]
        if controlType == "11":
          if buttonAction == "01":
            if button == "01":
              logger("button 1 pressed")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"010000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"020005@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"030000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"040000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"050000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"060000@>")
            if button == "02":
              logger("button 2 pressed")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"010000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"020005@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"030002@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"040000@>")
            if button == "03":
              logger("button 3 pressed")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"010001@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"030001@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"050002@>")
            if button == "04":
              logger("button 4 pressed")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"040098@>")
            if button == "05":
              logger("button 5 pressed")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"050098@>")
            if button == "06":
              logger("button 6 pressed")
            if button == "07":
              logger("button 7 pressed")
            if button == "08":
              logger("button 8 pressed")
            if button == "09":
              logger("button 9 pressed")
            if button == "10":
              logger("button 10 pressed")
            if button == "11":
              logger("button 11 pressed")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"010000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"020000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"030000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"040000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"050000@>")
              buttonCommand("<@"+str(random.randint(1, 9999)).zfill(4)+"060000@>")
    lock.release()
    time.sleep(1)

def socketWatch(clientsocket, clientaddress, lock):
  lock.acquire()
  control = clientsocket.recv(MSG_LENGTH)
  logger("SocketIn: "+control)
  if not isControlValid(control):
    logger("**** socketWatch: SocketIn is an invalid control: "+control)
    clientsocket.send("-1\n")
  else:
    response = serialWrite(control)
    clientsocket.send(response+"\n")
  clientsocket.close()
  lock.release()

serverSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

PORT = 10000
HOST = '0.0.0.0'

serverSocket.bind((HOST, PORT))
serverSocket.listen(10)
logger("Started server on " + HOST + ":" + str(PORT))

lock = Lock()

serialThread = Thread(target=serialWatch, args=(lock,))
serialThread.start()

while 1:
  try:
    (clientSocket, address) = serverSocket.accept()
  except:
    serialThread.join()
    break
  socketThread = Thread(target=socketWatch, args=(clientSocket, address, lock,))
  socketThread.start()

