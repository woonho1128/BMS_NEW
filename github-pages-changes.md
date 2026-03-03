# GitHub Pages 배포를 위한 수정 사항

## 1. vite.config.js

### 수정 전
```js
export default defineConfig({
  plugins: [react()],
```

### 수정 후
```js
export default defineConfig({
  base: '/BMS_NEW/',
  plugins: [react()],
```

---

## 2. index.html

### 수정 전
```html
<link rel="icon" type="image/svg+xml" href="/vite.svg" />
```
```html
<script type="module" src="/src/app/main.jsx"></script>
```

### 수정 후
```html
<link rel="icon" type="image/svg+xml" href="./vite.svg" />
```
```html
<script type="module" src="./src/app/main.jsx"></script>
```

---

## 3. src/router/index.jsx

### 수정 전
```jsx
<BrowserRouter>
```

### 수정 후
```jsx
<BrowserRouter basename="/BMS_NEW">
```
