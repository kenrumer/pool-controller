#!/usr/bin/php
<?php

  require_once '/home/pi/www/vendor/autoload.php';

  $airTemp = 

  $crontab = json_decode(file_get_contents("/home/pi/crontab/crontab.json"), true);

  //var_dump($crontab);

  //echo $crontab->{'prime'}->{'minute'}[0] . "\n";
  foreach ($crontab as $key=>$val) {
    echo $key;
  }
  //echo $crontab['cleaner']['minute'][0] . "\n";

  // Works with predefined scheduling definitions
  $cron = Cron\CronExpression::factory('0 9 * * *');
  if ($cron->isDue()) {
    echo "Need to run\n";
  }
  echo $cron->getNextRunDate()->format('Y-m-d H:i:s') . "\n";
  echo $cron->getPreviousRunDate()->format('Y-m-d H:i:s') . "\n";

  // Works with complex expressions
  $cron = Cron\CronExpression::factory('3-59/15 2,6-12 */15 1 2-5');
  echo $cron->getNextRunDate()->format('Y-m-d H:i:s') . "\n";

  // Calculate a run date two iterations into the future
  $cron = Cron\CronExpression::factory('@daily');
  echo $cron->getNextRunDate(null, 2)->format('Y-m-d H:i:s') . "\n";

  // Calculate a run date relative to a specific time
  $cron = Cron\CronExpression::factory('@monthly');
  echo $cron->getNextRunDate('2010-01-12 00:00:00')->format('Y-m-d H:i:s') . "\n";
  
?>
