#!/bin/bash
port=3002
A=34303045  # (A) Número de serie (LONGITUD POR DEFINIR)
url=http://localhost:$port/devs/gd-mark/A=$A

http $url 