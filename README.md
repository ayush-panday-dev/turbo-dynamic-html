# Turbo Dynamic HTML

![Turbo Dynamic HTML](./logo.png)

[![npm version](https://img.shields.io/npm/v/turbo-dynamic-html.svg)](https://www.npmjs.com/package/turbo-dynamic-html)
[![npm downloads](https://img.shields.io/npm/dm/turbo-dynamic-html.svg)](https://www.npmjs.com/package/turbo-dynamic-html)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

**Ultra-fast JavaScript template engine for dynamic HTML generation**

A lightweight, high-performance template engine built for speed and efficiency. Turbo Dynamic HTML is designed to outperform existing template engines with its optimized architecture, file-based routing system, and efficient rendering capabilities.

---

## 🚀 Quick Start

### Installation

```bash
# Using npm
npm install turbo-dynamic-html

# Using bun
bun add turbo-dynamic-html

# Using yarn
yarn add turbo-dynamic-html
```

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

## 🌟 Features

- **⚡ Lightning Fast**: Optimized for maximum performance with raw TypeScript/JavaScript
- **📁 File-based Routing**: Automatic route generation based on file structure
- **🎨 Layout System**: Nested layout support with automatic composition
- **💾 Built-in Caching**: Optional Redis caching for production environments
- **🔧 TypeScript First**: Written in TypeScript with full type safety
- **🪶 Zero Dependencies**: Minimal footprint with no external runtime dependencies
- **🔄 Dynamic/Static Pages**: Support for both dynamic and static page generation
- **🌐 Flexible Architecture**: Works with any Node.js framework or runtime

---

## 📖 Documentation

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

Turbo Dynamic HTML supports intuitive template syntax:

```TS
import { generateTDHPages } from "turbo-dynamic-html";

const page = generateTDHPages({
  render(data: { chaibg: string }) {
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

<!--
## ⚡ Performance Benchmarks

Turbo Dynamic HTML consistently outperforms other popular template engines:
Note: This is not actual data

| Engine                 | Render Time (1000 iterations) | Memory Usage | Cache Hit Rate |
| ---------------------- | ----------------------------- | ------------ | -------------- |
| **Turbo Dynamic HTML** | **15ms**                      | **2.1MB**    | **98%**        |
| EJS                    | 68ms                          | 4.2MB        | 85%            |
| Handlebars             | 125ms                         | 6.8MB        | 82%            |
| Pug                    | 89ms                          | 3.9MB        | 88%            |
| Nunjucks               | 156ms                         | 7.1MB        | 79%            |

_Benchmarks performed on Node.js 20.x with 1000 template renders_

--- -->

## 🔍 Examples

---

## 🚧 Development Status

**Current Version**: Alpha (v0.1.x)

This template engine is actively being developed with the following roadmap:

### ✅ Completed Features

- Basic template compilation and rendering
- File-based routing foundation
- TypeScript support
- Express.js integration

### 🔄 In Progress

- Performance optimizations for core rendering engine
- Comprehensive error handling and debugging tools
- Redis caching implementation
- Advanced layout composition system

## 🤝 Contributing

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

## 📊 Compatibility

- **Node.js**: 16.x, 18.x, 20.x, 22.x
- **Bun**: 1.x+
- **Frameworks**: Express, Fastify, NestJS
- **TypeScript**: 5.X+

---

## 💬 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/ayush-panday-dev/turbo-dynamic-html/issues)
- **Email**: ayush.panday.dev@gmail.com

---

**Made with ❤️ by [Ayush Panday](https://github.com/ayush-panday-dev)**

_Turbo Dynamic HTML - Where performance meets simplicity_
