# **Chido**
## Build **hybrid**, fast and cool `React` based apps

**current:** alpha

todo: check [TODO.MD](TODO.MD) for the ***Road to Alpha***


## **How does it work?**
`chido` reads all the `.js` files in the `./src/pages` directory (a very common pattern in static site generators) and builds a static site from them, if you want you can also export a `@reach/router` component from  and `chido` will build an `.html` file for each `Router` or `React` component and since it supports code-splitting for `.js` and `.css` (incluidng `.sass` and `.scss`) the first print is really fast.

## **How will my app look like?**

```jsx
// .src/pages/movies.js
import React from 'react'
import { Router, Link } from 'chido'

const MoviesList = () => (
  <main>
    <h1>Cool movies!!!</h1>
    <ul>
      <Link to='/movies/the-two-towers'>The Two Towers</Link>
      <Link to='/movies/pirates-of-silicon-valley'>Pirates of Silicon Valley</Link>
      <Link to='/the-wolf-of-wall-street'>The Wolf of Wall Street!!!</Link>
    </ul>
  </main>
)

const CoolMovie = ({ movieName }) => (
  <div>
    <h1>{`${movieName} is a really cool movie!!!`}</h1>
    <Link to='/movies'>Back to movies</Link>
  </div>
)

export default function MoviesRouter() {
  return (
    <Router>
      <MoviesList path='/' />
      <CoolMovie path=':movieName' />
    </Router>
  )
}
```
file in ./src/pages | outputs in ./public
-----|------
`index.js` | `index.html`
`movies.js` // MoviesList | `movies/index.html` // It's static
`movies.js` // CoolMovie | `movies/movieName/index.html` // It's dynamic


## **How do I access an hybrid site?**
To make sure this works, you need to setup a router in your server, but not be afraid, I've done succesful tests with `.htaccess` (and `chido` comes with an automatic .htaccess router builder) in shared hosting and it's really fast (as you'd expect any static generatedd site to be). The trick is in redirecting all the dynamic looking requests to the static server location:

  ### Examples
  requested url | served fiile and directory
  ----|----
  `/movies/episode-iv/`|/movies/movieName/index.html
  `/movies/pulp-fiction/`| *the same as above*
  `/movies/the-ring/`|*the same as above*


# **Features**
- Code spliting (also valid for `.css`)
- Fast `HMR` with newest `react-hot-loader` (getting ready for hooks!!!)
- Chunk prefetching thanks to ``chido`-link`
- ~~Service worker~~

# **`chido-link`**

As any other React based site generator, ``chido`` comes with it's own `Link` to move across `chido`'s pages. it allows us to make a chunk prefetching which starts when the user hovers or clicks over it.

```jsx
import React from 'react'
import { Link } from 'chido'

export default function About() {
  return (
    <main>
      <p>español: React es chido</p>
      <p>english: React is cool</p>
    </main>
  )
}
```
