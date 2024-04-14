# download exist image with linux and node
FROM node:latest

# copy project into new folder in image
COPY package.json /app/
COPY src /app/

# go to this folder 
WORKDIR /app

# install dependecies from package.json - RUN execute linux commands 
RUN npm install

# run app using node 
CMD ["node", "server.js"]
