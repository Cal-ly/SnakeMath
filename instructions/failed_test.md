# 🔍 Tests Workflow Failure Analysis - SnakeMath

## 📊 Current State

**Latest Failed Run**:  [#21066281314](https://github.com/Cal-ly/SnakeMath/actions/runs/21066281314) (commit `756351ff`)
- **Total Duration**: 18 minutes
- **Result**: ❌ 33 tests failed, 38 passed
- **Commit Message**: "feat: add QuadraticExplorer component with presets and URL syncing"

**Note**: You have 17 total workflow runs.  [View all runs →](https://github.com/Cal-ly/SnakeMath/actions/workflows/test.yml)

---

## 🚨 Root Cause Analysis

### **Primary Issue:  Missing `data-testid` Attributes in QuadraticExplorer Component**

All 33 failures are related to the newly added **QuadraticExplorer** widget, which was introduced in commit `756351ff`. The component **lacks the required test attributes** that tests are expecting. 

### **Failed Test Categories**:

| Category | Failed Tests | Error Type |
|----------|-------------|------------|
| **Functional E2E** | 14 tests | `Test timeout of 30000ms exceeded` |
| **Visual Regression** | 19 tests | `Test timeout` or `toHaveScreenshot failed` |

---

## 🔬 Detailed Failure Analysis

### **1. Timeout Failures** (Most Common)

**Pattern**: Tests wait 30 seconds for elements that don't exist

```
Error: locator.selectOption: Test timeout of 30000ms exceeded. 
Call log:
  - waiting for locator('[data-testid="preset-selector"]')
```

**Missing `data-testid` Attributes**:
- ❌ `preset-selector` 
- ❌ `coefficient-a-slider`
- ❌ `coefficient-b-slider`
- ❌ `coefficient-c-slider`
- ❌ `equation-standard`
- ❌ `equation-vertex`
- ❌ `equation-factored`
- ❌ `vertex-display`
- ❌ `discriminant-value`
- ❌ `roots-display`

**Current Implementation** (`QuadraticExplorer.vue`):
```vue
<div class="quadratic-explorer" data-testid="quadratic-explorer">
  <!-- ✅ Has testid -->
  <PresetSelector : model-value="currentPreset" @update:model-value="handlePresetChange" />
  <!-- ❌ PresetSelector likely missing data-testid="preset-selector" internally -->
</div>
```

---

### **2. Visual Regression Failures**

**Tests affected** (examples):
- `QuadraticExplorer › default preset`
- `QuadraticExplorer › projectile preset`
- `QuadraticExplorer › complex roots`

**Issue**: Even when screenshots are attempted, elements time out before rendering because: 
1. Tests can't interact with controls (missing testids)
2. Component state doesn't update as expected
3. Screenshots capture partial/broken states

---

### **3. Cascading Failures**

**Retry Mechanism**:  Playwright retries failed tests once (configured with `retries: 1` in CI)
- Each failed test runs **twice** (initial + 1 retry)
- 33 failed tests × 2 runs × ~30s timeout = **~33 minutes of wasted time**
- Actual workflow ran 18 minutes because tests ran in parallel

---

## ⏱️ Performance Breakdown

### **Current Workflow Architecture**

```yaml
jobs:
  unit-tests:        # Job 1 (parallel)
  e2e-tests:         # Job 2 (parallel) - FAILING
  visual-regression:  # Job 3 (parallel) - FAILING
```

**Why 18 Minutes?**

| Phase | Duration | Notes |
|-------|----------|-------|
| **Setup** | ~2 min | Checkout, Node install, npm ci |
| **Playwright Install** | ~1 min | Browser + deps (~400MB) |
| **Build** | ~30s | Vite production build |
| **E2E Tests** | ~15 min | 33 timeouts × 30s each (with retries) |
| **Artifact Upload** | ~30s | Playwright reports on failure |

**Parallel Execution**: The 3 jobs run concurrently, but **e2e-tests** and **visual-regression** both take ~18 minutes due to QuadraticExplorer timeouts.

---

## 🎯 Why Deployment Succeeded While Tests Failed

**Different Workflows**:
- **Deploy Workflow** (`deploy.yml`): Runs basic unit tests (`npm run test`) ✅ Passed
- **Tests Workflow** (`test.yml`): Runs comprehensive E2E + visual tests ❌ Failed

**Deploy workflow doesn't block on E2E failures**, which means:
- ⚠️ Broken QuadraticExplorer was deployed to production
- Users may experience broken interactions
- This is a **configuration design choice** (not a bug)

---

## 💡 Recommendations

### **🔴 Critical:  Fix Test Failures (Immediate)**

#### **A. Add Missing `data-testid` Attributes**

**Files to update**: 

1. **`PresetSelector.vue`**
```js
<select 
  v-model="selectedPreset" 
  data-testid="preset-selector"  <!-- ADD THIS -->
  class="... ">
```

2. **`CoefficientControls.vue`**
```js
<input 
  type="range" 
  v-model="a" 
  data-testid="coefficient-a-slider"  <!-- ADD THIS -->
/>
<input 
  type="range" 
  v-model="b" 
  data-testid="coefficient-b-slider"  <!-- ADD THIS -->
/>
<input 
  type="range" 
  v-model="c" 
  data-testid="coefficient-c-slider"  <!-- ADD THIS -->
/>
```

3. **`EquationDisplay.vue`**
```js
<div data-testid="equation-standard">{{ standardForm }}</div>
<div data-testid="equation-vertex">{{ vertexForm }}</div>
<div data-testid="equation-factored">{{ factoredForm }}</div>
```

4. **`AnalysisPanel.vue`**
```js 
<div data-testid="vertex-display">{{ vertex }}</div>
<div data-testid="discriminant-value">Δ = {{ discriminant }}</div>
<div data-testid="roots-display">{{ rootsText }}</div>
```

---

### **🟡 High Priority:  Prevent Future Failures**

#### **B. Make Deployment Dependent on Tests**

**Update `deploy.yml`**:

```yaml
jobs:
  # Add a new job that waits for tests
  wait-for-tests:
    runs-on: ubuntu-latest
    steps:
      - name: Wait for Tests Workflow
        uses: lewagon/wait-on-check-action@v1.3.1
        with:
          ref:  ${{ github.ref }}
          check-name: 'Tests'
          repo-token: ${{ secrets. GITHUB_TOKEN }}
          wait-interval: 20

  build:
    needs: wait-for-tests  # ← Add this dependency
    runs-on: ubuntu-latest
    # ... rest of build job
```

**Alternative**: Use a single workflow with sequential jobs:
```yaml
jobs:
  test:
    # All tests here
  
  deploy:
    needs: test  # Only runs if tests pass
    # Deployment here
```

---

### **🟢 Medium Priority: Optimize Test Performance**

#### **C.  Reduce E2E Test Timeouts**

**Current**: 30 seconds per test (Playwright default)

**Recommended**: Update `playwright.config.ts`:
```typescript
export default defineConfig({
  timeout: 10000,  // 10s instead of 30s
  expect: {
    timeout: 5000,  // 5s for assertions
  },
  // ... rest
})
```

**Impact**: 18 minutes → **~7 minutes** for failing builds

---

#### **D. Separate Visual Tests from E2E Tests**

**Current**: Both run in parallel but take same time

**Recommended Workflow Structure**:
```yaml
jobs:
  unit-tests:
    # Fast:  ~1 minute

  e2e-tests: 
    # Medium: ~3-5 minutes (functional only)

  visual-regression: 
    needs: e2e-tests  # Only run if E2E passes
    # Slow: ~8-10 minutes (screenshots)
```

**Benefits**:
- Fail fast on functional issues (3-5 min instead of 18 min)
- Skip expensive visual tests if basic functionality breaks
- Save ~30% CI minutes

---

#### **E. Implement Visual Test Sharding**

**Current**: All visual tests run serially

**Update `test.yml` for visual job**:
```yaml
visual-regression:
  runs-on: ubuntu-latest
  strategy:
    matrix:
      shardIndex: [1, 2, 3, 4]
      shardTotal: [4]
  steps:
    - run: npm run test:visual -- --shard=${{ matrix.shardIndex }}/${{ matrix.shardTotal }}
```

**Impact**: 18 minutes → **~5 minutes** (with 4 parallel runners)

---

#### **F. Add Smoke Tests (Pre-Flight Checks)**

**Create `e2e/smoke.spec.ts`**:
```typescript
test. describe('Smoke Tests', () => {
  test('all widgets load without timeout', async ({ page }) => {
    // Quick checks for critical paths
    await page.goto('/basics/number-types')
    await expect(page.locator('[data-testid="number-input"]')).toBeVisible({ timeout: 5000 })
    
    await page.goto('/algebra/summation')
    await expect(page.locator('[data-testid="preset-selector"]')).toBeVisible({ timeout: 5000 })
    
    await page.goto('/algebra/quadratics')
    await expect(page.locator('[data-testid="quadratic-explorer"]')).toBeVisible({ timeout: 5000 })
  })
})
```

**Run smoke tests first** to catch major breakages in <2 minutes.

---

### **🔵 Low Priority:  Developer Experience**

#### **G. Add Pre-Push Git Hook**

**Install Husky**:
```bash
npm install --save-dev husky
npx husky init
```

**`.husky/pre-push`**:
```bash
#!/bin/sh
npm run lint: check
npm run type-check
npm run test
```

**Benefit**: Catch issues locally before CI runs

---

#### **H. Add Test Coverage Enforcement**

**Update `vitest.config.ts`**:
```typescript
coverage: {
  statements: 70,
  branches: 60,
  functions: 70,
  lines: 70,
  thresholds: {
    global: {
      statements: 70,
    }
  }
}
```

**Add to `test.yml`**:
```yaml
- run: npm run test:coverage
- name: Check coverage thresholds
  run: npx vitest run --coverage --coverage. thresholds.global.statements=70
```

---

## 📈 Expected Improvements

| Metric | Current | After Fixes | After Optimization |
|--------|---------|-------------|-------------------|
| **Failed Build Time** | 18 min | 0 min (fixed) | N/A |
| **Passing Build Time** | ~5 min | ~5 min | **~3 min** |
| **Failure Detection** | 18 min | 18 min | **~2 min** (smoke tests) |
| **CI Cost** | High | Medium | **Low** (sharding) |
| **Developer Feedback** | Slow | Fast | **Immediate** (pre-push) |

---

## 🛠️ Implementation Priority

### **Phase 1: Fix Failures** (Today)
1. ✅ Add `data-testid` attributes to QuadraticExplorer components
2. ✅ Verify tests pass locally:  `npm run test:e2e`
3. ✅ Push fix and verify CI passes

### **Phase 2: Prevent Failures** (This Week)
1. ⚙️ Make deployment dependent on tests
2. ⚙️ Reduce test timeouts to 10s
3. ⚙️ Add smoke tests

### **Phase 3: Optimize Performance** (Next Sprint)
1. 🚀 Implement visual test sharding
2. 🚀 Separate visual from E2E in workflow
3. 🚀 Add pre-push hooks

---

## 📚 Additional Context

**Workflow runs are limited**:  Only showing 5 of 17 total runs in API response.  
[View complete workflow history →](https://github.com/Cal-ly/SnakeMath/actions/workflows/test. yml)

**Search limitations**: Test file searches were capped at 10 results.  
[Search all test files →](https://github.com/Cal-ly/SnakeMath/search?q=path%3Ae2e+*. spec.ts)

---

**Summary**: The 18-minute failure is caused by 33 tests timing out while waiting for missing `data-testid` attributes in the QuadraticExplorer component. Fix the component markup first, then implement workflow improvements to prevent similar issues and reduce CI time by ~70%. 