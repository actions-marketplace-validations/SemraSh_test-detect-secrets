'use strict'
const exec = require('@actions/exec')
const core = require('@actions/core')

const fs = require('fs')
const path = require('path')

const workflows = fs.readdirSync(
  path.join(process.env.GITHUB_WORKSPACE, '../', '.github', 'workflows')
)

async function findUnused(secrets) {
  const secretNames = secrets.map(secret => secret.name)

  try {
    const executionOutput = await exec.getExecOutput(
      `egrep -r ${secretNames.join('|')} ${workflows}`,
      [],
      {
        silent: true,
        ignoreReturnCode: true,
        cwd: process.env.GITHUB_WORKSPACE
      }
    )

    core.info(`EXECUTION OUTPUT ${executionOutput.stdout}`)
    core.info(`EXECUTION workspace ${process.env.GITHUB_WORKSPACE}`)
    core.info(`EXECUTION workflows ${workflows}`)

    return secretNames.filter(
      secret => !executionOutput.stdout.includes(secret)
    )
  } catch (err) {
    core.setFailed(`Searching for secrets failed with: ${err}`)
  }
}

module.exports = {
  findUnused
}
