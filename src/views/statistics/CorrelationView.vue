<script setup lang="ts">
import TopicPage from '@/components/content/TopicPage.vue'
import ContentSection from '@/components/content/ContentSection.vue'
import MathBlock from '@/components/content/MathBlock.vue'
import CodeExample from '@/components/content/CodeExample.vue'
import RelatedTopics from '@/components/content/RelatedTopics.vue'
import { CorrelationExplorer } from '@/components/widgets/CorrelationExplorer'

const relatedTopics = [
  {
    title: 'Statistics Overview',
    path: '/statistics',
    description: 'All statistics topics',
  },
  {
    title: 'Hypothesis Testing',
    path: '/statistics/hypothesis-testing',
    description: 'Statistical significance and testing',
  },
  {
    title: 'Descriptive Statistics',
    path: '/statistics/descriptive',
    description: 'Mean, variance, and data summaries',
  },
  {
    title: 'Probability Distributions',
    path: '/statistics/distributions',
    description: 'PDF, CDF, and probability',
  },
]

// Python code examples
const correlationCode = `import numpy as np
from scipy import stats

# Sample data: study hours and exam scores
study_hours = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
exam_scores = np.array([52, 58, 65, 68, 72, 78, 82, 88, 91, 95])

# Calculate Pearson correlation
r, p_value = stats.pearsonr(study_hours, exam_scores)

print(f"Correlation (r): {r:.4f}")
print(f"p-value: {p_value:.6f}")
print(f"R² (variance explained): {r**2:.2%}")

# Interpretation
if abs(r) < 0.3:
    strength = "weak"
elif abs(r) < 0.7:
    strength = "moderate"
else:
    strength = "strong"
direction = "positive" if r > 0 else "negative"
print(f"Interpretation: {strength} {direction} correlation")`

const regressionCode = `import numpy as np
from scipy import stats

# Same data
x = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11])
y = np.array([52, 58, 65, 68, 72, 78, 82, 88, 91, 95])

# Linear regression using scipy
slope, intercept, r, p_value, std_err = stats.linregress(x, y)

print(f"Regression equation: ŷ = {slope:.3f}x + {intercept:.3f}")
print(f"Slope: {slope:.3f} (each hour → {slope:.1f} more points)")
print(f"Intercept: {intercept:.3f}")
print(f"R²: {r**2:.2%}")
print(f"Standard error of slope: {std_err:.4f}")

# Make predictions
new_hours = np.array([5, 8, 12])
predicted_scores = slope * new_hours + intercept
print(f"\\nPredictions:")
for h, s in zip(new_hours, predicted_scores):
    print(f"  {h} hours → {s:.1f} points")

# Calculate residuals
predicted = slope * x + intercept
residuals = y - predicted
print(f"\\nResidual statistics:")
print(f"  Mean residual: {residuals.mean():.4f} (should be ~0)")
print(f"  Std of residuals: {residuals.std():.4f}")`

const sklearnCode = `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score, mean_squared_error

# Sample data
X = np.array([2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).reshape(-1, 1)
y = np.array([52, 58, 65, 68, 72, 78, 82, 88, 91, 95])

# Fit model
model = LinearRegression()
model.fit(X, y)

# Model parameters
print("Linear Regression in scikit-learn")
print(f"Slope (coef_): {model.coef_[0]:.4f}")
print(f"Intercept: {model.intercept_:.4f}")
print(f"Equation: ŷ = {model.coef_[0]:.3f}x + {model.intercept_:.3f}")

# Predictions and metrics
y_pred = model.predict(X)
print(f"\\nModel metrics:")
print(f"R² score: {r2_score(y, y_pred):.4f}")
print(f"RMSE: {np.sqrt(mean_squared_error(y, y_pred)):.4f}")

# The ML connection: Linear regression = single-layer neural network!
# ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b
# This is literally: np.dot(X, weights) + bias`

const multipleRegressionCode = `import numpy as np
from sklearn.linear_model import LinearRegression

# Multiple regression: predict score from hours AND sleep
# This is literally a single linear layer in neural networks!
X = np.array([
    [2, 5],   # 2 hours study, 5 hours sleep
    [4, 6],
    [6, 7],
    [8, 8],
    [10, 6],
])
y = np.array([52, 65, 78, 88, 85])

model = LinearRegression()
model.fit(X, y)

print("Multiple Regression (2 predictors)")
print(f"Coefficients: {model.coef_}")
print(f"  w₁ (study hours): {model.coef_[0]:.3f}")
print(f"  w₂ (sleep hours): {model.coef_[1]:.3f}")
print(f"Intercept (bias): {model.intercept_:.3f}")

# The equation is:
# ŷ = w₁·study + w₂·sleep + b
# This is EXACTLY what a neural network linear layer does:
# output = np.dot(X, weights) + bias

print("\\n🧠 This IS a neural network linear layer:")
print(f"   output = X @ weights + bias")
print(f"   output = X @ {model.coef_} + {model.intercept_:.3f}")`
</script>

<template>
  <TopicPage
    title="Correlation & Regression"
    description="Measuring relationships between variables — the foundation of predictive modeling."
  >
    <div class="space-y-8">
      <!-- Introduction -->
      <ContentSection
        id="introduction"
        title="What is Correlation?"
        icon="fa-solid fa-link"
      >
        <p class="mb-4">
          <strong>Correlation</strong> measures whether two variables tend to move together.
          When one increases, does the other increase (positive), decrease (negative), or show no pattern (zero)?
        </p>

        <!-- Three analogies block -->
        <div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
          <div class="p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 class="font-semibold text-amber-700 dark:text-amber-400 mb-2">
              <i class="fa-solid fa-cloud-sun mr-2" aria-hidden="true" />
              Everyday Analogy
            </h4>
            <p class="text-sm text-amber-600 dark:text-amber-300">
              Temperature and ice cream sales: When it's hot, people buy more ice cream.
              These variables are <strong>positively correlated</strong>.
            </p>
          </div>
          <div class="p-4 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <h4 class="font-semibold text-emerald-700 dark:text-emerald-400 mb-2">
              <i class="fa-solid fa-code mr-2" aria-hidden="true" />
              Programming Analogy
            </h4>
            <p class="text-sm text-emerald-600 dark:text-emerald-300">
              Feature selection: "Which input variables are related to my target?"
              Correlation is how you identify useful features for your ML model.
            </p>
          </div>
          <div class="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 class="font-semibold text-blue-700 dark:text-blue-400 mb-2">
              <i class="fa-solid fa-brain mr-2" aria-hidden="true" />
              ML Connection
            </h4>
            <p class="text-sm text-blue-600 dark:text-blue-300">
              Linear regression is literally a single-layer neural network:
              <code class="text-xs">ŷ = w·x + b</code> — the simplest possible model!
            </p>
          </div>
        </div>

        <div class="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p class="font-medium text-primary mb-2">
            <i class="fa-solid fa-lightbulb mr-2" aria-hidden="true" />
            The Two Questions
          </p>
          <p class="text-text-secondary">
            <strong>Correlation</strong> answers: "Do these variables move together?"
            <br />
            <strong>Regression</strong> answers: "By how much, and can I predict one from the other?"
          </p>
        </div>
      </ContentSection>

      <!-- Pearson Correlation -->
      <ContentSection
        id="pearson"
        title="Pearson Correlation Coefficient"
        icon="fa-solid fa-arrows-left-right"
        collapsible
      >
        <p class="mb-4">
          The <strong>Pearson correlation coefficient (r)</strong> quantifies linear relationships
          between two continuous variables on a scale from -1 to +1.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <MathBlock
            formula="r = \frac{\sum_{i=1}^{n}(x_i - \bar{x})(y_i - \bar{y})}{\sqrt{\sum_{i=1}^{n}(x_i - \bar{x})^2} \cdot \sqrt{\sum_{i=1}^{n}(y_i - \bar{y})^2}}"
            display
          />
        </div>

        <div class="grid gap-4 md:grid-cols-3 mb-6">
          <div class="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-center">
            <p class="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">+1</p>
            <p class="text-sm text-text-secondary">Perfect positive</p>
            <p class="text-xs text-text-muted">As x ↑, y ↑ perfectly</p>
          </div>
          <div class="p-4 rounded-lg border border-gray-500/30 bg-gray-500/10 text-center">
            <p class="text-3xl font-bold text-text-secondary mb-1">0</p>
            <p class="text-sm text-text-secondary">No linear correlation</p>
            <p class="text-xs text-text-muted">x and y independent</p>
          </div>
          <div class="p-4 rounded-lg border border-red-500/30 bg-red-500/10 text-center">
            <p class="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">−1</p>
            <p class="text-sm text-text-secondary">Perfect negative</p>
            <p class="text-xs text-text-muted">As x ↑, y ↓ perfectly</p>
          </div>
        </div>

        <div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg mb-4">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
            <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
            Critical Limitation
          </p>
          <p class="text-sm text-amber-600 dark:text-amber-400">
            Pearson correlation only measures <strong>linear</strong> relationships.
            A perfect curve (like a parabola) can have r ≈ 0!
            Always visualize your data — correlation alone can be misleading.
          </p>
        </div>

        <CodeExample
          id="statistics-correlation-basic"
          title="correlation.py"
          language="python"
          :code="correlationCode"
        />
      </ContentSection>

      <!-- Interactive Widget -->
      <ContentSection
        id="explorer"
        title="Correlation Explorer"
        icon="fa-solid fa-chart-scatter"
      >
        <p class="mb-4">
          Explore correlation and regression interactively. Add points by clicking,
          drag points to see how they affect the statistics, and try the presets
          to see different patterns.
        </p>

        <CorrelationExplorer :sync-url="true" />
      </ContentSection>

      <!-- Linear Regression -->
      <ContentSection
        id="regression"
        title="Linear Regression"
        icon="fa-solid fa-chart-line"
        collapsible
      >
        <p class="mb-4">
          <strong>Linear regression</strong> fits a line through data to make predictions.
          It finds the slope (m) and intercept (b) that minimize the sum of squared errors.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <MathBlock formula="\hat{y} = mx + b" display />
          <p class="text-sm text-text-muted text-center mt-2">
            ŷ is the predicted value, m is the slope, b is the intercept
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">Slope (m)</p>
            <MathBlock
              formula="m = \frac{\sum(x_i - \bar{x})(y_i - \bar{y})}{\sum(x_i - \bar{x})^2}"
              display
            />
            <p class="text-sm text-text-muted mt-2">
              For every 1-unit increase in x, y changes by m units.
            </p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">Intercept (b)</p>
            <MathBlock formula="b = \bar{y} - m\bar{x}" display />
            <p class="text-sm text-text-muted mt-2">
              The predicted y value when x = 0.
            </p>
          </div>
        </div>

        <CodeExample
          id="statistics-regression-basic"
          title="linear_regression.py"
          language="python"
          :code="regressionCode"
        />
      </ContentSection>

      <!-- R-squared -->
      <ContentSection
        id="r-squared"
        title="R² (Coefficient of Determination)"
        icon="fa-solid fa-square-check"
        collapsible
      >
        <p class="mb-4">
          <strong>R²</strong> tells you what proportion of the variance in y is explained by x.
          It ranges from 0 (model explains nothing) to 1 (model explains everything).
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <MathBlock formula="R^2 = r^2 = 1 - \frac{SS_{residual}}{SS_{total}} = 1 - \frac{\sum(y_i - \hat{y}_i)^2}{\sum(y_i - \bar{y})^2}" display />
        </div>

        <div class="grid gap-4 md:grid-cols-3 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="text-2xl font-bold text-red-500 mb-1">R² = 0.1</p>
            <p class="text-sm text-text-secondary">Poor fit</p>
            <p class="text-xs text-text-muted">10% of variance explained</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="text-2xl font-bold text-amber-500 mb-1">R² = 0.5</p>
            <p class="text-sm text-text-secondary">Moderate fit</p>
            <p class="text-xs text-text-muted">50% of variance explained</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface text-center">
            <p class="text-2xl font-bold text-emerald-500 mb-1">R² = 0.9</p>
            <p class="text-sm text-text-secondary">Strong fit</p>
            <p class="text-xs text-text-muted">90% of variance explained</p>
          </div>
        </div>

        <div class="p-4 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <p class="font-semibold text-purple-700 dark:text-purple-300 mb-2">
            <i class="fa-solid fa-brain mr-2" aria-hidden="true" />
            ML Connection: Overfitting Preview
          </p>
          <p class="text-sm text-purple-600 dark:text-purple-400">
            Adding more predictors <strong>always</strong> increases R² on training data — even random noise!
            This is why we use adjusted R² or validation sets to assess true model quality.
            High training R² doesn't mean your model will generalize.
          </p>
        </div>
      </ContentSection>

      <!-- Residuals -->
      <ContentSection
        id="residuals"
        title="Residuals (Model Errors)"
        icon="fa-solid fa-ruler-combined"
        collapsible
      >
        <p class="mb-4">
          <strong>Residuals</strong> are the differences between observed and predicted values.
          Analyzing residuals reveals whether your model is appropriate.
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <MathBlock formula="e_i = y_i - \hat{y}_i = \text{actual} - \text{predicted}" display />
        </div>

        <div class="grid gap-4 md:grid-cols-2 mb-6">
          <div class="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10">
            <p class="font-medium text-emerald-600 dark:text-emerald-400 mb-2">Good Residual Pattern</p>
            <ul class="text-sm text-text-secondary list-disc list-inside">
              <li>Random scatter around zero</li>
              <li>No visible patterns</li>
              <li>Constant spread (homoscedasticity)</li>
              <li>Approximately normal distribution</li>
            </ul>
          </div>
          <div class="p-4 rounded-lg border border-red-500/30 bg-red-500/10">
            <p class="font-medium text-red-600 dark:text-red-400 mb-2">Warning Signs</p>
            <ul class="text-sm text-text-secondary list-disc list-inside">
              <li>Curved pattern → nonlinear relationship</li>
              <li>Funnel shape → heteroscedasticity</li>
              <li>Clusters → missing variables</li>
              <li>Large outliers → influential points</li>
            </ul>
          </div>
        </div>

        <div class="p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p class="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <i class="fa-solid fa-code mr-2" aria-hidden="true" />
            For Programmers
          </p>
          <p class="text-sm text-blue-600 dark:text-blue-400">
            Residual analysis is error analysis for your model. In ML terms, residuals ARE your
            training errors — the loss function (MSE, MAE) is computed from these.
            Understanding residual patterns helps you debug and improve models.
          </p>
        </div>
      </ContentSection>

      <!-- Multiple Regression -->
      <ContentSection
        id="multiple-regression"
        title="Multiple Regression & ML Bridge"
        icon="fa-solid fa-network-wired"
        collapsible
      >
        <p class="mb-4">
          <strong>Multiple regression</strong> extends linear regression to multiple predictors.
          This is exactly what a single linear layer in a neural network computes!
        </p>

        <div class="p-4 rounded-lg border border-border bg-surface mb-4">
          <MathBlock formula="\hat{y} = w_1 x_1 + w_2 x_2 + \cdots + w_n x_n + b = \mathbf{w} \cdot \mathbf{x} + b" display />
          <p class="text-sm text-text-muted text-center mt-2">
            This IS <code class="text-xs">np.dot(X, weights) + bias</code> — a linear layer!
          </p>
        </div>

        <div class="p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg mb-4">
          <p class="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">
            <i class="fa-solid fa-brain mr-2" aria-hidden="true" />
            The Neural Network Connection
          </p>
          <div class="text-sm text-emerald-600 dark:text-emerald-400 space-y-2">
            <p>Linear regression with multiple features is <strong>identical</strong> to:</p>
            <ul class="list-disc list-inside ml-2">
              <li>A single-layer neural network (no activation)</li>
              <li>The formula: <code>y = X @ W + b</code></li>
              <li>Training minimizes MSE loss via gradient descent</li>
              <li>The "weights" are just regression coefficients!</li>
            </ul>
          </div>
        </div>

        <CodeExample
          id="statistics-multiple-regression"
          title="multiple_regression_ml.py"
          language="python"
          :code="multipleRegressionCode"
        />

        <div class="mt-6">
          <CodeExample
            id="statistics-sklearn-regression"
            title="sklearn_regression.py"
            language="python"
            :code="sklearnCode"
          />
        </div>
      </ContentSection>

      <!-- Causation Warning -->
      <ContentSection
        id="causation"
        title="Correlation ≠ Causation"
        icon="fa-solid fa-exclamation-triangle"
        collapsible
      >
        <div class="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg mb-4">
          <p class="font-bold text-red-700 dark:text-red-300 mb-2">
            THIS IS THE MOST IMPORTANT LESSON
          </p>
          <p class="text-sm text-red-600 dark:text-red-400">
            Just because X and Y are correlated does NOT mean X causes Y (or vice versa).
            This is perhaps the most common statistical mistake in science, journalism, and industry.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-3 mb-6">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2 text-center">X → Y</p>
            <p class="text-sm text-text-secondary text-center">X causes Y</p>
            <p class="text-xs text-text-muted text-center mt-2">Smoking → Lung cancer</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2 text-center">Y → X</p>
            <p class="text-sm text-text-secondary text-center">Y causes X (reverse!)</p>
            <p class="text-xs text-text-muted text-center mt-2">Firefighters at fires</p>
          </div>
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2 text-center">Z → X, Y</p>
            <p class="text-sm text-text-secondary text-center">Hidden confounder</p>
            <p class="text-xs text-text-muted text-center mt-2">Ice cream ↔ Drowning (summer)</p>
          </div>
        </div>

        <div class="p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30">
          <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">Famous Spurious Correlations</p>
          <ul class="text-sm text-amber-600 dark:text-amber-400 space-y-1">
            <li>• Ice cream sales ↔ Drowning deaths (r ≈ 0.9) — Both caused by summer!</li>
            <li>• Shoe size ↔ Reading ability in children — Both increase with age!</li>
            <li>• Nicolas Cage films ↔ Pool drownings — Random coincidence!</li>
          </ul>
        </div>

        <div class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p class="font-semibold text-blue-700 dark:text-blue-300 mb-2">
            <i class="fa-solid fa-robot mr-2" aria-hidden="true" />
            For ML Practitioners
          </p>
          <p class="text-sm text-blue-600 dark:text-blue-400">
            When your model finds a correlation between feature X and target Y, it doesn't mean
            X <em>causes</em> Y. The model might be picking up on confounders.
            For causal claims, you need randomized experiments (A/B tests) or causal inference methods
            (do-calculus, instrumental variables, etc.).
          </p>
        </div>
      </ContentSection>

      <!-- Practical Tips -->
      <ContentSection
        id="tips"
        title="Practical Tips"
        icon="fa-solid fa-lightbulb"
        :default-expanded="false"
        collapsible
      >
        <div class="space-y-4">
          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-1 text-primary mr-2" aria-hidden="true" />
              Always Visualize First
            </p>
            <p class="text-sm text-text-secondary">
              Plot your data before calculating statistics. Anscombe's Quartet proves that
              identical statistics can hide wildly different patterns.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-2 text-primary mr-2" aria-hidden="true" />
              Check Residual Plots
            </p>
            <p class="text-sm text-text-secondary">
              Patterns in residuals reveal model problems. Random scatter = good fit.
              Curves or fans = wrong model type or missing variables.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-3 text-primary mr-2" aria-hidden="true" />
              Watch for Outliers
            </p>
            <p class="text-sm text-text-secondary">
              A single outlier can dramatically change your correlation and regression line.
              Use Cook's distance to identify influential points.
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-4 text-primary mr-2" aria-hidden="true" />
              Report Uncertainty
            </p>
            <p class="text-sm text-text-secondary">
              Always include confidence intervals for your estimates. A slope of 2.5 with
              CI [0.1, 4.9] is very different from [2.3, 2.7].
            </p>
          </div>

          <div class="p-4 rounded-lg border border-border bg-surface">
            <p class="font-medium text-text-primary mb-2">
              <i class="fa-solid fa-5 text-primary mr-2" aria-hidden="true" />
              Remember: Correlation ≠ Causation
            </p>
            <p class="text-sm text-text-secondary">
              Finding a strong correlation is just the beginning. To claim causation,
              you need controlled experiments or careful causal reasoning.
            </p>
          </div>
        </div>
      </ContentSection>

      <!-- Related Topics -->
      <RelatedTopics :topics="relatedTopics" />
    </div>
  </TopicPage>
</template>
