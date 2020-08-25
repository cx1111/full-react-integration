**Ignore this folder!!!**

This app was created using `create-react-app`. We are using `nextjs` instead.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).


## Serving this with Django

To combine, use webpack to bundle all React code into a js blob.

Go to `test-react` and run:
- `yarn install`: installs the node packages
- `yarn build`: compiles and packages the code into web servable JS. The output dir lands the JS blob into one of the django static dirs, which will be picked up by the main template.

Then from django, run `python manage.py runserver` and go to the root url. The single frontend view should be called, which will serve the single django template, which includes the compiled JS blob. This will then do all the routing and display logic.

We then need to make all the API views in Django using Django-Rest to be consumed by the react app.


### React

- Node.js 12.16
- React, Typescript, Webpack
- Emotion styled
- Eslint and Prettier

React code with Typescript
Styling with emotion

Babel compiles the .tsx files into web compatible JS.

Webpack packages the project


```
npm install react react-dom @babel/preset-typescript @babel/preset-react @babel/core babel-loader webpack webpack-cli


npm install @types/react @types/react-dom

npm install typescript ts-loader source-map-loader
```

Config files:
- package.json - specifies node packages and commands. Look here under 'scripts' to see commands. Run `yarn <scriptname>` to run a command. ie. `yarn build`
- .babelrc
- webpack.config.js
- tsconfig.json

## References

https://www.valentinog.com/blog/drf/

https://www.pluralsight.com/guides/react-typescript-webpack

https://www.pluralsight.com/guides/typescript-react-getting-started
