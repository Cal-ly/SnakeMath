## Failed Workflow Runs

### 1. **CI Workflow** (Run #16)
- **URL**: https://github.com/Cal-ly/SnakeMath/actions/runs/21102936790
- **Status**: ❌ Failed
- **Commit**: `472bbbe` - "style: update component styles to use borders instead of background colors for better visibility"
- **Workflow**: `.github/workflows/test.yml`

### 2. **Deploy to GitHub Pages** (Run #28)
- **URL**: https://github.com/Cal-ly/SnakeMath/actions/runs/21102936776
- **Status**: ❌ Failed
- **Commit**:  `472bbbe` - Same commit as above
- **Workflow**:  `.github/workflows/deploy.yml`

Let me get more details about why these specific workflows failed: Based on the workflow logs, I can now explain why the workflows failed the last two times:

## Workflow Failures Summary

Both workflow runs failed for the **same reason**: an ESLint parsing error in the codebase. The last two failed runs were:

1. **[Run #16 - CI workflow](https://github.com/Cal-ly/SnakeMath/actions/runs/21102936790)** (triggered by commit `472bbbe` - "style: update component styles")
2. **[Run #28 - Deploy to GitHub Pages workflow](https://github.com/Cal-ly/SnakeMath/actions/runs/21102936776)** (same commit)

### Root Cause

**Critical Error:**
```
/src/views/algebra/QuadraticsView.vue
Line 150:32 - error:  Parsing error: invalid-first-character-of-tag-name
```

This is a **parsing error** in the `QuadraticsView.vue` file at line 150, character 32. The error indicates an invalid character at the start of a tag name, which is preventing the Vue template from being parsed correctly.

### Additional Warnings (non-blocking)

There were also 5 warnings:
- **3 console statement warnings** in `e2e/accessibility/audit.spec.ts` (lines 36, 38, 39) - using `console.log` instead of `console.warn` or `console.error`
- **1 XSS warning** in `src/components/content/MathBlock.vue` (line 69) - using `v-html` directive

---

**Note:** The API returned 30 workflow runs out of 43 total. You can view all runs at: https://github.com/Cal-ly/SnakeMath/actions

To fix this issue, you'll need to inspect line 150 in `src/views/algebra/QuadraticsView.vue` and correct the invalid tag character. 

Perfect! I found the issue. Let me analyze the error:

## Detailed Error Analysis

### The Problem (Line 150)

Looking at **line 150**, column 32: 

```vue
When <code>b² - 4ac < 0</code>, the roots are complex numbers—<code>math.sqrt()</code>
```

The issue is the **`<`** character at column 32. In Vue templates, `<` is interpreted as the start of an HTML tag, which breaks the parser when it's used as a comparison operator inside text.

### Root Cause

Vue's template parser sees `< 0` and thinks you're starting a tag called `0`, which is invalid. The parser error "invalid-first-character-of-tag-name" confirms this - tag names can't start with a number.

---

## Possible Fixes

Here are **three solutions** you can choose from:

### **Fix 1: Use HTML Entity (Recommended)**

Replace `<` with the HTML entity `&lt;`:

```vue
<p class="text-sm text-amber-600 dark:text-amber-400">
  When <code>b² - 4ac &lt; 0</code>, the roots are complex numbers—<code>math.sqrt()</code>
  will raise an error! Use <code>cmath.sqrt()</code> or check the discriminant first.
  Real parabolas that never cross the x-axis have imaginary roots.
</p>
```

### **Fix 2: Use MathBlock Component**

Since you already have a `MathBlock` component for mathematical expressions, use it for consistency:

```vue
<p class="text-sm text-amber-600 dark:text-amber-400">
  When <MathBlock formula="b^2 - 4ac < 0" />, the roots are complex numbers—<code>math.sqrt()</code>
  will raise an error! Use <code>cmath.sqrt()</code> or check the discriminant first.
  Real parabolas that never cross the x-axis have imaginary roots.
</p>
```

### **Fix 3: Use v-text or Template Interpolation**

Extract the text to a variable and use `v-text` or template syntax:

```vue
<script setup lang="ts">
// ...  existing code ... 
const discriminantNote = 'When b² - 4ac < 0, the roots are complex numbers—math.sqrt() will raise an error!'
</script>

<template>
  <p class="text-sm text-amber-600 dark:text-amber-400">
    {{ discriminantNote }} Use <code>cmath.sqrt()</code> or check the discriminant first.
    Real parabolas that never cross the x-axis have imaginary roots.
  </p>
</template>
```

---

## Bonus: Fix Additional Warnings

While you're at it, here are the non-critical warnings you should also address:

### 1. **Console Statements** (e2e/accessibility/audit.spec.ts)

Change `console.log` to `console.warn` or `console.error` on lines 36, 38, and 39:

```typescript
// Before: 
console.log(violations)

// After:
console.warn(violations)
```

### 2. **v-html XSS Warning** (src/components/content/MathBlock.vue, line 69)

If you're using `v-html`, add a comment to acknowledge the risk, or better yet, sanitize the HTML:

```vue
<!-- eslint-disable-next-line vue/no-v-html -->
<div v-html="sanitizedHtml"></div>
```

Or use a sanitization library like DOMPurify:

```typescript
import DOMPurify from 'dompurify'
const sanitizedHtml = computed(() => DOMPurify.sanitize(rawHtml.value))
```

---

## Quick Action Items

1. **Fix line 150**:  Replace `<` with `&lt;` in QuadraticsView.vue
2. **Fix console statements**: Change `console.log` to `console.warn` in audit.spec.ts
3. **Address v-html**:  Add eslint-disable comment or sanitize the HTML in MathBlock.vue

The first fix will resolve the build failure.  The others will clean up warnings for a cleaner CI run.