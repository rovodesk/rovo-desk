FROM public.ecr.aws/lambda/nodejs:22

# Copy files
COPY package.json ./
RUN npm install

COPY src/index.js ./

# Set handler
CMD ["index.handler"]