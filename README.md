# Casbin-editor

Casbin-editor is a web-based Casbin model and policy editor. It's based on React + TypeScript.

Use the Casbin-editor to write your Casbin model and policy in your web browser.
It provides functionality such as syntax highlighting and code completion, just like an IDE for a programming language.

Try it at either:

1. Casbin official website: https://casbin.org/en/editor.
2. Our standalone GitHub pages: https://casbin.org/casbin-editor/

## Getting started

```shell
npm install
npm start
```

Open browser: http://localhost:3000/

## Deployment

```
npm deploy
```

The generated static pages will be pushed into `gh-pages` branch of `origin` and published in GitHub Pages (https://casbin.org/casbin-editor/). The Casbin official site (https://casbin.org/en/editor) uses iframe to embed the published GitHub pages. 
