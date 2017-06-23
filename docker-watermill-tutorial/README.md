# Dockerfile for bionode-watermill-tutorial

This is a dockerfile for using with bionode-watermill-tutorial. Here you will
 have all the dependencies installed and you can run the example 'two-mappers' 
 within this docker container, as well as the bionode-watermill-tutorial.

## Try this docker in play-with-docker

**Click here :**
   
[![Try in PWD](https://cdn.rawgit.com/play-with-docker/stacks/cff22438/assets/images/button.png)](http://labs.play-with-docker.com/)

Within play-with-docker webpage click on `create session`. Then, another page
 will open with a big counter on the upper left corner. Click on `+ add new 
 instance` and this should generate a terminal like instance on the right. On
  this terminal you can load this docker image as follows:

1) `docker pull tiagofilipe12/bionode-watermill-tutorial`
2) `docker run -it tiagofilipe12/bionode-watermill-tutorial zsh`

After, follow the instructions [below](#running-an-example).
 
## Build this docker on your local machine

#### Using Git Hub

1) `git clone https://github.com/tiagofilipe12/docker-watermill-tutorial.git`
2) `docker build . bionode-watermill`

or

#### Using Docker Hub

1') `docker pull tiagofilipe12/bionode-watermill-tutorial`

## Running the docker container

#### From Git Hub clone
3) `docker run -it bionode-watermill zsh`

or

#### From Docker Hub pull

2')`docker run -it tiagofilipe12/bionode-watermill-tutorial zsh`

## Running an example
* `cd examples/pipelines/two-mappers`
* `node pipeline.js`

or
* `node pipeline_lazy.js` (this one is still not ready!)