FROM node:20
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
RUN npm rebuild bcrypt --build-from-source
# Install TypeScript globally
RUN npm install -g typescript

COPY . .
EXPOSE 8000
CMD ["npm", "start"]