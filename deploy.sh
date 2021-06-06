docker build -t mikeaws1/multi-client:latest -t mikeaws1/multi-client:${SHA} -f ./client/Dockerfile ./client
docker build -t mikeaws1/multi-server:latest -t mikeaws1/multi-server:${SHA} -f ./server/Dockerfile ./server
docker build -t mikeaws1/multi-worker:latest -t mikeaws1/multi-worker:${SHA} -f ./worker/Dockerfile ./worker

docker push mikeaws1/multi-client:latest
docker push mikeaws1/multi-server:latest
docker push mikeaws1/multi-worker:latest

docker push mikeaws1/multi-client:${SHA}
docker push mikeaws1/multi-server:${SHA}
docker push mikeaws1/multi-worker:${SHA}

kubectl apply -f k8s
kubectl set image deployments/server-deployment server=mikeaws1/multi-server:${SHA}
kubectl set image deployments/client-deployment client=mikeaws1/multi-client:${SHA}
kubectl set image deployments/worker-deployment worker=mikeaws1/multi-worker:${SHA}