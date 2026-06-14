const fs = require('fs');
const path = require('path');

const shopHtml = fs.readFileSync(path.join(__dirname, '..', 'shop.html'), 'utf-8');

// Map data-id -> SKU
const skuMap = {
  'bomber-hjelp1': 'TTH-BMBR-HJLP1',
  'pants-codered': 'TTH-PNTS-CDRED',
  'salomon-xt6': 'TTH-SLMN-XT6',
  'cap-cp-adidas': 'TTH-CAP-CPAD',
  'pants-dickies-double-knee': 'TTH-PNTS-DCKN',
  'pants-hjelp-baggy': 'TTH-PNTS-HJBG',
  'jeans-carhartt-b13': 'TTH-JNS-CHB13',
  'jeans-rassvet': 'TTH-JNS-RSVT',
  'jeans-oktyabr-baggy': 'TTH-JNS-OKBG',
  'jacket-hjelp-rain': 'TTH-JKT-HJRN',
  'rug-bitch': 'TTH-RUG-BTCH',
  'tshirt-codered-dacar': 'TTH-TSR-CRDC',
  'tshirt-codered-paint-tune': 'TTH-TSR-CRPT',
  'tshirt-codered-crumped-box': 'TTH-TSR-CRCB',
  'tshirt-codered-kusok-green': 'TTH-TSR-CRKG',
  'tshirt-codered-kusok-black': 'TTH-TSR-CRKB',
  'tshirt-codered-logo20-black': 'TTH-TSR-CRLB',
  'tshirt-codered-logo20-blue': 'TTH-TSR-CRLU',
  'tshirt-codered-paint-tune-2': 'TTH-TSR-CRPT2',
  'tshirt-codered-logo20-tm-green': 'TTH-TSR-CRLG',
  'hoodie-codered-outline-logo-22': 'TTH-HDC-CROL',
  'hoodie-codered-rolluppers': 'TTH-HDC-CRRP',
  'longsleeve-codered-puzir-black': 'TTH-LSL-CRPB',
  'hoodie-codered-piping-font': 'TTH-HDC-CRPF',
  'longsleeve-codered-puzir-gray': 'TTH-LSL-CRPG',
  'hoodie-codered-logo30-tm': 'TTH-HDC-CRL3',
  'hoodie-codered-reddy-boy': 'TTH-HDC-CRRB',
  'hoodie-codered-base-summer-logo-tm': 'TTH-HDC-CRBS',
  'pencil-case-codered-gray': 'TTH-PNC-CRGR',
  'pencil-case-codered-blue': 'TTH-PNC-CRBU',
  'pencil-case-codered-black': 'TTH-PNC-CRBK',
  'pencil-case-codered-graphite': 'TTH-PNC-CRGP',
  'hat-codered-logo-contour-black': 'TTH-HAT-CRLC',
  'hat-codered-rib-mix-short-white': 'TTH-HAT-CRRM',
  'hat-codered-logo-contour-gray': 'TTH-HAT-CRLCG',
  'hat-codered-logo-contour-brown': 'TTH-HAT-CRLCB',
  'hoodie-nb-tnt-gray': 'TTH-HDH-NBTG',
  'hoodie-nb-tnt-black': 'TTH-HDH-NBTB',
  'pants-bbc-lining-black': 'TTH-PNT-BBCB',
  'hoodie-bbc-lining-white': 'TTH-HDH-BBCW',
  'zip-hoodie-pleasures': 'TTH-ZHP-PLRS',
  'hoodie-bbc-lining-black': 'TTH-HDH-BBCB',
  'puffer-carhartt-toronto': 'TTH-PFR-CHTT',
  'puffer-tnf': 'TTH-PFR-TNF',
  'vest-bbc-lining': 'TTH-VST-BBC',
  'pants-postaments-cargos': 'TTH-PNT-PSCG',
  'cap-postaments-dads': 'TTH-CAP-PSDP',
  'hat-postaments-wordz': 'TTH-HAT-PSWD',
  'hat-postaments-ollie-green': 'TTH-HAT-PSOLG',
  'cap-postaments-flat-white': 'TTH-CAP-PSFLW',
  'hat-postaments-ollie-gray': 'TTH-HAT-PSOLY',
  'cap-postaments-five-pattern': 'TTH-CAP-PSFP',
  'hat-postaments-ollie-brown': 'TTH-HAT-PSOLB',
  'cap-postaments-five-black': 'TTH-CAP-PSFB',
  'cap-postaments-flat-black': 'TTH-CAP-PSFLB',
  'cap-postaments-flat-pattern': 'TTH-CAP-PSFLP',
  'hoodie-postaments-cupids': 'TTH-HDH-PSCP',
  'hoodie-postaments-basic-choc': 'TTH-HDH-PSBC',
  'hoodie-postaments-dwarf': 'TTH-HDH-PSDW',
  'tshirt-postaments-shrooms': 'TTH-TSR-PSSH',
  'longsleeve-postaments-think': 'TTH-LSL-PSTH',
  'sweatshirt-postaments-p-logo-green': 'TTH-SWT-PSPLG',
  'sweatshirt-postaments-p-logo-black': 'TTH-SWT-PSPLB',
  'tshirt-obey-white': 'TTH-TSR-OBYW',
  'tshirt-hockey': 'TTH-TSR-HCKY',
  'tshirt-obey-white-2': 'TTH-TSR-OBYW2',
  'tshirt-awake-ny': 'TTH-TSR-AWKN',
  'jeans-oktyabr-baggy-blue': 'TTH-JNS-OKBB',
  'jeans-oktyabr-baggy-gray': 'TTH-JNS-OKBGY',
  'jeans-oktyabr-classic': 'TTH-JNS-OKCL',
  'bag-hike': 'TTH-BAG-HIKE',
  'hat-thrasher': 'TTH-HAT-THR',
  'hat-obey-blue': 'TTH-HAT-OBYB',
  'hat-huf-white': 'TTH-HAT-HUFW',
  'hat-huf-brown': 'TTH-HAT-HUFB',
  'hat-butter-goods': 'TTH-HAT-BTTR',
  'hat-stussy': 'TTH-HAT-STSY',
  'hat-obey-black': 'TTH-HAT-OBYBK',
  'hat-fucking-awesome': 'TTH-HAT-FKNG',
};

let result = shopHtml;

// Replace each product-card opening tag to include data-sku
for (const [id, sku] of Object.entries(skuMap)) {
  const searchStr = `<div class="product-card`;
  const replaceStr = `<div class="product-card" data-sku="${sku}"`;
  
  // Find the card with this specific data-id
  const idRegex = new RegExp(`(<div\\s+class="product-card[^"]*")((?:[^>]*\\s+)*?)data-id="${id}"`, 'g');
  result = result.replace(idRegex, (match, classPart, attrs) => {
    return match.replace(classPart, `${classPart} data-sku="${sku}"`);
  });
}

fs.writeFileSync(path.join(__dirname, '..', 'shop.html'), result);
console.log('shop.html updated with SKUs');

// Generate FAV_IMAGES object for main.js
const favImages = {};
for (const [id] of Object.entries(skuMap)) {
  favImages[id] = [];
}
console.log('FAV_IMAGES keys generated');
