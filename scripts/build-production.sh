# build current code
bash scripts/lint.sh &
node_modules/.bin/webpack &&
# ------


# build electron desktop applications
cd dist/electron/ &&
yarn run dist &&
# ------


# compress phonegap
cd ../
rm -f ./phonegap.zip &&
zip -r phonegap.zip phonegap
# ------