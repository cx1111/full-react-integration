## Introduction

This is a react app that uses:

- `Node.JS` version as specified in `package.json`
- `yarn` v1.22.4 - package manager
- `Next.JS` - framework for React.JS
- `Typescript` - typed code is better than non-typed js. https://nextjs.org/learn/excel/typescript
- `styled-components` for CSS in JS.

## Commands

See `package.json` for the project's configuration, and possible commands. Important commands include:

- `yarn install` - Install node packages.
- `yarn dev` - Starts the development server.
- `yarn build` - Builds the app for production.. Compiles src React and Typescript files into JavaScript for the browser
- `yarn start` - Runs the built app in production mode.

## Project Layout

### Pages

To create a new page, create a new `.tsx` file in `pages` which Next.JS uses for its urls/routing.

Use the `<Link>` component to link between pages.

### Styling and Layout

This project uses `styled-components` instead of raw CSS files.

For base page templates/layouts, specify the layout component file in the `components` folder.

[material-ui](https://material-ui.com/) is used as the base styling library.

- https://github.com/vercel/next.js/tree/canary/examples/with-styled-components
- https://github.com/mui-org/material-ui/tree/master/examples/nextjs-with-typescript
- https://github.com/vercel/next.js/issues/4068
- https://github.com/mui-org/material-ui/tree/master/examples/nextjs

### APIs

In general, try to avoid creating APIs in this Next.JS app if possible. Try to consolidate them in the Django app.

If you really need/want to, add a file in `pages/api`.

## Developing

Run `yarn dev` to start the app and go to the specified localhost URL. Save your source files to update the app in place.

## Template Project

This was originally created from a starter template for [Learn Next.js](https://nextjs.org/learn).
