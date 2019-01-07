# Tao of Eastwood

by [Bret Morstad](http://www.bretstad.com)


## Develop:

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
and the served site will be available at
`localhost:8080` or e.g. `tao.hexxie.com:8080`.

You can also run individual commands:

```
# build the static site
yarn eleventy

# run the server
yarn serve

# compile sass
gulp sass

# lint sass
gulp sasslint

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
