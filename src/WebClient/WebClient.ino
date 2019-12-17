#include <Ethernet.h>
#include <SPI.h>
#include <ArduinoHttpClient.h>
#include <MFRC522.h>

#include <Wire.h>
#include <Adafruit_PN532.h>

#define RST_PIN  9    //Pin 9 para el reset del RC522
#define SS_PIN  10   //Pin 10 para el SS (SDA) del RC522
MFRC522 mfrc522(SS_PIN, RST_PIN); //Creamos el objeto para el RC522
#define PN532_IRQ (2)
#define PN532_RESET (3)

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

byte mac[] = {  0x90, 0xA2, 0xDA, 0x0D, 0xF6, 0xFF };
byte ip[] = {  192, 168, 0, 100};

char serverAddress[] = "www.cetmar.tk";  // server address
int port = 80;

EthernetClient client;
HttpClient cliente = HttpClient(client, serverAddress, port);


void setup()
{
  Ethernet.begin(mac, ip);

  nfc.begin();
  nfc.setPassiveActivationRetries(0xFF);
  nfc.SAMConfig();
  pinMode(6, OUTPUT);
  pinMode(7, OUTPUT);
  Serial.begin(9600);

}

void loop()
{
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


        String contentType = "application/x-www-form-urlencoded";
        String postData = "?id=Arduino&token=";
        postData = postData + uidString;

        cliente.get("/arduino" +  postData);

        int statusCode = cliente.responseStatusCode();
        String response = cliente.responseBody();
        Serial.println(response);
        cliente.stop();

        if (response.equals("ok")) {
          digitalWrite(7, HIGH);
          delay(2000);
         
        }

        else if(response.equals("bad")) {
          digitalWrite(6, HIGH);
          delay(2000);
          
        }

      }
    }
  }








}
