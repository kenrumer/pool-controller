#!/usr/bin/php
<?php

  define("AIR_TEMP_COMMAND", "0700");
  define("FLOW_TEMP_COMMAND", "0701");
  define("SOLAR_TEMP_COMMAND", "0702");

  define("FLOW_STATUS_COMMAND", "0102");
  define("PUMP_STATUS_COMMAND", "0209");
  define("HEAT_STATUS_COMMAND", "0303");
  define("CLEAN_STATUS_COMMAND", "0402");
  define("WATER_LIGHT_STATUS_COMMAND", "0504");
  define("YARD_LIGHT_STATUS_COMMAND", "0604");

  define("SOLAR_UPPER_THRESHOLD", 2);
  define("SOLAR_LOWER_THRESHOLD", 4);
  define("COLLECTOR_UPPER_THRESHOLD", 10);
  define("COLLECTOR_LOWER_THRESHOLD", 4);
  define("HEATER_UPPER_THRESHOLD", 2);
  define("HEATER_LOWER_THRESHOLD", 2);

  define("FILTER_MODE", true);
  define("FILTER_MAX_SOLAR_TEMP", 90);
  define("FILTER_PUMP_LOW_MODE", "0204");
  define("FILTER_PUMP_HIGH_MODE", "0206");
  define("FILTER_HEAT_OFF_MODE", "0300");
  define("FILTER_HEAT_ON_MODE", "0302");
  define("FILTER_START_TIME", "09:00:00");
  define("FILTER_END_TIME", "15:00:00");
  define("FILTER_FLOW_MODE", "0100");
  define("FILTER_CLEAN_MODE", "0400");
  define("FILTER_WATER_LIGHT_MODE", "0500");
  define("FILTER_YARD_LIGHT_MODE", "0600");

  define("SPA_MODE", false);
  define("SPA_MAX_HEATER_TEMP", 99);
  define("SPA_PUMP_LOW_MODE", "0204");
  define("SPA_PUMP_HIGH_MODE", "0206");
  define("SPA_HEAT_OFF_MODE", "0300");
  define("SPA_HEAT_ON_MODE", "0301");
  define("SPA_START_TIME", "00:00:00");
  define("SPA_END_TIME", "23:59:59");
  define("SPA_FLOW_MODE", "0101");
  define("SPA_CLEAN_MODE", "0400");
  define("SPA_WATER_LIGHT_MODE", "0502");
  define("SPA_YARD_LIGHT_MODE", "0602");

  define("CLEAN_MODE", false);
  define("CLEAN_PUMP_MODE", "08");
  define("CLEAN_START_TIME", "00:00:00");
  define("CLEAN_END_TIME", "23:59:59");
  define("CLEAN_FLOW_MODE", "00");
  define("CLEAN_HEAT_MODE", "00");
  define("CLEAN_CLEAN_MODE", "01");
  define("CLEAN_WATER_LIGHT_MODE", "00");
  define("CLEAN_YARD_LIGHT_MODE", "00");

  define("OFF_MODE", false);
  define("OFF_PUMP_MODE", "00");
  define("OFF_START_TIME", "00:00:00");
  define("OFF_END_TIME", "23:59:59");
  define("OFF_FLOW_MODE", "00");
  define("OFF_HEAT_MODE", "00");
  define("OFF_CLEAN_MODE", "00");
  define("OFF_WATER_LIGHT_MODE", "00");
  define("OFF_YARD_LIGHT_MODE", "00");

  require("SerialClient.php");
  require("Logger.php");

  $serial_client = new SerialClient();
  $logger = new Logger();

  //Get our temperatures
  $air_temp = $serial_client->send_command("##".AIR_TEMP_COMMAND."##");
  $logger->log("air", $air_temp);
  $water_temp = $serial_client->send_command("##0701##");
  $logger->log("water", $water_temp);
  $solar_temp = $serial_client->send_command("##0702##");
  $logger->log("solar", $solar_temp);

  if (FILTER_MODE) {
    //Are we in normal running time?
    echo ("start: ".strtotime(FILTER_START_TIME)." <= ".strtotime(date("G:i:s"))." <= ".strtotime(FILTER_END_TIME)."\n");
    if (strtotime(date("G:i:s")) >= strtotime(FILTER_START_TIME) && strtotime(date("G:i:s")) <= strtotime(FILTER_END_TIME)) {
      //Reset everything to normal
      echo("Reset everything to normal\n");
      $serial_client->send_command("##".FILTER_FLOW_MODE."##");
      $serial_client->send_command("##".FILTER_CLEAN_MODE."##");
      $serial_client->send_command("##".FILTER_WATER_LIGHT_MODE."##");
      $serial_client->send_command("##".FILTER_YARD_LIGHT_MODE."##");

      if ($water_temp > FILTER_MAX_SOLAR_TEMP + SOLAR_UPPER_THRESHOLD) {
        // We are hot enough
        $serial_client->send_command("##".FILTER_PUMP_LOW_MODE."##");
        $serial_client->send_command("##".FILTER_HEAT_OFF_MODE."##");
      } else if ($water_temp < FILTER_MAX_SOLAR_TEMP - SOLAR_LOWER_THRESHOLD) {
        // We are too cold
        echo("We are too cold\n");
        if ($solar_temp > $water_temp + COLLECTOR_UPPER_THRESHOLD) {
          // Solar will heat
          $serial_client->send_command("##".FILTER_PUMP_HIGH_MODE."##");
          $serial_client->send_command("##".FILTER_HEAT_ON_MODE."##");
        } else if ($solar_temp > $water_temp + COLLECTOR_LOWER_THRESHOLD) {
          // Solar will not heat
          $serial_client->send_command("##".FILTER_PUMP_LOW_MODE."##");
          $serial_client->send_command("##".FILTER_HEAT_OFF_MODE."##");
        }
      }
    }
  }

  // Print flow status
  $flow_status = $serial_client->send_command("##".FLOW_STATUS_COMMAND."##");
  $logger->log("flow", $flow_status);

  // Print pump status
  $pump_status = $serial_client->send_command("##".PUMP_STATUS_COMMAND."##");
  $logger->log("pump", $pump_status);

  // Print heat status
  $heat_status = $serial_client->send_command("##".HEAT_STATUS_COMMAND."##");
  $logger->log("heat", $heat_status);

  // Print clean status
  $clean_status = $serial_client->send_command("##".CLEAN_STATUS_COMMAND."##");
  $logger->log("clean", $clean_status);

  // Print water light status
  $water_light_status = $serial_client->send_command("##".WATER_LIGHT_STATUS_COMMAND."##");
  $logger->log("water_light", $water_light_status);

  // Print yard light status
  $yard_light_status = $serial_client->send_command("##".YARD_LIGHT_STATUS_COMMAND."##");
  $logger->log("yard_light", $yard_light_status);

?>
