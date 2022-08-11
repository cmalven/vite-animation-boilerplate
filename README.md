# Vite Animation Boilerplate

A foundation for interactive animations built on Vite

## Development

```shell
npm i
npm start
```

## Changing the example

All available examples are located in the `/src/modules/` directory. To use a different example, simply change the following line in `/src/index.ts`

```typescript
import Example from './modules/WhateverExample';
```

## Deploy

```shell
# Build and optimize for production
# The resulting /dist directory can be deployed anywhere…
npm run build

# OR configure deployment with Netlify…
# Deploys will happen after every git push
npx netlify-cli init
```