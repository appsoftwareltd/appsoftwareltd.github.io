# appsoftwareltd.github.io

Static site for GitHub pages. 

Published at https://appsoftware.com

## Development / Debug

Development / debugging of static site options:

1. Set up local NGINX

2. Set up npm and install http-server package:

```
$ npm init
$ npm install http-server
```

package.json contains run script:

```
"scripts": {
    "dev": "http-server ."
},
```
Run with

```
$ npm run dev
```