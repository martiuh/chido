import React from 'react'
import { Link, Router } from '@reach/router'

/* eslint-disable-next-line import/no-unresolved, import/extensions */
import syncChunks from './routes/sync-chunks'
/* eslint-disable-next-line import/no-unresolved, import/extensions */
import fileRouter from './routes/file-router'
import buildSyncRouter from './buildSyncRouter'

// Here I only get where I shall use the path/* pattern
const Chunknames = Object.keys(syncChunks)
const SyncChunksArr = Object.values(syncChunks)

function DevRouter() {
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
        defaultPath = defaultPath === '404/' ? '*' : defaultPath
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
    </Router>
  )
}

export default DevRouter
