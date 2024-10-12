# Prompt Manager

Prompt Manager is a Vue 3 application built with Vite, designed to help users create, manage, and explore prompts for various purposes.

## Features

- Create, read, update, and delete prompts
- Explore prompts with search and filter functionality
- Secure management area with PIN protection
- Responsive design using Vuetify components
- Theme switching between light and dark modes

## Project Setup

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:

   ```shell
   git clone https://github.com/your-username/prompt-manager.git
   cd prompt-manager
   ```

2. Install dependencies:

   ```shell
   npm install
   ```

### Development

To run the development server:

```shell
npm run dev
```

This will start the development server at `http://localhost:5173`.

### Building for Production

To build the application for production:

```shell
npm run build
```

The built files will be in the `dist` directory.

### Running Tests

To run the unit tests:

```shell
npm run test
```

## Project Structure

- `src/`: Source files
  - `assets/`: Static assets
  - `components/`: Vue components
  - `router/`: Vue Router configuration
  - `store/`: Pinia store modules
  - `views/`: Vue components used as pages
  - `App.vue`: Root component
  - `main.js`: Application entry point
- `public/`: Public static assets
- `tests/`: Unit tests

## Technologies Used

- Vue 3: Progressive JavaScript framework
- Vite: Next-generation frontend tooling
- Vuetify: Material Design component framework
- Pinia: State management library
- Vue Router: Official router for Vue.js
- Vitest: Unit testing framework

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the [MIT License](LICENSE).
