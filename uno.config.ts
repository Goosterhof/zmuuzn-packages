import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
  presets: [presetUno(), presetAttributify()],
  preflights: [
    {
      getCSS: () => `
        @keyframes lab-glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `,
    },
  ],
  shortcuts: {
    "lab-font-display": "font-[Epilogue,ui-sans-serif,system-ui,sans-serif]",
    "lab-font-mono": "font-[IBM_Plex_Mono,ui-monospace,monospace]",
  },
});
