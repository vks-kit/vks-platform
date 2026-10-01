import { build } from "esbuild";
await build({entryPoints:["packages/ui/src/components/logo.tsx"],bundle:true,format:"esm",platform:"node",outfile:".shots/logo/logo.mjs",external:["react","react-dom"],jsx:"automatic",logLevel:"error"});
const { Logo } = await import("./logo.mjs");
const React = (await import("react")).default; const { renderToStaticMarkup } = await import("react-dom/server");
const css=":root{--logo-field:#f1f1f4;--logo-navy:#16173a;--logo-gold:#d8bf8c;--logo-steel:#c9cad4;--logo-steel-2:#e2e2e8;--logo-letter:#fff}";
const svg=renderToStaticMarkup(React.createElement(Logo,{className:"x"}));
const mono=renderToStaticMarkup(React.createElement(Logo,{variant:"mono"}));
const fs=await import("fs");
fs.writeFileSync(".shots/logo/cmp.html",`<html><style>${css}body{margin:0;display:flex;gap:20px;padding:20px;background:#fff;align-items:center}svg{width:480px;height:480px}.m svg{width:120px;height:120px;color:#16173a}.d{background:#0b1020;padding:20px;border-radius:20px}.d svg{width:120px;height:120px}</style><img src="real.png" width=480>${svg}<div class=m>${mono}</div><div class=d>${svg}</div></html>`);
