#!/bin/bash
port=3000

idOrganization=1
idTown=1
idRole=7
firstName="giovanny alfonso"
lastName="chavez"
mothersLastName="ceniceros"
phone=6141106401
email="a310831@uach.mx"
password="4dm1n"
active=1

curl \
  -H "Content-Type: application/json" \
  --data "{
    \"idOrganization\":\"$idOrganization\",
    \"idTown\":\"$idTown\",
    \"idRole\":\"$idRole\",
    \"firstName\":\"$firstName\",
    \"lastName\":\"$lastName\",
    \"mothersLastName\":\"$mothersLastName\",
    \"phone\":\"$phone\",
    \"email\":\"$email\",
    \"password\":\"$password\",
    \"active\":\"$active\",
  }" \
  http://localhost:$port/public/create-client/
