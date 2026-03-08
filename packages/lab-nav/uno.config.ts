import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
	presets: [presetUno(), presetAttributify()],
	theme: {
		colors: {
			lab: {
				bg: "#0F0F1F", // --zv-dark-deep
				surface: "#1A1A2E", // --zv-dark
				border: "#2E2E52", // --zv-dark-lighter
				muted: "#9E9EBF", // --zv-gray
				active: "#F5F0E8", // --zv-white
				gold: "#F0D040", // --zv-gold
			},
		},
	},
	preflights: [
		{
			getCSS: () => `
        @keyframes lab-glow-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes lab-dot-arrive {
          0% { box-shadow: 0 0 6px var(--dot-color); }
          40% { box-shadow: 0 0 14px var(--dot-color); }
          100% { box-shadow: 0 0 6px var(--dot-color); }
        }

        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `,
		},
	],
	shortcuts: {
		"lab-font-display": "font-[Epilogue,ui-sans-serif,system-ui,sans-serif]",
		"lab-font-mono": "font-[IBM_Plex_Mono,ui-monospace,monospace]",
		"lab-focus": "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-gold",
		"lab-nav-link": "lab-font-mono text-sm font-400 uppercase tracking-wider no-underline transition-colors",
		"lab-section-label": "lab-font-mono text-xs uppercase tracking-widest font-600 text-lab-muted",
		"lab-ghost-btn": "bg-transparent border-none cursor-pointer transition-colors",
	},
});
