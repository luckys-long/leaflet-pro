FROM nginx:1.22.1
LABEL maintainer="xiaopeng"
COPY ./dist /opt/front/dist
COPY ./nginx/nginx.conf /opt/front
COPY ./nginx/mime.types /opt/front
EXPOSE 80
CMD ["nginx", "-c","/opt/front/nginx.conf","-g","daemon off;"]
#docker build -t mixed-scheduling-test-front:v1 -f Dockerfile .
#docker run -itd -p 8981:80 --name mixed-scheduling-test-front mixed-scheduling-test-front:v1