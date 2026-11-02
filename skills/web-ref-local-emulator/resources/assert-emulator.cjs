#!/usr/bin/env node
// The guard that says this process points at a LOCAL emulator, not production. Use it before any script that
// writes. Passing the project's ports also stops a run on a sibling hub's emulator.
//
//   As a gate:    node <this file> --firestore-port 3100 --auth-port 3101 && node scripts/dev/some-backfill.cjs
//   In a script:  require("<this file>").assertEmulatorOnly({ firestorePort: 3100, authPort: 3101 });
//
// It passes only when both hosts are set, local, and on the named ports. Anything else exits 1 and writes nothing.

function die(message) {
  console.error(`\n!!! REFUSING TO RUN !!!\n${message}\nWithout a local emulator this run would target PRODUCTION.\n`);
  process.exit(1);
}

function checkHost(label, value, expectedPort) {
  if (!value) die(`${label} is not set.`);
  const [host, port] = value.replace(/^https?:\/\//, "").split(":");
  if (host !== "127.0.0.1" && host !== "localhost") die(`${label} points at "${host}", which is not local.`);
  if (expectedPort && String(port) !== String(expectedPort)) die(`${label} is on port ${port}; this project's is ${expectedPort}.`);
}

function assertEmulatorOnly({ firestorePort, authPort } = {}) {
  checkHost("FIRESTORE_EMULATOR_HOST", process.env.FIRESTORE_EMULATOR_HOST, firestorePort);
  checkHost("FIREBASE_AUTH_EMULATOR_HOST", process.env.FIREBASE_AUTH_EMULATOR_HOST, authPort);
}

module.exports = { assertEmulatorOnly };

if (require.main === module) {
  const args = process.argv.slice(2);
  const arg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  assertEmulatorOnly({ firestorePort: arg("--firestore-port"), authPort: arg("--auth-port") });
  console.log(`[OK] Emulator only: Firestore ${process.env.FIRESTORE_EMULATOR_HOST}, Auth ${process.env.FIREBASE_AUTH_EMULATOR_HOST}`);
}
