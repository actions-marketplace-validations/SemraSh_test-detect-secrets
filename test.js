'use strict'
const exec = require('@actions/exec')
const core = require('@actions/core')

const findUnused = async secrets => {
  const secretNames = secrets.map(secret => secret.name)

  try {
    const executionOutput = await exec.getExecOutput(
      `egrep -r ${secretNames.join('|')} .github/workflows`,
      [],
      { silent: true, ignoreReturnCode: true }
    )

    return secretNames.filter(
      secret => !executionOutput.stdout.includes(secret)
    )
  } catch (err) {
    core.setFailed(`Searching for secrets failed with: ${err}`)
  }
}

const sec = [{ name: 'bla' }, { name: 'duh' }]

findUnused(sec).then(a => {
  console.log(a)
})
