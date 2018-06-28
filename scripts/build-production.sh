# build current code
bash scripts/lint.sh &
node_modules/.bin/webpack -p &&
echo "WebPack completed successfully"
# ------