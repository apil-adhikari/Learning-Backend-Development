## Refactoring our Routes

OLD: app.method('path', request handler function) -> Seprating Request handler function from here and keeping this in seprate place

```javascript
app.method('path', functionName);
```

## SETTING UP ESLINT + PRETTIER IN VSCODE

1. Install Prettier
2. Install ESLint

Install following DEV Dependencies:

    npm i eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-config-airbnb eslint-plugin-node eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react --save-dev
