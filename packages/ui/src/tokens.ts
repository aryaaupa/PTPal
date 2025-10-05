export const tokens = {
  radius: 16,
  shadow: '0 4px 16px rgba(0,0,0,0.06)',
  timing: {
    hover: '120ms',
    tap: '80ms',
  },
} as const;

export const cssVariables = `:root{--bg0:hsl(210 40% 98%);--bg1:hsl(0 0% 100%);--text1:hsl(222 47% 11%);--text2:hsl(215 16% 47%);--brand:hsl(192 95% 40%);--brand2:hsl(192 90% 32%);--accent:hsl(158 62% 45%);--ok:hsl(142 72% 29%);--warn:hsl(38 92% 50%);--danger:hsl(0 84% 60%);--border:hsl(214 32% 91%)}body{background:var(--bg0);color:var(--text1);font-family:Inter,ui-sans-serif,system-ui,-apple-system}*{box-sizing:border-box}`;
