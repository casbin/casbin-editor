# Casbin-editor

Casbin-editor is a web-based Casbin model and policy editor. It's based on Next.js + TypeScript.

Use the Casbin-editor to write your Casbin model and policy in your web browser.
It provides functionality such as syntax highlighting and code completion, just like an IDE for a programming language.

Try it at either:

1. Casbin official website: https://casbin.org/editor
2. Our standalone GitHub pages: https://editor.casbin.org

## How it works?

Casbin-editor is a pure frontend Javascript project. It uses [node-casbin](https://github.com/casbin/node-casbin) to perform policy enforcement. It's notable that node-casbin can be used either in frontend Javascript or Node.js.

This project can be viewed as an example for using node-casbin in the browser.

## For Dev

```shell
yarn install
yarn dev
```

Open browser: http://localhost:3000/

## Production Preview


```shell
yarn build

# Make sure port 3000 is not in use
yarn start
```

Open browser: http://localhost:3000/

## Electron Build

This project supports building an Electron application for Casbin-editor.

```shell
yarn install
yarn dist
```


