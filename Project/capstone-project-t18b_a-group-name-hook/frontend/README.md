# Directory guideline
-  `src/`: Frontend source files
    - `assets/`: Static assets (like images)
    - `components/`: Vue components
    - `plugins/`: External plugin
    - `router/`: Client side only routes config
    - `services/`: Interface between the remote data layer (server) and the business logic (is also where debug data is injected)
    - `store/`: Business logic
    - `views/`: First Vue components for each route defined in `router/`
    - `App.vue`: Root Vue component
    - `config.js`: Config for communication with the server side
    - `debug_data.js`: Data for debugging
    - `dev_config.js`: Configs for testing in development (debug) environment
    - `helper.js`: Helper functions
    - `main.js`: JS entry point

-  `old/`: Unused source files

# Installation and Running

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).