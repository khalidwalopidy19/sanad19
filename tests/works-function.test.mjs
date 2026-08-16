import assert from "node:assert/strict";

process.env.SANAD_API_BASE_URL = "http://127.0.0.1:3000";

const { default: worksHandler } = await import("../netlify/functions/works.mjs");
const response = await worksHandler();
const payload = await response.json();

assert.equal(response.status, 200);
assert.equal(payload.configured, true);
assert.ok(Array.isArray(payload.works));

console.log("Netlify public works function test passed.");
