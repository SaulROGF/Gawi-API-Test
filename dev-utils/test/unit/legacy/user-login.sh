#!/bin/bash
port=3001
email=gio.icc.uach@gmail.com
password=qwertyuiop

curl \
  -H "Content-Type: application/json" \
  --data "{\"email\":\"$email\", \"password\":\"$password\"}" \
  http://localhost:$port/auth/login/
