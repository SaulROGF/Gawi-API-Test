IMEI=864475044147790 # 864475044092616
SERIAL_NUMBER=21080901 # 12345678
curl -i -H "Content-Type: application/json" -X GET http://localhost:3000/devices/login/$IMEI/$SERIAL_NUMBER

# TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJpYWxOdW1iZXIiOiIxMjM0NTY3OCIsImlhdCI6MTYyODAyMDU1MiwiZXhwIjoxNjkxMDkyNTUyfQ.Qb46-QwVkgtkchQIPcU2R7fnUK2AjOQ1Da6uJg7krHw"
# curl -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}" \
# --data '{}' \
# http://localhost:3000/devices/water-device-storage/0/0/20/31/100/0/0/1/0/0


# TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXJpYWxOdW1iZXIiOiIxMjM0NTY3OCIsImlhdCI6MTYyODAyNjc0MSwiZXhwIjoxNjkxMDk4NzQxfQ.PIjVUgIikmw6V5mM3aRu6-SO35mbvHzv3-piAs_30L4"
# curl -H "Content-Type: application/json" -H "Authorization: Bearer ${TOKEN}" \
# --data '{}' \
# http://localhost:3000/devices/water-device-storage/0/0/20/31/100/0/0/1/0/0/0
