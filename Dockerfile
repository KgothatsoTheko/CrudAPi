# Node version and linux distribution
FROM node:18-alpine
# install nodemon gobal
RUN npm install -g nodemon
# making a work directory
WORKDIR /app
# used for layer Caching
COPY package.json .
# Install dependencies
RUN npm install
# copy everything in this root folder( . . )-needed
COPY . .
# Expose the port to be access anywhere outside container
EXPOSE 4022
# commands to run to start the app
CMD ["npm", "run", "dev"]