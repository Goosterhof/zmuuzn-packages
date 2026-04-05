import { defineConfig, presetUno, presetAttributify } from "unocss";

export default defineConfig({
	presets: [presetUno(), presetAttributify()],
	theme: {
		colors: {
			/* Legacy lab-* tokens (kept for old components during migration) */
			lab: {
				bg: "#0F0F1F",
				surface: "#1A1A2E",
				border: "#2E2E52",
				muted: "#9E9EBF",
				active: "#F5F0E8",
				gold: "#F0D040",
			},
			/* Map tokens — the Laboratory Miniature's visual language */
			map: {
				void: "#0A0A18",
				floor: "#0F0F1F",
				surface: "#1A1A2E",
				elevated: "#252545",
				border: "#2E2E52",
				"border-strong": "#3D3D6B",
				text: "#F5F0E8",
				"text-muted": "#9E9EBF",
				"text-dim": "#6B6B8F",
				gold: "#F0D040",
			},
		},
		fontFamily: {
			"map-display": ["Epilogue", "ui-sans-serif", "system-ui", "sans-serif"],
			"map-mono": ["IBM Plex Mono", "ui-monospace", "monospace"],
		},
		boxShadow: {
			"map-button": "3px 3px 0 #F0D040",
			"map-popover": "6px 6px 0 #0A0A18",
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

        @keyframes map-button-breathe {
          0%, 100% { box-shadow: 3px 3px 0 #F0D040, 0 0 0px rgba(240, 208, 64, 0); }
          50% { box-shadow: 3px 3px 0 #F0D040, 0 0 8px rgba(240, 208, 64, 0.25); }
        }

        @keyframes map-ghost-breathe {
          0%, 100% { filter: brightness(1.0); }
          50% { filter: brightness(1.15); }
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
		/* Legacy shortcuts (kept for old components) */
		"lab-font-display": "font-[Epilogue,ui-sans-serif,system-ui,sans-serif]",
		"lab-font-mono": "font-[IBM_Plex_Mono,ui-monospace,monospace]",
		"lab-focus": "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lab-gold",
		"lab-nav-link": "lab-font-mono text-sm font-400 uppercase tracking-wider no-underline transition-colors",
		"lab-section-label": "lab-font-mono text-xs uppercase tracking-widest font-600 text-lab-muted",
		"lab-ghost-btn": "bg-transparent border-none cursor-pointer transition-colors",
		/* Map shortcuts */
		"map-font-display": "font-map-display",
		"map-font-mono": "font-map-mono",
		"map-focus": "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-map-gold",
	},
});
