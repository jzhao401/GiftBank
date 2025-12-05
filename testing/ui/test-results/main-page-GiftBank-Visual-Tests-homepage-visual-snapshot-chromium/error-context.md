# Page snapshot

```yaml
- iframe [ref=e1]:
  - generic [ref=f1e2]:
    - generic [ref=f1e3]: "Compiled with problems:"
    - button "Dismiss" [ref=f1e4] [cursor=pointer]: ×
    - generic [ref=f1e5]:
      - generic [ref=f1e6]:
        - generic [ref=f1e7] [cursor=pointer]: ERROR in ./node_modules/dotenv/lib/main.js 24:11-24
        - generic [ref=f1e8]: "Module not found: Error: Can't resolve 'fs' in '/Users/jimzhao/Library/Mobile Documents/com~apple~CloudDocs/Projects/GiftBank/giftlink-frontend/node_modules/dotenv/lib'"
      - generic [ref=f1e9]:
        - generic [ref=f1e10] [cursor=pointer]: ERROR in ./node_modules/dotenv/lib/main.js 25:13-28
        - generic [ref=f1e11]: "Module not found: Error: Can't resolve 'path' in '/Users/jimzhao/Library/Mobile Documents/com~apple~CloudDocs/Projects/GiftBank/giftlink-frontend/node_modules/dotenv/lib' BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default. This is no longer the case. Verify if you need this module and configure a polyfill for it. If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { \"path\": require.resolve(\"path-browserify\") }' - install 'path-browserify' If you don't want to include a polyfill, you can use an empty module like this: resolve.fallback: { \"path\": false }"
      - generic [ref=f1e12]:
        - generic [ref=f1e13] [cursor=pointer]: ERROR in ./node_modules/dotenv/lib/main.js 26:11-24
        - generic [ref=f1e14]: "Module not found: Error: Can't resolve 'os' in '/Users/jimzhao/Library/Mobile Documents/com~apple~CloudDocs/Projects/GiftBank/giftlink-frontend/node_modules/dotenv/lib' BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default. This is no longer the case. Verify if you need this module and configure a polyfill for it. If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { \"os\": require.resolve(\"os-browserify/browser\") }' - install 'os-browserify' If you don't want to include a polyfill, you can use an empty module like this: resolve.fallback: { \"os\": false }"
```