<?php

  class Logger {

    private $log_path = "/home/pi/logs/";
    private $log_extension = ".log";

    function log($log_file, $output) {
      $file = fopen($this->log_path.$log_file.$this->log_extension, 'a');
      fwrite($file, date("YmdHis") . "|" . $output);
      fclose($file);
    }

  }

?>
