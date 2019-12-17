#include <Ethernet.h>
#include <SPI.h>
#include <ArduinoHttpClient.h>

#include <Wire.h>
#include <Adafruit_PN532.h>

#define PN532_IRQ (2)
#define PN532_RESET (3)

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
char server[] = "www.cetmar.tk";


IPAddress ip(192, 168, 0, 177);
IPAddress myDns(192, 168, 0, 1);


EthernetClient client;


void setup()
{
  if (Ethernet.begin(mac) == 0) {

    Ethernet.begin(mac, ip, myDns);
  } else {

  }

  nfc.begin();
  nfc.setPassiveActivationRetries(0xFF);
  nfc.SAMConfig();
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);

}

void loop()
{
  boolean stat = false;
  digitalWrite(6, LOW);
  digitalWrite(7, LOW);
  uint8_t success;
  uint8_t uid[] = {0, 0, 0, 0, 0, 0, 0};
  uint8_t uidLength;

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);

  if (success)
  {
    uint8_t keya[6] = {0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF};

    success = nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, keya);
    if (success)
    {
      uint8_t data[16];

      success = nfc.mifareclassic_ReadDataBlock(4, data);

      if (success)
      {
        String uidString = "";

        for (int i = 0; i < sizeof(data); i++)
        {
          uidString = uidString + char(data[i]);
        }

        boolean stat = false;
        String contentType = "application/x-www-form-urlencoded";
        String postData = "?id=Arduino&token=";
        postData = postData + uidString; 

        if (client.connect(server, 80)) {

          client.println("GET /arduino" + postData + " HTTP/1.1");
          client.println("Host: www.cetmar.tk");
          client.println("Connection: close");
          client.println();

        }
        while (client.connected()) {
          while (client.available() > 0) {
            char c = client.read();

            if (c == '{') {
              stat = false;
            }

            else if (c == '}') {
              stat = true;
            }
          }
        }
        if (stat){
          digitalWrite(7, HIGH);
          delay(2000);
        }
        else {
          digitalWrite(6, HIGH);
          delay(2000);
        }

        client.stop();

      }
    }
  }








}
