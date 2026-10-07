# Stage 1 BUILD
# Stage 2 copy build into nginx


FROM nginx:alpine

# move to the location inside the image where the nginx configuration is
WORKDIR /etc/nginx/conf.d
COPY nginx.conf default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# the folder inside the image that we specifiy in nginx.config
WORKDIR /webgl

# the folder with the build results
COPY . .

RUN hash=$(sha256sum quotes-data.js | cut -c1-12)  && mv quotes-data.js "quotes-data.$hash.js"  && sed -i "s#'quotes-data.js'#'quotes-data.$hash.js'#" script.js  && grep -q "quotes-data.$hash.js" script.js


