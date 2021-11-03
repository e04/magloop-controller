#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266WebServer.h>
#include <ESP8266mDNS.h>
#include <Arduino.h>
#include "A4988.h"
#include <EEPROM.h>
#include "secret.h"

#define MOTOR_STEPS 200
#define RPM 200

#define MOTOR_ACCEL 200
#define MOTOR_DECEL 100

#define DIR 5
#define STEP 4
#define MS1 13
#define MS2 12
#define MS3 14
#define SLEEP 15

#define MAX_MOVE_LENGTH 3100
#define MIN_MOVE_LENGTH -3100

const char *ssid = STASSID;
const char *password = STAPSK;

A4988 stepper(MOTOR_STEPS, DIR, STEP, SLEEP, MS1, MS2, MS3);

ESP8266WebServer server(80);

void handleRoot()
{
    digitalWrite(LED_BUILTIN, 1);

    String command = server.argName(0);

    server.sendHeader("Access-Control-Allow-Origin", "*");

    if (command == "position")
    {
        int position;
        EEPROM.get<int>(0, position);

        server.send(200, "application/json", "{\"position\":" + String(position) + " }");
    }

    if (command == "moveTo")
    {
        int to = constrain(server.arg(0).toInt(), MIN_MOVE_LENGTH, MAX_MOVE_LENGTH);

        int position;
        EEPROM.get<int>(0, position);

        EEPROM.put<int>(0, to);
        int length = to - position;

        stepper.disable();
        stepper.move(length);
        stepper.enable();
        server.send(200, "application/json", "{\"position\":" + String(to) + " }");
    }

    if (command == "move")
    {
        int length = constrain(server.arg(0).toInt(), MIN_MOVE_LENGTH, MAX_MOVE_LENGTH);

        int position;
        EEPROM.get<int>(0, position);
        position = constrain(position + length, 0, MAX_MOVE_LENGTH);
        EEPROM.put<int>(0, position);

        stepper.disable();
        stepper.move(length);
        stepper.enable();
        server.send(200, "application/json", "{\"position\":" + String(position) + " }");
    }

    if (command == "reset")
    {
        int position = 0;
        EEPROM.put<int>(0, position);

        stepper.disable();
        stepper.move(MIN_MOVE_LENGTH);
        stepper.enable();
        server.send(200, "application/json", "{\"position\":" + String(position) + " }");
    }

    server.send(200, "application/json", "{\"status\":\"invalid_operation\" }");
    EEPROM.commit();
    digitalWrite(LED_BUILTIN, 0);
}

void handleNotFound()
{
    digitalWrite(LED_BUILTIN, 1);
    server.send(404, "application/json", "{\"status\":\"invalid_path\"}");
    digitalWrite(LED_BUILTIN, 0);
}

void setup(void)
{
    EEPROM.begin(2);

    stepper.begin(RPM);
    stepper.enable();

    pinMode(LED_BUILTIN, OUTPUT);
    digitalWrite(LED_BUILTIN, 0);

    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
    }

    MDNS.begin("esp8266");

    server.on("/", handleRoot);
    server.onNotFound(handleNotFound);
    server.begin();
}

void loop(void)
{
    server.handleClient();
    MDNS.update();
}
