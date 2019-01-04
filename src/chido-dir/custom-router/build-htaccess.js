const path = require('path')
const fs = require('fs')

/* eslint-disable-next-line import/no-unresolved */
const router = require('./.dinas/routes/dinastico-routes.json')

const onlyDynamic = Object.values(router).filter(route => !!route.route)

let htaccess = ''

onlyDynamic.forEach(({ route, directory }) => {
  htaccess = `${htaccess}
    ${route} ${directory}
  `
})
