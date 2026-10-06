import test from "node:test";
import assert from "node:assert/strict";
import { catalogue, seed, validateNotes } from "../src/data.ts";

test("prohibited objects cannot pass the demo notes check", () => {
  for (const object of [
    "fire extinguisher",
    "candle",
    "bottle",
    "knife",
    "aerosol can",
    "sharp object",
    "household object",
    "glass",
    "pressurised container",
    "drugs",
    "coercion",
    "minors",
  ]) {
    assert.notEqual(validateNotes(`Please use a ${object}`), "", object);
  }
});

test("a respectful note is permitted", () => {
  assert.equal(
    validateNotes(
      "Respect the agreed boundaries. You can stop whenever you choose.",
    ),
    "",
  );
});

test("all seeded requests use catalogue products and their permitted category", () => {
  for (const request of seed.requests) {
    const product = catalogue.find((item) => item.id === request.productId);
    assert.ok(product);
    assert.equal(request.category, product.category);
  }
});
