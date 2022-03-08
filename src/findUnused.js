'use strict'
const exec = require('@actions/exec')
const core = require('@actions/core')

const path = require('path')

async function findUnused(secrets) {
  const secretNames = secrets.map(secret => secret.name)

  try {
    const executionOutput = await exec.getExecOutput(
      `egrep -r ${secretNames.join('|')} ./`,
      [],
      {
        silent: true,
        ignoreReturnCode: true,
        cwd: path.join(process.env.GITHUB_WORKSPACE, '.github', 'workflows')
      }
    )

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
