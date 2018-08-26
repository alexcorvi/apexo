# build mac app
nativefier --name "apexo" --platform osx --conceal --icon icon-final.png --min-width 450px --min-height 600px --disable-dev-tools "https://web.apexo.app" ./dist/desktop-builds/

# build mac installer
create-dmg ./dist/desktop-builds/apexo-darwin-x64/apexo.app ./dist/desktop-builds/ --overwrite
rm -rf ./dist/desktop-builds/apexo.dmg
mv ./dist/desktop-builds/apexo\ 1.0.0.dmg ./dist/desktop-builds/apexo.dmg

# build windows app
nativefier --name "apexo" --platform windows --icon icon-final.ico --min-width 450px --min-height 600px --disable-dev-tools "https://web.apexo.app" ./dist/desktop-builds/

# build windows zip file
rm -rf ./dist/desktop-builds/apexo.zip
zip -r ./dist/desktop-builds/apexo.zip ./dist/desktop-builds/apexo-win32-x64/
