import assert from "node:assert/strict";
import { test } from "node:test";
import { caseStudies } from "../src/content/case-studies.js";

test("case-study evidence links have labels and HTTPS destinations", () => {
  const studies = Object.entries(caseStudies).filter(([, study]) => study.evidence?.length);
  assert.ok(studies.length > 0, "expected case studies to expose inspectable evidence");

  for (const [studyId, study] of studies) {
    for (const item of study.evidence) {
      assert.ok(item.label.trim(), `${studyId} evidence needs a label`);
      assert.equal(new URL(item.href).protocol, "https:", `${studyId} evidence must use HTTPS`);
    }
  }
});

test("the named portfolio scenario is explicitly disclosed as fictional", () => {
  const scenario = caseStudies["ethio-sunshine-tech-solution"].scenario;

  assert.match(scenario.text, /\bHana\b/);
  assert.match(scenario.disclosure, /fictional example/i);
  assert.match(scenario.disclosure, /not a real customer/i);
  assert.match(scenario.disclosure, /usage claim/i);
});
