# Casbin-editor

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](#badge)
[![Build](https://github.com/casbin/casbin-editor/actions/workflows/release.yml/badge.svg)](https://github.com/casbin/casbin-editor/actions/workflows/release.yml)
[![Release](https://img.shields.io/github/release/casbin/casbin-editor.svg)](https://github.com/casbin/casbin-editor/releases/latest)
[![GitHub issues](https://img.shields.io/github/issues/casbin/casbin-editor?style=flat-square)](https://github.com/casbin/casbin-editor/issues)
[![GitHub forks](https://img.shields.io/github/forks/casbin/casbin-editor?style=flat-square)](https://github.com/casbin/casbin-editor/network)
[![Sourcegraph](https://sourcegraph.com/github.com/casbin/casbin-editor/-/badge.svg)](https://sourcegraph.com/github.com/casbin/casbin-editor?badge)
[![License](https://img.shields.io/github/license/casbin/casbin-editor?style=flat-square)](https://github.com/casbin/casbin-editor/blob/master/LICENSE)
[![Discord](https://img.shields.io/discord/1022748306096537660?logo=discord&label=discord&color=5865F2)](https://discord.gg/S5UjpzGZjN)

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

## For Electron

This project supports being built as an Electron app:

```shell
yarn install
yarn dist
```
