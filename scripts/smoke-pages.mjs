import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transform } from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const targets = [
  'src/modules/sales/pages/SalesMaterialsPage.jsx',
  'src/modules/master/pages/PerformancePlanPage.jsx',
  'src/modules/delivery/pages/DemandForecastPage.jsx',
  'src/modules/delivery/components/spec/SpecRegistrationList.jsx',
  'src/modules/delivery/components/spec/CancelledSpecList.jsx',
  'src/modules/partner/pages/PartnerNoticePage.jsx',
  'src/modules/sales/pages/SalesProfitAnalysisPage.jsx',
  'src/modules/sales/pages/SalesProfitAnalysisDetailPage.jsx',
];

const failures = [];

for (const rel of targets) {
  const fullPath = path.join(root, rel);
  try {
    const source = await fs.readFile(fullPath, 'utf8');
    await transform(source, {
      loader: rel.endsWith('.jsx') ? 'jsx' : 'js',
      jsx: 'automatic',
      sourcemap: false,
      sourcefile: rel,
    });
    console.log(`OK  ${rel}`);
  } catch (error) {
    failures.push({ rel, error });
    console.error(`FAIL ${rel}`);
    console.error(error.message);
  }
}

if (failures.length > 0) {
  console.error(`\n${failures.length}개 파일에서 스모크 체크 실패`);
  process.exit(1);
}

console.log('\n스모크 체크 통과');
