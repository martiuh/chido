## Goals to alpha
- ~~Programatically build a **production** Router from the src/pages folder~~
- ~~`dinastico-link` tries to guess if the dynamic url is part of our routing strategy~~, 
- ~~Build a file or folder for each route in our app (for faster first print)~~
- ~~Support for `react-helmet`~~
- Create a Wrapper React Component where to enable redux, context, or any *wrapping* required
- prefetch a `404.html` when the router doesn't know the path

- Development features:
  - ~~webpack-dev-middleware instead of webpack-dev-server~~
  - ~~`chokidar` to watch the `pages/ folder` and expect a new `.js` file, when it happens build a new router and reload the `app`~~
  - ~~detects when the any page exports a `Router` instance~~
## Dinastico Routing
- .htaccess
  - ~~Make an htaccess file to succesfully route dynamic URL parameters~~
  - Programatically build an htaccess file for our dynamic routes.
- *optional:*
  - php
    - Build an automatic `AltoRouter` with each dynamic url

**Road to 0.6.0**
- ~~Expose webpack.config to the client~~
- Build the router considering `pages` directory has recursively folders with `.js` files.
- `dinastico-link` prefetches on keyPress
- detect when component changes class to function or viceversa
