#!/usr/bin/php
<?php
/* button_pressed.php
    Updates the running commands based on the button pressed
    arguments
    buttonPressed - the number or symbol the user has pressed
    held - true if the user has held the button
*/

  require("lib/Logger.php");

  $held = $argv[1];
  $buttonPressed = $argv[2];
  $logger = new Logger();

  $logger->log("button", $held."\n");
  switch ($buttonPressed) {
  case '1':
    $logger->log("button", "1\n");
    exec("./send_commands.php 010000 020000 030000 040000 050000 060000", $output)
    $logger->log("button", $output);
    break;
  case '2':
    exec("./send_commands.php 010001 020005 030001 040000 050002 060000", $output)
    $logger->log("button", "2\n");
    break;
  case '3':
    $logger->log("button", "3\n");
    break;
  case '4':
    $logger->log("button", "4\n");
    break;
  case '5':
    $logger->log("button", "5\n");
    break;
  case '6':
    $logger->log("button", "6\n");
    break;
  case '7':
    $logger->log("button", "7\n");
    break;
  case '8':
    $logger->log("button", "8\n");
    break;
  case '9':
    $logger->log("button", "9\n");
    break;
  case '*':
    $logger->log("button", "*\n");
    break;
  case '0':
    $logger->log("button", "0\n");
    break;
  case '#':
    $logger->log("button", "#\n");
    break;
  }

?>
