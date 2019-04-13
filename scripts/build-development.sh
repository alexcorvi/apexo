# lint typescript
bash scripts/lint.sh &
# build app.js file and copy index.html
node_modules/.bin/webpack --mode development -w &
# build scss
./node_modules/.bin/node-sass ./src/styles/index.scss ./dist/application/style.css &
# watch scss
./node_modules/.bin/node-sass ./src/styles/index.scss ./dist/application/style.css -w