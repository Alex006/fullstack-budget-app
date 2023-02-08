# Frontend
A frontend application using reactjs.

## Get Started

```
# Setting env vars in Windows
set REACT_APP_BACKEND_BASE_URL=http://localhost:3800

npm install
npm start
```

## Get Started Docker

``` powershell
# Build Image
docker build -t myfrontend:0.1.0-alpine .

# Run Container
docker run -d -p 8888:80 myfrontend:0.1.0-alpine
```