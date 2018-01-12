|---------------------------------TRANSMISSION DATA----------------------------------------|
                   |------------------------PACKET DATA------------------------|
HEADER  DATA SIZE  # REC TYPE  |-------------PAYLOAD-------------|    TIMESTAMP    CHK  TERM
03      00 00 10   00 0c  22   48 45 4c 4c 4f                        48 57 2e a8   d9    40
03      00 00 17   00 13  14   30 37 35 37 32 30 34 38 31 32 37 39   48 57 2b 48   3c    40
                   |                                                           |
1 BYTE  3 BYTES    {  [C = 2 BYTES] [Y = 1 BYTE]  [D = n BYTES] [T = 4 BYTES]  } 1 BYTE 1 BYTE

**************
INFO
**************
HEADER:     0x03
TERMINATOR: 0x40
PAYLOAD:    refers to the bar code data.s
DATA SIZE:  the number of BYTES to be sent to the host {excludes header and terminator}.
CHECKSUM:   the number which adds to 0 when it is added to the sum of all fields 
{excludes header and terminator}.

C = RECORDS    [2 BYTE] {1 BYTE FOR LASER MODEL}
Y = TYPE       [1 BYTE]
D = BAR CODE   [N BYTE]
T = TIMESTAMP  [4 BYTE]
================================================================


**************
C
**************

The number of records in the current packet ?
This could be used when sending stored data on the next transmission or syncing data to host.

================================================================


**************
Y
**************
L model first [3 BITS] should be 0xx for normal mode.
C model first [2 BITS] should be 00  for normal mode.

Remaining [6 BITS] indicate symbology {5 BITS FOR CAMERA MODEL}.


350L Symbology    |     bit #     |++++|   350C Symbology   |     bit#
------------------------------------------------------------------------
EAN13                  0          |++++|    CODE32                 0                            
EAN8                   1          |++++|    TRIOPTIC               1
UPCA                   2          |++++|    KOREAPOST              2
UPCE                   3          |++++|    AUSPOST                3
CODE39                 4          |++++|    BRITISHPOST            4
ITF14                  5          |++++|    CANADAPOST             5
CODE128                6          |++++|    EAN8                   6
I2o5                   7          |++++|    UPC-E                  7 
CODABAR                8          |++++|    EAN128                 8
EAN128                 9          |++++|    JAPANPOST              9
CODE93                 10         |++++|    KIXPOST                10
CODE35                 11         |++++|    PLANETCODE             11
BOOKLANDEAN            12         |++++|    OCR                    12 
EAN13wADDON	           13         |++++|    POSTNET                13
EAN8wADDOn             14         |++++|    CHINAPOST              14
UPCAwADDON             15         |++++|    MICROPDF417            15
UPCEwADDON             16         |++++|    TLC39                  16
                                  |++++|    POSICODE               17
                                  |++++|    CODABAR                18
                                  |++++|    CODE39                 19
                                  |++++|    UPCA                   20
                                  |++++|    EAN13                  21
                                  |++++|    I2o5                   22
                                  |++++|    IATA                   23
                                  |++++|    MSI                    24
                                  |++++|    CODE11                 25
                                  |++++|    CODE93                 26 
                                  |++++|    CODE128                27
                                  |++++|    CODE49                 28
                                  |++++|    MATRIX2o5              29
                                  |++++|    PLESSEY                30
                                  |++++|    CODE16K                31
                                  |++++|    CODABLOCKF             32
                                  |++++|    PDF417                 33
                                  |++++|    QR/MICROQR             34
                                  |++++|    TELEPEN                35
                                  |++++|    VERICODE               36
                                  |++++|    DATAMATRIX             37
                                  |++++|    MAXICODE               38
                                  |++++|    EAN                    39
                                  |++++|    RSS                    40
                                  |++++|    AZTECCODE              41
                                  |++++|    NOREAD                 42
                                  |++++|    UNKNOWN                43 (keypad entry)
                                  |++++|
                                  |++++|
                                  |++++|
                                  |++++|
                                  |++++|
                                  |++++|
================================================================


**************
D
**************

This indicates the payload.  The size of the payload varies.
Therefore C may be able to reference the size of the payload.

There are 7 BYTES before the start of the payload {6 BYTES for laser model}.
================================================================


**************
T
**************
Timestamp has 6 subfields [4 BYTES]

[VALUE] Year | Months | Days | AM/PM | Hours | Min | Seconds
[BITS]   6   |    4   |  5   |   1   |  4    |  6  |    6

Where: 
	base year       = 2000 {0 indicates this year}
        hour range      = 0 - 11
        am / pm         = 0 / 1

First split the 4 BYTES into binary and partion the bits in the lengths
stated in the table above.

Finally convert the binary in decimal.  Add the decimal value to the
base year to get the current year.  A value of 0 indicates January.

HEX =>    48       57       2e     a8
BIN =>  010010    0001    01011    1    0010    101101    001000
DEC =>    18       1        11     1      2       45        8

RESULT => 2018 Jan 11 PM 3:45:08
===============================================================================