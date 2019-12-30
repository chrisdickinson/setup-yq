'use strict'

const os = require('os')

const cache = require('@actions/tool-cache')
const core = require('@actions/core')

if (require.main === module) {
  main().catch(err => {
    console.error(err.stack)
    process.exit(1)
  })
}

async function main () {
  try {
    const url = core.getInput('yq-url')
    const version = core.getInput('yq-version')
    let toolPath = cache.find('yq', version)

    if (!toolPath) {
      const platform = os.platform()
      let arch = os.arch()
      if (arch === 'x64') {
        arch = 'amd64'
      }

      const context = {
        arch,
        platform,
        version
      }
      const rendered = url.replace(/\{(\w+?)\}/g, (a, match) => {
        return context[match] || ''
      })

      const downloadPath = await cache.downloadTool(rendered)
      await cache.cacheDir(downloadPath, 'yq', version)
      toolPath = downloadPath
    }

    core.addPath(toolPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}
