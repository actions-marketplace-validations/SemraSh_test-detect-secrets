'use strict'
const exec = require('@actions/exec')
const core = require('@actions/core')

async function findUnused(secrets) {
  const secretNames = secrets.map(secret => secret.name)

  try {
    const executionOutput = await exec.getExecOutput(
      `egrep -r ${secretNames.join('|')} .github/workflows`,
      [],
      {
        silent: true,
        ignoreReturnCode: true,
        cwd: process.env.GITHUB_WORKSPACE
      }
    )

    core.info(`EXECUTION OUTPUT ${executionOutput.stdout}`)
    core.info(`EXECUTION OUTPUT ${process.env.GITHUB_WORKSPACE}`)

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
