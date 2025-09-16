# Turbo Dynamic HTML

![Turbo Dynamic HTML](./logo.png)

[![npm version](https://img.shields.io/npm/v/turbo-dynamic-html.svg)](https://www.npmjs.com/package/turbo-dynamic-html)
[![npm downloads](https://img.shields.io/npm/dm/turbo-dynamic-html.svg)](https://www.npmjs.com/package/turbo-dynamic-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

> **WARNING**: This package only sutaible for module js not common js. if you want to stay with common js do not declare "type": "commonjs" on package json and ignore some warning related to types.

**Superfast JavaScript template engine for dynamic Webapplication**

A lightweight, high-performance template built for speed and efficiency. Turbo Dynamic HTML is designed to outperform existing template engines with its optimized architecture, file-based routing system, and efficient rendering capabilities.

---

## Quick Start

### Installation

```bash
# Using npm
npm install turbo-dynamic-html

# Using bun
bun add turbo-dynamic-html

# Using yarn
yarn add turbo-dynamic-html
```

### Recomended Extensions

Althought there are Many extensions on vscode that provides user snipit but we are recommending to use is `julienetie.vscode-template-literals` https://marketplace.visualstudio.com/items?itemName=julienetie.vscode-template-literals extension for better suggestions.

### Basic Usage

```javascript
import TDH from "turbo-dynamic-html";
import express from "express";
import path from "path";
TDH.__init__({
  TDH_RENDER_PATH: path.join(process.cwd(), "pages"),
});

const app = express();

app.use(express.static("public"));
app.use(async (req, res, next) => {
  const html = await TDH.render(req.path, renderDataHere);
  if (html) {
    res.contentType("html");
    res.send(html);
  } else next();
});

app.listen(3000, () => {
  console.log("server started at port 3000");
});
```

---

## Features

- **Lightning Fast**: Optimized for maximum performance with raw TypeScript/JavaScript
- **File-based Routing**: Automatic route generation based on file structure
- **Layout System**: Nested layout support with automatic composition
- **Built-in Caching**: Optional Redis caching for production environments
- **TypeScript First**: Written in TypeScript with full type safety
- **Zero Dependencies**: Minimal footprint with no external runtime dependencies
- **Dynamic/Static Pages**: Support for both dynamic and static page generation
- **Flexible Architecture**: Works with any Node.js framework or runtime

---

## Documentation

### File-based Routing

Create your templates in organized directory structures:

```
views/
├── _layout.ts
├── index.ts              -> /
├── about.ts              -> /about
└── blog/
    ├── index.ts          -> /blog
    └── [slug].ts         -> /blog/:slug(EXPERIMENTAL)
```

### Template Syntax

```TS
import { generateTDHPage } from "turbo-dynamic-html";

const page = generateTDHPage({
  render(data: YourDataType) {
    return `<section>Your page content here</section>
`;
  },
});

export default page;

```

### Layout Syntext

```TS
import { generateTDHLayout } from "turbo-dynamic-html";

const layout = generateTDHLayout({
  render(data, children) {
    return html`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <title>Your Title</title>

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link rel="stylesheet" href="style.css" />
        </head>
        <body>
        <!-- Your Headers -->
          <header class="site-header">
           Your Header
          </header>

          <main class="site-content">${children}</main>

          <footer class="site-footer">
            Your Footer
          </footer>
        </body>
      </html>`;
  },
});
export default layout;

```

> **Development Status**

**Current Version**: Alpha (v1.0.0-beta.X.X)

We are continusly working to imporve our Template Engine to improve performance boost:

### Completed Features

- Basic template compilation and rendering
- File-based routing foundation
- TypeScript support

### In Progress

- Integrate with express
- Redis Catching
- Maybe on future gzip

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ayush-panday-dev/turbo-dynamic-html.git
cd turbo-dynamic-html

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build the project
npm run build

# Run tests
npm test
```

---

## Compatibility

- **Node.js**: 16.x, 18.x, 20.x, 22.x
- **Bun**: 1.x+
- **Frameworks**: Express, Fastify, NestJS
- **TypeScript**: 5.X+

---

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/ayush-panday-dev/turbo-dynamic-html/issues)
- **Email**: ayush.panday.dev@gmail.com

---

**Made with ❤️ by [Ayush Panday](https://github.com/ayush-panday-dev)**

_Turbo Dynamic HTML - Where performance meets simplicity_
