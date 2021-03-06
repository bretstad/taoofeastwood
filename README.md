# The Tao of Eastwood

by [Bret Morstad](http://www.bretstad.com)


## Develop:

Make sure you are on the proper version of node with
[node version manager](https://github.com/nvm-sh/nvm#installing-and-updating):

```
nvm i 10
nvm use 10
```

Install dependencies:

```
yarn
```

Compile and run [Eleventy](http://www.11ty.io) server,
with a watcher for Sass files:

```
gulp
```

The site will be compiled into `docs/`
for simple gh-pages deployment,
and the served site will be available at `localhost:8080`.

You can also run individual commands:

```
# build the static site
gulp build

# run the server
gulp serve

# minify images
gulp imagemin

# compile sass
gulp sass

# lint sass
gulp sasslint

# format sass
gulp prettier

# compile sass docs
gulp sassdoc

# watch sass files (lint & docs & compile)
gulp watch
```

Sass Docs are compiled into the `docs/design/` folder,
which is then available at the URL: `/design/`.

## Deploy:

The live site is deployed via Github Pages
directly from the master-branch `docs/` folder.

Compile changes, commit the results, and push to master.
