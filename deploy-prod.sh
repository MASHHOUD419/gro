echo 'Deployment started'
echo 'Removing old app'
DEPLOY_PATH='/var/www/groapp.com/back-end'
BITBUCKET_BRANCH='master'
rm -rf $DEPLOY_PATH
git clone git@backendrepo:gro-technologies/back-end.git $DEPLOY_PATH
cd $DEPLOY_PATH
git checkout $BITBUCKET_BRANCH

echo 'Building new app'
npm ci
npm run build

echo 'Installing new app'
cp .env dist/src/.env
pm2 stop 0

cd dist/src
pm2 start main.js

echo 'Deployment Complete'