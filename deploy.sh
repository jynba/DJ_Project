#!/usr/bin/env sh
###
 # @Descripttion: 
 # @version: 1.0.0
 # @Author: 朱海东
 # @Date: 2023-06-20 15:38:35
 # @LastEditTime: 2023-07-11 08:44:43
### 

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

git init
git add -A

git commit -m '附近所有功能'



# 直接部署到github,触发github action
git push 

cd -
