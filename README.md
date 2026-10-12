# Spline Stage Portfolio

Portfolio website template for visual and frontend creators. Deep navy stage, coral accent, floating CSS 3D hero with mouse parallax, work gallery with modal, about plus toolbox, service plans, validated contact form.

## Features

1. Sticky glass nav with hamburger and smooth scroll
2. Hero with CSS 3D cubes plus cards, canvas dust, parallax tilt, availability pill
3. Work gallery with 6 pure CSS art cards and accessible modal popup
4. About plus toolbox grid and 3 service plan cards
5. Contact form with inline validation plus footer

## Run

One command from this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000 in a browser.

## Customize

Edit name, copy and colors in `index.html` and the `:root` block in `styles.css`. Swap gallery items by copying a `workCard` article and changing its `data` attributes. Form validation lives in `script.js` near the bottom. Canvas dot count adapts to screen width automatically.

## Structure

```
index.html   markup for nav, hero, work, about, services, contact, modal
styles.css   solid color theme, 3D stage, cards, responsive rules
script.js    nav toggle, parallax, canvas, reveals, modal, form check
README.md    this guide
```

Design notes: solid colors only, Sora font, rounded 14 to 24 px, soft shadows, responsive at 360 px, 768 px and 1200 px.
