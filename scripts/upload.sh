# upload web application
cd dist/application &&
git add . &&
git commit -m "deploy" &&
git push origin master 

# upload demo application
cd ../
cp -R ./application/ ./demo/
echo demo.apexo.app > ./demo/CNAME
surge demo
rm -rf demo