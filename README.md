# 紙頁

HTML、CSS、JavaScript 分層的靜態網站骨架。標記寫在 `index.html`，樣式拆在 `src/styles`，行為拆在 `src/scripts`。開發時由 [Vite](https://vite.dev/) 提供伺服器與熱更新，建置後仍是瀏覽器可以直接開啟的靜態檔。

## 目錄

```text
index.html              頁面結構與可見內容
vite.config.js          開發伺服器與建置
public/
  favicon.svg           原樣提供的靜態檔
src/
  styles/
    tokens.css          顏色、字體、間距
    base.css            重置與內文排版
    layout.css          頁首、版面、頁尾
    components.css      目錄、色票、記事卡
  scripts/
    main.js             入口
    theme.js            淺色／深色
    nav.js              窄螢幕選單
    notes.js            記事
```

## 啟動

```bash
npm install
npm run dev
```

開發伺服器：<http://127.0.0.1:4317>

## 建置

```bash
npm run build
npm run preview
```

建置結果在 `dist/`。

## 接著改哪裡

- 換文案、區塊、表單：編輯 `index.html`
- 換顏色或間距：先改 `src/styles/tokens.css`
- 加互動：在 `src/scripts` 新增模組，再由 `main.js` 掛上
