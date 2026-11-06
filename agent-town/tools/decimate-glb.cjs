// decimate-glb.cjs — shrink a single-mesh .glb (e.g. a Tripo export) for the Agent Town, with no dependencies.
// Vertex clustering: every vertex snaps to a 3D grid cell (`--grid N` cells along the longest side), a cell keeps ONE
// vertex (the first, with its UV), triangles that collapse are dropped. Keeps the base-colour texture only (the town's
// MeshStandardMaterial gets map + flat roughness); normals are recomputed by three.js at load.
//   node decimate-glb.cjs <in.glb> <out.glb> [--grid 70] [--uvgrid 64]
// Coarse but honest: thin parts (antennae, fingers) may merge. The source file is never changed.
"use strict";
const fs = require("fs");
const [, , inPath, outPath, ...rest] = process.argv;
if (!inPath || !outPath) { console.error("usage: node decimate-glb.cjs <in.glb> <out.glb> [--grid 70]"); process.exit(2); }
const gi = rest.indexOf("--grid"); const GRID = gi >= 0 ? Number(rest[gi + 1]) : 70;
const ui = rest.indexOf("--uvgrid"); const UVGRID = ui >= 0 ? Number(rest[ui + 1]) : 64;

const buf = fs.readFileSync(inPath);
if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error("not a .glb");
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.slice(20, 20 + jsonLen).toString("utf8"));
const binStart = 20 + jsonLen + 8; // the BIN chunk header is 8 bytes
const bin = buf.slice(binStart, binStart + buf.readUInt32LE(20 + jsonLen));

function read(accIndex) {
  const a = gltf.accessors[accIndex]; const bv = gltf.bufferViews[a.bufferView];
  const comps = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type];
  const C = { 5126: Float32Array, 5125: Uint32Array, 5123: Uint16Array, 5121: Uint8Array }[a.componentType];
  const stride = bv.byteStride || comps * C.BYTES_PER_ELEMENT;
  const out = new (a.componentType === 5126 ? Float32Array : Uint32Array)(a.count * comps);
  const base = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const dv = new DataView(bin.buffer, bin.byteOffset);
  const get = { 5126: (o) => dv.getFloat32(o, true), 5125: (o) => dv.getUint32(o, true), 5123: (o) => dv.getUint16(o, true), 5121: (o) => dv.getUint8(o) }[a.componentType];
  for (let i = 0; i < a.count; i++) for (let c = 0; c < comps; c++) out[i * comps + c] = get(base + i * stride + c * C.BYTES_PER_ELEMENT);
  return { data: out, acc: a };
}

const prim = gltf.meshes[0].primitives[0];
const pos = read(prim.attributes.POSITION);
const uv = prim.attributes.TEXCOORD_0 !== undefined ? read(prim.attributes.TEXCOORD_0) : null;
const idx = prim.indices !== undefined ? read(prim.indices).data : Uint32Array.from({ length: pos.acc.count }, (_, i) => i);
const [mnx, mny, mnz] = pos.acc.min; const [mxx, mxy, mxz] = pos.acc.max;
const size = Math.max(mxx - mnx, mxy - mny, mxz - mnz); const cell = size / GRID;

const cellOf = new Map(); const remap = new Uint32Array(pos.acc.count); const keepP = []; const keepU = [];
for (let i = 0; i < pos.acc.count; i++) {
  const x = pos.data[i * 3], y = pos.data[i * 3 + 1], z = pos.data[i * 3 + 2];
  // UV seams split cells: a vertex merges only with one that also shares its texture spot (`--uvgrid`), else the
  // texture smears across the seam.
  const uk = uv ? `|${Math.floor(uv.data[i * 2] * UVGRID)},${Math.floor(uv.data[i * 2 + 1] * UVGRID)}` : "";
  const k = `${Math.floor((x - mnx) / cell)},${Math.floor((y - mny) / cell)},${Math.floor((z - mnz) / cell)}${uk}`;
  let n = cellOf.get(k);
  if (n === undefined) { n = keepP.length / 3; cellOf.set(k, n); keepP.push(x, y, z); if (uv) keepU.push(uv.data[i * 2], uv.data[i * 2 + 1]); }
  remap[i] = n;
}
const tri = []; const seen = new Set();
for (let t = 0; t < idx.length; t += 3) {
  const a = remap[idx[t]], b = remap[idx[t + 1]], c = remap[idx[t + 2]];
  if (a === b || b === c || a === c) continue;
  const key = [a, b, c].sort((p, q) => p - q).join(","); if (seen.has(key)) continue; seen.add(key);
  tri.push(a, b, c);
}

// The base-colour image only.
const mat = gltf.materials[prim.material] || {};
const texIndex = mat.pbrMetallicRoughness && mat.pbrMetallicRoughness.baseColorTexture ? mat.pbrMetallicRoughness.baseColorTexture.index : null;
let img = null, imgMime = null;
if (texIndex !== null) { const im = gltf.images[gltf.textures[texIndex].source]; const bv = gltf.bufferViews[im.bufferView]; img = bin.slice(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength); imgMime = im.mimeType; }

const P = Float32Array.from(keepP), U = Float32Array.from(keepU), I = Uint32Array.from(tri);
const pad4 = (n) => (n + 3) & ~3; const parts = []; const views = []; let off = 0;
function add(b, target) { const len = b.byteLength; views.push({ buffer: 0, byteOffset: off, byteLength: len, ...(target ? { target } : {}) }); parts.push(Buffer.from(b.buffer, b.byteOffset, len)); const p = pad4(len) - len; if (p) parts.push(Buffer.alloc(p)); off += pad4(len); return views.length - 1; }
const vP = add(P, 34962), vU = uv ? add(U, 34962) : null, vI = add(I, 34963), vImg = img ? add(img) : null;
let pmn = [Infinity, Infinity, Infinity], pmx = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < P.length; i += 3) for (let c = 0; c < 3; c++) { pmn[c] = Math.min(pmn[c], P[i + c]); pmx[c] = Math.max(pmx[c], P[i + c]); }
const accessors = [{ bufferView: vP, componentType: 5126, count: P.length / 3, type: "VEC3", min: pmn, max: pmx }];
const attributes = { POSITION: 0 };
if (uv) { accessors.push({ bufferView: vU, componentType: 5126, count: U.length / 2, type: "VEC2" }); attributes.TEXCOORD_0 = 1; }
accessors.push({ bufferView: vI, componentType: 5125, count: I.length, type: "SCALAR" });
const out = {
  asset: { version: "2.0", generator: "agent-town decimate-glb.cjs (from " + ((gltf.asset && gltf.asset.generator) || "?") + ")" },
  scene: 0, scenes: [{ nodes: [0] }], nodes: [{ mesh: 0, name: "robot" }],
  meshes: [{ primitives: [{ attributes, indices: accessors.length - 1, material: 0 }] }],
  materials: [{ pbrMetallicRoughness: { ...(img ? { baseColorTexture: { index: 0 } } : {}), metallicFactor: 0.2, roughnessFactor: 0.6 } }],
  ...(img ? { textures: [{ source: 0 }], images: [{ bufferView: vImg, mimeType: imgMime }] } : {}),
  accessors, bufferViews: views, buffers: [{ byteLength: off }],
};
let json = Buffer.from(JSON.stringify(out)); json = Buffer.concat([json, Buffer.alloc(pad4(json.length) - json.length, 0x20)]);
const body = Buffer.concat(parts);
const header = Buffer.alloc(12); header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4); header.writeUInt32LE(12 + 8 + json.length + 8 + body.length, 8);
const jh = Buffer.alloc(8); jh.writeUInt32LE(json.length, 0); jh.writeUInt32LE(0x4e4f534a, 4);
const bh = Buffer.alloc(8); bh.writeUInt32LE(body.length, 0); bh.writeUInt32LE(0x004e4942, 4);
fs.writeFileSync(outPath, Buffer.concat([header, jh, json, bh, body]));
console.log(JSON.stringify({ grid: GRID, trianglesIn: idx.length / 3, trianglesOut: I.length / 3, verticesOut: P.length / 3, bytesOut: fs.statSync(outPath).size }));
