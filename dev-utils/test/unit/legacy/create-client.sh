#!/bin/bash
curl -H "Content-Type: application/json" \
--data '{ "idRole": "7", "idTown": "1", "idOrganization": "1", "email": "a310831@uach.mx", "password": "qwertyuiop", "firstName": "giovanny alfonso", "lastName": "chavez", "mothersLastName": "ceniceros", "phone": "6141909999", "passwordGoogle": null, "passwordFacebook": null, "idConektaAccount": null, "active": "1", "deleted": "1", "lastLoginDate": "1" }' \
http://localhost:3000/public/create-client
