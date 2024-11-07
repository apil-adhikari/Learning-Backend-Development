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

## Error: listen EADDRINUSE: address already in use :::<PORT>

If there is an error of address already in use when starting the server in Express, we can do like this to resolve the problem in windows machine.

REM Replace <PORT> with your target port number

    netstat -ano | findstr :<PORT>

REM Replace <PID> with the PID found in the previous command output

    tasklist /FI "PID eq <PID>"

REM Replace <PID> with the same PID to terminate the process

    taskkill /PID <PID> /F
