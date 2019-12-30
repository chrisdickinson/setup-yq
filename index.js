'use strict'

const { promisify } = require('util')
const path = require('path')
const os = require('os')
const fs = require('fs')

const cache = require('@actions/tool-cache')
const core = require('@actions/core')

const chmod = promisify(fs.chmod)

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
    const platform = os.platform()
    let arch = os.arch()
    if (arch === 'x64') {
      arch = 'amd64'
    }

    let toolPath = cache.find('yq', version, arch)

    if (!toolPath) {
      const context = {
        arch,
        platform,
        version
      }
      const rendered = url.replace(/\{(\w+?)\}/g, (a, match) => {
        return context[match] || ''
      })

      const downloadPath = await cache.downloadTool(rendered)
      toolPath = await cache.cacheFile(downloadPath, 'yq', 'yq', version)
    }

    await chmod(path.join(toolPath, 'yq'), 0o755) // just in case we haven't preserved the executable bit
    core.addPath(toolPath)
  } catch (error) {
    core.setFailed(error.message)
  }
}
