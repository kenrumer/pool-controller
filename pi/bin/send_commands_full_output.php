#!/usr/bin/php
<?php

  for ($i = 1; $i < count($argv); $i++) {
    $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);
    socket_connect($socket, '127.0.0.1', 10000);
    socket_write($socket, "@@".$argv[$i]."@@", 8);
    echo (socket_read($socket, 1024, PHP_NORMAL_READ));
    socket_close($socket);
  }

?>
