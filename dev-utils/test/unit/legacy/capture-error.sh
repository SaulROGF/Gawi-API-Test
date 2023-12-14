
#!/bin/bash
port=3000
log_data="este es un ejemplo de error mandado desde el device"
curl \
  -H "Content-Type: application/json" \
  --data "{\"log\":\"$log_data\"}" \
  http://localhost:$port/devs/log/
