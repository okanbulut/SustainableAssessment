# A Toolkit for Sustainable Assessment in the Age of Generative AI

Website for the Worldwide Universities Network project led from the University of Alberta: findings, institutional policy guidance, an assessment self-check, six design guidelines, redesign moves and worked examples.

It is a plain static site with no build step, so it can be served directly with GitHub Pages (Settings → Pages → deploy from `main`, root).

```
index.html          the toolkit page
partner-map.html    partner institutions map, embedded in the Team section
assets/ds/          design-system tokens and component classes
assets/site.css     page-level styles
assets/app.js       self-check, redesign moves and worked-examples logic
library/            worked examples library (CC BY 4.0) — see library/README.md
```

To preview locally:

```bash
python3 -m http.server 8765
```
