#!/usr/bin/env sh
###
 # @Descripttion: 
 # @version: 1.0.0
 # @Author: 朱海东
 # @Date: 2023-06-20 15:38:35
 # @LastEditTime: 2023-06-21 16:36:05
### 

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

git init
git add -A
git commit -m 'fix:修改了河流分级、完善命名bug'

# 直接部署到github,触发github action
git push 

cd -
