# build current code
node_modules/.bin/webpack -p --env.production --mode production &&
echo "WebPack completed successfully"
# ------