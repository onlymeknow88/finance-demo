FROM nginx:alpine

# Copy all demo files into nginx's default serve directory (run inside dashboard-html)
COPY . /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
