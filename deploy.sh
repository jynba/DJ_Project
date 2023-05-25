#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

git init
git add -A
git commit -m 'deploy'

# 直接部署到github,触发github action
git push git@github.com:jynba/DJ_Project.git main

cd -
