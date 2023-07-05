#!/usr/bin/env sh
###
 # @Descripttion: 
 # @version: 1.0.0
 # @Author: 朱海东
 # @Date: 2023-06-20 15:38:35
 # @LastEditTime: 2023-07-01 09:35:19
### 

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run build

git init
git add -A
git commit -m '完成了初步的搜索功能'


# 直接部署到github,触发github action
git push 

cd -
