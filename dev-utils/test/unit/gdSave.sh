#!/bin/bash
port=3002
url=http://localhost:$port/devs/gd-save/
A=2021-01-27      # (A) Fecha (dd/mm/aaaa)
B=11:00           # (B) Hora (hr:mm)
C=864475044160108 # (C) IMEI (15 dígitos)
D=45303134        # (D) Número de serie (LONGITUD POR DEFINIR)
E=10              # (E) % Medición (3-5 caracteres)
F=25              # (F) % Consumo promedio por hora (hasta 5 caracteres)
G=60              # (G) Temperatura (Hasta 1-3 caracteres)
H=000             # (H) Alarmas (LONGITUD POR DEFINIR)
I=99              # (I) % Batería (Hasta 1-3 caracteres
J=25              # (J) temperatura
K=31              # (K) calidad de señal

http post $url \
A=$A \
B=$B \
C=$C \
D=$D \
E=$E \
F=$F \
G=$G \
H=$H \
I=$I \
J=$J \
K=$K
