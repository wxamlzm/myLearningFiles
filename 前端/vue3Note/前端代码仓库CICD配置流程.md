1. 拉取脚手架
2. 代码改造
  - 修改docker文件夹中的/bin/docker-entrypoint.sh,文件中export Base= XXX( XXX 为当前代码仓库名称)
  - 修改config文件夹中mainifests/deployment.yaml,文件中name=XXX app=XXX namespace=YYY (XXX为当前代码仓库名称、YYY为dip)
  - a. 如果走默认流程（拉取依赖==>打包==>镜像处理==>部署流程）,则.gitlab-ci.yml文件不做任何变更，默认使用线上配置
  - .gitlab-ci.yml
  - b. 如果因内网镜像源等原因需要走本地打包在部署流程，则需要修改.gitlab-ci.yml文件具体如下
    - 注释stages步骤中-install -package步骤
    - 注释install-job步骤
    - 注释package-job
    - 注释掉build-job中的dependencies:-package-job
  - .gitlab-ci.yml
3. 开发完成后，将代码上传，同时根据CICD流程不同，.gitignore中武略文件配置也需要改动
  - 如果走线上默认流程，则 需要在忽略文件中将dist文件夹设置为忽略掉
  - 如果走手动打包自动部署，则需要在武略文件中将dist文件夹移除或注释掉，将dist文件夹随代码一起上传