#!/usr/bin/php
<?php

  require("SerialClient.php");

  $stdin = fopen('php://stdin', 'r');
  $serial_client = new SerialClient();
  while (1) {
    echo("Command to send: ");
    $line = trim(fgets(STDIN));
    if ($line == "close") {
      break;
    }
    echo ($serial_client->send_command("##".$line."##"));
  }
?>
