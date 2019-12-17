#include <Wire.h>
#include <SPI.h>
#include <Adafruit_PN532.h>

#define PN532_IRQ   (2)
#define PN532_RESET (3)

Adafruit_PN532 nfc(PN532_IRQ, PN532_RESET);

void setup(void)
{
  Serial.begin(115200);

  // Configurar para leer etiquetas RFID
  nfc.begin();
  nfc.setPassiveActivationRetries(0xFF);
  nfc.SAMConfig();

  Serial.println("Esperando tarjeta");
}

void loop(void)
{
  uint8_t success;
  uint8_t uid[] = { 0, 0, 0, 0, 0, 0, 0 };
  uint8_t uidLength;

  success = nfc.readPassiveTargetID(PN532_MIFARE_ISO14443A, uid, &uidLength);
  if (success) {
    Serial.println("Intentando autentificar bloque 4 con clave KEYA");
    uint8_t keya[6] = { 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF };

    success = nfc.mifareclassic_AuthenticateBlock(uid, uidLength, 4, 0, keya);
    if (success)
    {
      String inputID = " ";
      Serial.print("Escriba el ID");
      while (inputID == " ")
      {
        if (Serial.available() > 0) {
          // read the incoming byte:
          inputID = Serial.readString();


        }
      }

      Serial.println("Sector 1 (Bloques 4 a 7) autentificados");
      
    
      uint8_t data[16]; 
      inputID.toCharArray(data,17);
      
      success = nfc.mifareclassic_WriteDataBlock (4, data);

      if (success)
      {
        Serial.println("Datos escritos en bloque 4");
        delay(10000);
      }
      else
      {
        Serial.println("Fallo al escribir tarjeta");
        delay(1000);
      }
    }
    else
    {
      Serial.println("Fallo autentificar tarjeta");
      delay(1000);
    }
  }
}
