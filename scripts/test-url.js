import { normalizeUrlForHref, displayUrl } from '../src/lib/url.ts';

const testCases = [
  { input: 'smt.it.com', expectedHref: 'https://smt.it.com', expectedDisplay: 'smt.it.com' },
  { input: 'https://smt.it.com/', expectedHref: 'https://smt.it.com/', expectedDisplay: 'smt.it.com' },
  { input: 'http://smt.it.com', expectedHref: 'http://smt.it.com', expectedDisplay: 'smt.it.com' },
  { input: 'https//smt.it.com', expectedHref: 'https://smt.it.com', expectedDisplay: 'smt.it.com' },
  { input: 'http//smt.it.com', expectedHref: 'http://smt.it.com', expectedDisplay: 'smt.it.com' },
  { input: 'https:/smt.it.com', expectedHref: 'https://smt.it.com', expectedDisplay: 'smt.it.com' },
  { input: 'http:/smt.it.com', expectedHref: 'http://smt.it.com', expectedDisplay: 'smt.it.com' },
];

console.log('🧪 Running URL Normalizer Tests...');
let failures = 0;

for (const tc of testCases) {
  const actualHref = normalizeUrlForHref(tc.input);
  const actualDisplay = displayUrl(tc.input);

  if (actualHref !== tc.expectedHref) {
    console.error(`❌ Fail [Href]: "${tc.input}" -> Expected "${tc.expectedHref}", got "${actualHref}"`);
    failures++;
  } else if (actualDisplay !== tc.expectedDisplay) {
    console.error(`❌ Fail [Display]: "${tc.input}" -> Expected "${tc.expectedDisplay}", got "${actualDisplay}"`);
    failures++;
  } else {
    console.log(`✅ Pass: "${tc.input}" -> Href: "${actualHref}" | Display: "${actualDisplay}"`);
  }
}

if (failures > 0) {
  console.error(`\n❌ Tests failed with ${failures} errors.`);
  process.exit(1);
} else {
  console.log('\n🎉 All URL tests passed successfully!');
  process.exit(0);
}
