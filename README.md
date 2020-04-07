# Test Django React

This is a project to test the integration of Django and React.

## Project Layout

- Backend app in test-django
- Frontend app in test-react

To combine, use webpack to bundle all React code into a js blob.

Go to `test-react` and run:
- `yarn install`: installs the node packages
- `yarn build`: compiles and packages the code into web servable JS. The output dir lands the JS blob into one of the django static dirs, which will be picked up by the main template.

Then from django, run `python manage.py runserver` and go to the root url. The single frontend view should be called, which will serve the single django template, which includes the compiled JS blob. This will then do all the routing and display logic.

We then need to make all the API views in Django using Django-Rest to be consumed by the react app.

### Django

- Django 3.0
- Pylint and Black OR autopep8.

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
