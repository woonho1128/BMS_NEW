export default {
  plugins: {
    /**
     * TailwindCSS v4+
     * - Tailwind의 PostCSS 플러그인이 `@tailwindcss/postcss`로 분리됨
     * - `tailwindcss`를 직접 PostCSS plugin으로 쓰면 Vite CSS 변환이 500으로 실패함
     */
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
