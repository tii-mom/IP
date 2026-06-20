import dns from 'dns';

// Ensure localhost resolves cleanly
dns.setDefaultResultOrder('ipv4first');

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSmokeTests() {
  console.log('🚀 Starting Business Audit API Smoke Tests...');

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

  // Define testing matrix for the three modes
  const testModes = [
    {
      mode: 'quick_scan',
      selectedMentors: [],
      expectedMentorsCount: 1 // Defaults to solo Naval Ravikant
    },
    {
      mode: 'single_mentor',
      selectedMentors: ['steve_jobs'],
      expectedMentorsCount: 1 // Steve Jobs
    },
    {
      mode: 'mentor_board',
      selectedMentors: ['elon_musk', 'jeff_bezos', 'mark_zuckerberg'],
      expectedMentorsCount: 3 // Board of 3
    }
  ];

  for (const t of testModes) {
    console.log(`\n🔍 Testing mode: "${t.mode}" with mentors:`, t.selectedMentors);

    try {
      const analyzeResponse = await fetch('http://localhost:8787/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: 'example.com',
          projectType: 'SaaS',
          audience: 'indie developers',
          details: 'smoke test evaluation',
          analysisMode: t.mode,
          selectedMentors: t.selectedMentors
        })
      });

      if (!analyzeResponse.ok) {
        throw new Error(`Analyze endpoint returned status ${analyzeResponse.status}`);
      }

      const report = await analyzeResponse.json();

      // Enforce the BusinessAuditResult schema keys validation
      const keysToCheck = [
        'projectName', 'url', 'score', 'grade',
        'summary', 'metrics', 'moneyPaths',
        'targetBuyers', 'advantageMap', 'growthLevers',
        'mentorReports', 'actionPlan', 'riskWarnings'
      ];

      for (const k of keysToCheck) {
        if (!(k in report)) {
          throw new Error(`Missing expected BusinessAuditResult key: "${k}"`);
        }
      }

      // Check metrics structure
      if (typeof report.metrics.commercialValue !== 'number') {
        throw new Error('metrics.commercialValue is missing or not a number.');
      }

      // Check arrays are populated
      if (!Array.isArray(report.moneyPaths) || report.moneyPaths.length === 0) {
        throw new Error('moneyPaths is empty or not an array.');
      }
      if (!Array.isArray(report.targetBuyers) || report.targetBuyers.length === 0) {
        throw new Error('targetBuyers is empty or not an array.');
      }
      if (!Array.isArray(report.growthLevers) || report.growthLevers.length === 0) {
        throw new Error('growthLevers is empty or not an array.');
      }

      // Advantage map checks
      if (!report.advantageMap.strongestAsset || !Array.isArray(report.advantageMap.howToAmplify)) {
        throw new Error('advantageMap properties are invalid.');
      }

      // Check mentorReports count
      if (!Array.isArray(report.mentorReports) || report.mentorReports.length !== t.expectedMentorsCount) {
        throw new Error(`Expected ${t.expectedMentorsCount} mentor reports, got ${report.mentorReports?.length}`);
      }

      // Verify no visual coordinates / hotspots visual audits references exist in metrics
      if ('hotspots' in report || 'willingnessToPay' in report.metrics) {
        throw new Error('Visual hotspots / LP Conversion layout metrics found in report payload!');
      }

      console.log(`✅ Mode "${t.mode}" passed. Project Name: "${report.projectName}", Score: ${report.score}, Mentors count: ${report.mentorReports.length}`);
    } catch (err) {
      console.error(`❌ Test failed for mode "${t.mode}":`, err.message);
      process.exit(1);
    }
  }

  console.log('\n🎉 All 3 Modes Smoke Tests completed successfully!');
  process.exit(0);
}

runSmokeTests();
