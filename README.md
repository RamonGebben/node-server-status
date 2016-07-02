
# Status project


## Development

> TODO make this into a shell script that works on both Mac and Window.
and run it via `npm run dev`

First start Rethinkdb inside of the directory.

```bash
rethinkdb
```
Now you can start the node server by running:

```bash
npm run dev
```
If you want to run the worker as well you can do so by running:

```bash
node workers/worker.js
```

## Install Rethinkdb on Mac

```bash
brew update
brew install rethinkdb
```
