# fullstack-budget-app
FullStack Budget App for bootcamp with CoreCodeIO
# Basic Budget Application
A basic budget javascript application using reacjs, express and Oracle Database.

## Get Started

``` powershell
# Build Images
docker build -t mybackend:0.1.0 backend/
docker build -t myfrontend:0.1.0-alpine frontend/

# Run Application
docker compose up
docker compose down
docker compose down -v
```

# Creating docker repositories
docker tag mybackend:0.1.0 alex0006/w3-backend:0.1.0
docker push alex0006/w3-backend:0.1.0

docker tag myfrontend:0.1.0-alpine alex0006/w3-frontend:0.1.0-alpine
docker push alex0006/w3-frontend:0.1.0-alpine