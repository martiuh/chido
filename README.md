# **Dinastico** *Hybrid Site Generator*

## Build ~~dynamic/static~~ hybrid, fast and cool `React` based apps


**current:** pre-alpha

todo: check [TODO.MD](TODO.MD) for the ***Road to Alpha***


## **How does it work?**
Dinastico reads all the `.js` files in the `./src/pages` directory and builds a static site from them, if you want you can also export a `@reach/router` component from  and Dinastico will build an `.html` file for each `Router` or `React` component and since it supports code-splitting for `.js` and `.css` (incluidng `.sass` and `.scss`) the first print is really fast.

## **How will my app look like?**

```jsx
// .src/pages/movies.js
import React from 'react'
import { Router } from '@reach/router'
import Link from 'dinastico-link'

import MovieIndex from '../components/MovieIndex'
import MovieCard from '../components/MovieCard'

export default function MoviesRouter() {
  return (
    <Router>
      <MovieIndex path='/' />
      <MovieCard path=':movieName' />
      <Link to='/privacy'>
        {/*
          Just to randomly show you that dinastico-link exists
          More info on dinastico-link bellow
        */}
        Check out our privacy policy
      </Link>
    </Router>
  )
}
```
file in ./src/pages | outputs in ./public
-----|------
`index.js` | `index.html`
`movies.js` // MovieIndex | `movies/index.html` // It's static
`movies.js` // MovieCard | `movies/movieName/index.html` // It's dynamic


## **How do I access an hybrid site?**
To make sure this works, you need to setup a router in your server, but not be afraid, I've done succesful tests with `.htaccess` (and dinastico comes with an automatic .htaccess router builder) in shared hosting and it's really fast (as you'd expect any static generatedd site to be). The trick is in redirecting all the dynamic looking requests to the static server location:

  ### Examples
  requested url | served fiile and directory
  ----|----
  `/movies/episode-iv/`|/movies/movieName/index.html
  `/movies/pulp-fiction/`| *the same as above*
  `/movies/the-ring/`|*the same as above*


# **Features**
- Code spliting (also valid for `.css`)
- Fast `HMR` with newest `react-hot-loader` (getting ready for hooks!!!)
- Chunk prefetching thanks to `dinastico-link`
- ~~Service worker~~

# **`dinastico-link`**

As any other React based site generator, `dinastico` comes with it's own `Link` to move across dinastico's pages. it allows us to make a chunk prefetching which starts when the user hovers or clicks over it.