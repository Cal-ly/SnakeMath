Based on the workflow history, the **two latest workflow runs failed** on commit `045d10120c088d3a862f15a956ccb75444eff334` (feature:  add SamplingView component). Both workflows failed due to **ESLint errors** during the linting step.  Here's a detailed breakdown:

---

## Failed Workflows Summary

### 1. **CI Workflow** (Run #21130796365)
- **URL**: https://github.com/Cal-ly/SnakeMath/actions/runs/21130796365
- **Workflow File**: `.github/workflows/test.yml`
- **Status**: Failed
- **Started**: 2026-01-19T08:42:24Z

### 2. **Deploy to GitHub Pages** (Run #21130796386)
- **URL**: https://github.com/Cal-ly/SnakeMath/actions/runs/21130796386
- **Workflow File**: `.github/workflows/deploy.yml`
- **Status**: Failed
- **Started**: 2026-01-19T08:42:24Z

---

## Root Cause:  ESLint Errors

Both workflows failed during the `eslint .  --cache` command with **17 linting errors** across 6 files.  The failures are **identical** in both runs, indicating the same codebase issues.

---

## Detailed Error Breakdown

### **Error Type 1: Unused Variables (@typescript-eslint/no-unused-vars)**
Variables are defined/assigned but never used.  Per project rules, unused variables must be prefixed with underscore (`_`).

#### Files and Lines:
1. **`e2e/statistics/hypothesis-testing.spec.ts`**
   - **Line 462**: `'comingSoonText'` is assigned but never used

2. **`src/components/widgets/HypothesisTestingSimulator/TestTypeSelector.vue`**
   - **Line 10**: `'props'` is assigned but never used

3. **`src/components/widgets/HypothesisTestingSimulator/TypeErrorDemo.vue`**
   - **Line 49**: `'criticalZ'` is assigned but never used

4. **`src/composables/useHypothesisTesting.ts`**
   - **Line 10**:  `'sampleSizeForProportions'` is defined but never used
   - **Line 12**: `'cohensD'` is defined but never used
   - **Line 13**: `'cohensDTwoGroups'` is defined but never used
   - **Line 14**: `'cohensH'` is defined but never used
   - **Line 15**: `'interpretCohensD'` is defined but never used
   - **Line 16**: `'interpretCohensH'` is defined but never used
   - **Line 33**: `'standardNormalCdf'` is defined but never used

5. **`src/utils/math/hypothesis.ts`**
   - **Line 15**: `'erf'` is defined but never used
   - **Line 119**: `'SQRT_2'` is assigned but never used
   - **Line 120**: `'SQRT_2_PI'` is assigned but never used
   - **Line 1182**: `'directionText'` is assigned but never used

---

### **Error Type 2: Missing Return Values in Computed Properties (vue/return-in-computed-property)**
Vue computed functions must always return a value. 

#### File and Lines:
**`src/composables/useHypothesisTesting.ts`**
   - **Line 151**: Expected to return a value in computed function (column 65)
   - **Line 267**: Expected to return a value in computed function (column 35)

---

### **Error Type 3: Vue Template Parsing Error (vue/no-parsing-error)**
Invalid character in Vue template tag name.

#### File and Line:
**`src/components/widgets/HypothesisTestingSimulator/PowerAnalysis.vue`**
   - **Line 331**:  Parsing error at column 49 - `invalid-first-character-of-tag-name`

---

## Handover Instructions for Coding Assistant

### **Task**: Fix all ESLint errors to make CI/CD pipelines pass

### **Files to Modify** (6 files total):

#### 1. **`e2e/statistics/hypothesis-testing.spec.ts`**
   - **Line 462**:  Prefix `comingSoonText` with underscore → `_comingSoonText`

#### 2. **`src/components/widgets/HypothesisTestingSimulator/TestTypeSelector.vue`**
   - **Line 10**: Prefix `props` with underscore → `_props` (or remove if truly unused)

#### 3. **`src/components/widgets/HypothesisTestingSimulator/TypeErrorDemo.vue`**
   - **Line 49**:  Prefix `criticalZ` with underscore → `_criticalZ`

#### 4. **`src/composables/useHypothesisTesting.ts`** (MAJOR FILE - 9 errors)
   - **Lines 10, 12-16, 33**: Prefix unused exports with underscore: 
     - `sampleSizeForProportions` → `_sampleSizeForProportions`
     - `cohensD` → `_cohensD`
     - `cohensDTwoGroups` → `_cohensDTwoGroups`
     - `cohensH` → `_cohensH`
     - `interpretCohensD` → `_interpretCohensD`
     - `interpretCohensH` → `_interpretCohensH`
     - `standardNormalCdf` → `_standardNormalCdf`
   
   - **Lines 151 & 267**: Fix computed functions to always return a value
     - Inspect the logic at these lines and ensure all code paths return a value
     - Example fix: Add explicit `return undefined` if needed

#### 5. **`src/utils/math/hypothesis.ts`**
   - **Lines 15, 119, 120, 1182**:  Prefix unused variables with underscore:
     - `erf` → `_erf`
     - `SQRT_2` → `_SQRT_2`
     - `SQRT_2_PI` → `_SQRT_2_PI`
     - `directionText` → `_directionText`

#### 6. **`src/components/widgets/HypothesisTestingSimulator/PowerAnalysis.vue`**
   - **Line 331, column 49**: Fix invalid template character
     - Inspect the template tag at this location
     - Likely a malformed HTML/Vue tag (e.g., `<` or invalid character in tag name)
     - Common issues: stray `<` characters, incorrect tag nesting, or invalid tag names

---

### **Verification Steps**:
1. Run `eslint . --cache` locally to verify all errors are resolved
2. Ensure no new errors are introduced
3. Commit changes with message:  `fix:  resolve ESLint errors in hypothesis testing components`
4. Push to trigger CI/CD workflows

---

### **Project Context**:
- The project follows a strict ESLint convention:  **unused variables must be prefixed with `_`**
- This is enforced by the `@typescript-eslint/no-unused-vars` rule with pattern `/^_/u`
- The errors were introduced in the latest commit adding the SamplingView component
- Previous commits (e.g., `31776df47a2ff31fcbfa82a5a150c6f07685335c`) had passing workflows

---

**Note**: There are 63 total workflow runs in the repository. The response only includes the latest 30 results.  View all workflow runs here: https://github.com/Cal-ly/SnakeMath/actions