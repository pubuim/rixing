'use strict'

const addtionalExts = []
const fs = require('fs')
const path = require('path')

function find (root, p, re, recursive) {
  if (root) {
    p = path.resolve(root, p)
  }

  let result = fs.readdirSync(p)

  let results = []

  result.forEach(np => {
    np = path.resolve(p, np)

    let stats = fs.statSync(np)

    if (stats.isFile()) {
      if (re.test(np)) {
        results.push(require(np))
      }
    } else if (stats.isDirectory()) {
      if (recursive) {
        results.concat(find(np, re, recursive))
      } else {
        results.push(require(np))
      }
    }
  })

  return results
}

module.exports = (root, paths, recursive) => {
  if (typeof paths !== 'string' && !Array.isArray(paths)) {
    recursive = paths
    paths = root
    root = null
  }

  if (!Array.isArray(paths)) {
    paths = [paths]
  }

  let exts = Object.keys(require.extensions)
  exts = exts.concat(addtionalExts)

  let re = new RegExp(`(?:${exts.join('|').replace(/\./g, '\\.')})$`)

  let results = []

  paths.forEach(path => results = results.concat(find(root, path, re, recursive)))

  return results
}
