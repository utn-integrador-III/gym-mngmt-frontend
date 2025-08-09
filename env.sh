#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.env = {
  REACT_APP_API_URL: "${REACT_APP_API_URL}"
};
EOF

#start nginx
exec "$@"

