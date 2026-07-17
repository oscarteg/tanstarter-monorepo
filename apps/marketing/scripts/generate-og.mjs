// Generates a 1200x630 Open Graph image in the Rams Document style
// (warm paper field, a Braun-orange block-end bar and the square marker).
// Pure Node — no deps, no network — so it works anywhere. It's a deliberately
// minimal, on-brand placeholder: replace `public/og.png` with a real branded
// 1200x630 image per project, or re-run `node scripts/generate-og.mjs` after
// tweaking the colors below.
import { writeFileSync } from "node:fs";
import { deflateSync } from "node:zlib";

const WIDTH = 1200;
const HEIGHT = 630;
const PAPER = [0xef, 0xeb, 0xe3];
const ACCENT = [0xdc, 0x4b, 0x12];
const RULE = [0xd4, 0xce, 0xc3];

const stride = WIDTH * 3;
const raw = Buffer.alloc((stride + 1) * HEIGHT);

function setPixel(x, y, [r, g, b]) {
  const offset = y * (stride + 1) + 1 + x * 3;
  raw[offset] = r;
  raw[offset + 1] = g;
  raw[offset + 2] = b;
}

function fillRect(x0, y0, x1, y1, color) {
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) setPixel(x, y, color);
  }
}

// Paper field (filter byte 0 per scanline is already zeroed by Buffer.alloc).
fillRect(0, 0, WIDTH, HEIGHT, PAPER);
// Hairline above the accent bar.
fillRect(0, HEIGHT - 18, WIDTH, HEIGHT - 17, RULE);
// Braun-orange block-end bar.
fillRect(0, HEIGHT - 16, WIDTH, HEIGHT, ACCENT);
// The square marker — the Rams brand ornament.
fillRect(96, 96, 152, 152, ACCENT);

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([length, body, crc]);
}

const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(WIDTH, 0);
ihdr.writeUInt32BE(HEIGHT, 4);
ihdr[8] = 8; // bit depth
ihdr[9] = 2; // color type 2 (truecolor RGB)

const png = Buffer.concat([
  signature,
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = new URL("../public/og.png", import.meta.url);
writeFileSync(out, png);
console.log(`wrote og.png (${WIDTH}x${HEIGHT}, ${png.length} bytes)`);
