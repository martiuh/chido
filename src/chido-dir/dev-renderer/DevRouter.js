import React from 'react'
import { Link, Router } from '@reach/router'

import syncChunks from '../routes/sync-chunks'
import fileRouter from '../routes/file-router'
import buildSyncRouter from '../utils/buildSyncRouter'

const FourOFour = () => (
  <div>
    404 Not Found
    <Link to='/'>Go to home</Link>
  </div>
)

// Here I only get where I shall use the path/* pattern
const Chunknames = Object.keys(syncChunks)
const SyncChunksArr = Object.values(syncChunks)

function DevRouter() {
  console.log('Rendering Router')
  return (
    <Router>
      {SyncChunksArr.map((sync, index) => {
        // TODO: Make a Component Based Router
        const Comp = sync.default
        if (!Comp) {
          return null
        }
        const SyncComp = sync
        let defaultPath = fileRouter[Chunknames[index]]
        defaultPath = defaultPath === 'index/' ? '/' : defaultPath
        let Page = ''
        if (Comp.prototype.render) {
          Page = new Comp() //
          Page = Page.render()
        }
        else {
          Page = Comp()
        }
        if (Page.props.children) {
          // I only need to know if the component children have a path prop
          const newPath = buildSyncRouter(Page.props, defaultPath)
          return <Comp key={newPath || defaultPath} path={newPath || defaultPath} />
        }
        return <SyncComp key={defaultPath} path={defaultPath} />
      })}
      <FourOFour path='*' />
    </Router>
  )
}

export default DevRouter
