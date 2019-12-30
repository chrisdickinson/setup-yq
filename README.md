# setup-yq

Sets up [YQ][ref-yq], yet-another-markup-language-query-er, for use in YOUR github action workflow. (And it caches it, too!)

**NB: This version of YQ purposefully diverges from JQ's argument format.**

## Usage

```
# in your job:
name: MY GREAT JOB
on:
  push:
    branches:
      - '*'
jobs:
  yq-example:
    name: YQ example!
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v1
    - uses: chrisdickinson/setup-yq@latest
    - name: Show folks how to run YQ:
      run: |
        yq --help

```

## Hacking

After you've made changes, you must run `npm run build` and commit the
`dist/index.js`, or else your changes won't take effect!

## License

Apache-2.0

[ref-yq]: https://github.com/mikefarah/yq
