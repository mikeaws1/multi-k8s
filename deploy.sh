#!/bin/sh
echo ${DIGITAL_OCEAN_DROPLET_IP}
ssh -o StrictHostKeyChecking=no travis@${DIGITAL_OCEAN_DROPLET_IP} << ENDSSH
  touch droplettest
  echo "Test sucessful" > droplettest
  echo $1 >> droplettest
  echo $1 | docker login --username mikeaws1 --password-stdin
  echo "Stopping all"
  docker stop $(docker ps -a -q)
  echo "Starting up container"
  docker-compose up --build -d
ENDSSH