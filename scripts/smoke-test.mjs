import { spawn } from 'child_process';
import dns from 'dns';

// Ensure localhost resolves cleanly
dns.setDefaultResultOrder('ipv4first');

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSmokeTests() {
  console.log('🚀 Starting API Smoke Tests...');

  // Wait for wrangler dev server to be ready with retries
  let maxRetries = 15;
  let healthy = false;
  let healthData = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const healthResponse = await fetch('http://localhost:8787/healthz');
      if (healthResponse.ok) {
        healthData = await healthResponse.json();
        healthy = true;
        break;
      }
    } catch (e) {
      // Server not ready yet
    }
    console.log(`[Attempt ${i + 1}/${maxRetries}] Waiting for Wrangler local dev server...`);
    await wait(1000);
  }

  if (!healthy) {
    console.error('❌ Timeout: Wrangler local dev server was not ready on http://localhost:8787');
    process.exit(1);
  }

  console.log('✅ Healthcheck passed:', healthData);

  // 2. Perform analysis test fetch
  try {
    const analyzeResponse = await fetch('http://localhost:8787/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'example.com',
        projectType: 'SaaS',
        audience: 'indie hackers',
        details: 'automated smoke test payload'
      })
    });

    if (!analyzeResponse.ok) {
      throw new Error(`Analyze endpoint returned status ${analyzeResponse.status}`);
    }

    const analyzeData = await analyzeResponse.json();
    if (!analyzeData.projectName || typeof analyzeData.score !== 'number') {
      throw new Error('Analyze response structure did not match AuditResult spec.');
    }
    console.log('✅ Analyze endpoint passed. Project name:', analyzeData.projectName, 'Score:', analyzeData.score);
  } catch (err) {
    console.error('❌ Analyze test failed:', err.message);
    process.exit(1);
  }

  console.log('🎉 All API Smoke Tests completed successfully!');
  process.exit(0);
}

runSmokeTests();
