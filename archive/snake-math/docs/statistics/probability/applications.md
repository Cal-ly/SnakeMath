---
title: "Probability Applications: From Theory to Practice"
description: "Real-world applications of probability in business decisions, risk assessment, machine learning, and scientific research"
tags: ["mathematics", "statistics", "applications", "business", "machine-learning", "risk"]
difficulty: "intermediate"
category: "concept"
symbol: "P(A|B)"
prerequisites: ["probability-basics", "distributions", "bayes-theorem"]
related_concepts: ["hypothesis-testing", "a-b-testing", "machine-learning", "decision-theory"]
applications: ["business-analytics", "finance", "quality-control", "data-science", "research"]
interactive: true
code_examples: true
complexity_analysis: false
real_world_examples: true
layout: "concept-page"
date_created: "2024-01-01"
last_updated: "2024-01-01"
author: "Snake Math Team"
reviewers: []
version: "1.0"
---

# Probability Applications: From Theory to Practice

Probability isn't just academic theory—it's the mathematical foundation powering everything from Netflix recommendations to medical diagnosis, from financial risk assessment to A/B testing that optimizes websites. Let's explore how probability transforms uncertainty into actionable insights!

## Business and Decision Making

Probability helps businesses make data-driven decisions under uncertainty, from marketing optimization to inventory management.

<CodeFold>

```python
import numpy as np
from scipy import stats
import math

def business_applications():
    """Demonstrate probability applications in business"""
    
    print("Business Applications of Probability")
    print("=" * 40)
    
    def ab_testing_analysis():
        """A/B testing with statistical significance"""
        
        print("1. A/B Testing Analysis")
        print("   Testing: New website design vs. current design")
        
        # Sample data
        # Control group (current design)
        control_visitors = 10000
        control_conversions = 850
        control_rate = control_conversions / control_visitors
        
        # Treatment group (new design)
        treatment_visitors = 10000
        treatment_conversions = 920
        treatment_rate = treatment_conversions / treatment_visitors
        
        print(f"\n   Results:")
        print(f"     Control:   {control_conversions:,} / {control_visitors:,} = {control_rate:.3f} ({control_rate*100:.1f}%)")
        print(f"     Treatment: {treatment_conversions:,} / {treatment_visitors:,} = {treatment_rate:.3f} ({treatment_rate*100:.1f}%)")
        print(f"     Lift: {((treatment_rate - control_rate) / control_rate * 100):+.1f}%")
        
        # Statistical significance test (two-proportion z-test)
        pooled_rate = (control_conversions + treatment_conversions) / (control_visitors + treatment_visitors)
        
        # Standard error
        se = math.sqrt(pooled_rate * (1 - pooled_rate) * (1/control_visitors + 1/treatment_visitors))
        
        # Z-score
        z_score = (treatment_rate - control_rate) / se
        
        # P-value (two-tailed test)
        p_value = 2 * (1 - stats.norm.cdf(abs(z_score)))
        
        print(f"\n   Statistical Analysis:")
        print(f"     Z-score: {z_score:.3f}")
        print(f"     P-value: {p_value:.6f}")
        print(f"     Significance: {'Yes' if p_value < 0.05 else 'No'} (α = 0.05)")
        
        # Confidence interval for difference
        diff = treatment_rate - control_rate
        se_diff = math.sqrt((control_rate * (1 - control_rate) / control_visitors) + 
                           (treatment_rate * (1 - treatment_rate) / treatment_visitors))
        
        margin_error = 1.96 * se_diff
        ci_lower = diff - margin_error
        ci_upper = diff + margin_error
        
        print(f"     95% CI for difference: [{ci_lower:.4f}, {ci_upper:.4f}]")
        print(f"     CI in percentage points: [{ci_lower*100:.2f}%, {ci_upper*100:.2f}%]")
        
        # Business interpretation
        print(f"\n   Business Decision:")
        if p_value < 0.05 and ci_lower > 0:
            print(f"     ✓ Implement new design - statistically significant improvement")
            expected_additional_conversions = diff * treatment_visitors
            print(f"     ✓ Expected additional conversions per 10K visitors: {expected_additional_conversions:.0f}")
        else:
            print(f"     ✗ Insufficient evidence to change - continue testing or collect more data")
    
    def inventory_management():
        """Probability in inventory and supply chain"""
        
        print(f"\n2. Inventory Management")
        print("   Using probability to optimize stock levels")
        
        # Daily demand follows normal distribution
        demand_mean = 100  # average units per day
        demand_std = 20    # standard deviation
        
        # Lead time for restocking
        lead_time = 7  # days
        
        print(f"\n   Scenario: Electronics retailer")
        print(f"     Daily demand: Normal(μ={demand_mean}, σ={demand_std})")
        print(f"     Lead time: {lead_time} days")
        
        # Calculate safety stock for different service levels
        service_levels = [0.90, 0.95, 0.99]
        
        print(f"\n   Safety Stock Analysis:")
        print(f"   {'Service Level':<15} {'Z-score':<10} {'Safety Stock':<15} {'Total Cost Impact'}")
        print("   " + "-" * 60)
        
        for service_level in service_levels:
            # Z-score for service level
            z_score = stats.norm.ppf(service_level)
            
            # Safety stock calculation
            lead_time_demand_mean = demand_mean * lead_time
            lead_time_demand_std = demand_std * math.sqrt(lead_time)
            safety_stock = z_score * lead_time_demand_std
            
            # Total inventory needed
            reorder_point = lead_time_demand_mean + safety_stock
            
            # Cost implications (simplified)
            holding_cost_per_unit = 2  # $ per unit per year
            stockout_cost_per_unit = 50  # $ per unit stockout
            
            annual_holding_cost = safety_stock * holding_cost_per_unit
            expected_stockouts = (1 - service_level) * 365 * demand_mean * 0.1  # simplified
            annual_stockout_cost = expected_stockouts * stockout_cost_per_unit
            
            total_cost = annual_holding_cost + annual_stockout_cost
            
            print(f"   {service_level*100:>12.0f}%   {z_score:>8.2f}   {safety_stock:>13.0f}   ${total_cost:>12,.0f}")
        
        print(f"\n   Key Insights:")
        print(f"     • Higher service levels require more safety stock")
        print(f"     • Trade-off between holding costs and stockout costs")
        print(f"     • 95% service level often optimal balance")
    
    def customer_lifetime_value():
        """Probability models for customer behavior"""
        
        print(f"\n3. Customer Lifetime Value (CLV)")
        print("   Using probability to model customer behavior")
        
        # Customer behavior parameters
        monthly_purchase_prob = 0.15  # 15% chance of purchase each month
        average_order_value = 75      # $ per purchase
        monthly_churn_prob = 0.05     # 5% chance of churning each month
        
        print(f"\n   Customer Model:")
        print(f"     Monthly purchase probability: {monthly_purchase_prob:.1%}")
        print(f"     Average order value: ${average_order_value}")
        print(f"     Monthly churn probability: {monthly_churn_prob:.1%}")
        
        # Calculate expected lifetime value
        def calculate_clv(months=60):
            """Calculate CLV over given time horizon"""
            
            total_value = 0
            survival_prob = 1.0
            
            for month in range(1, months + 1):
                # Expected revenue this month
                monthly_revenue = survival_prob * monthly_purchase_prob * average_order_value
                total_value += monthly_revenue
                
                # Update survival probability
                survival_prob *= (1 - monthly_churn_prob)
                
                if month <= 12 or month % 12 == 0:  # Show first year and then yearly
                    print(f"     Month {month:>2}: Survival {survival_prob:.3f}, Monthly Rev ${monthly_revenue:.2f}, Cumulative CLV ${total_value:.2f}")
            
            return total_value
        
        print(f"\n   CLV Calculation (5-year horizon):")
        clv = calculate_clv(60)
        
        print(f"\n   Business Applications:")
        print(f"     • Customer acquisition cost budget: up to ${clv * 0.3:.0f} (30% of CLV)")
        print(f"     • Retention program ROI: saving 1% churn = ${clv * 0.01 * 1000:.0f} per 1000 customers")
        print(f"     • Segment customers by predicted CLV for targeted marketing")
    
    def risk_assessment():
        """Risk assessment and insurance"""
        
        print(f"\n4. Risk Assessment")
        print("   Probability in insurance and risk management")
        
        # Auto insurance example
        print(f"\n   Auto Insurance Example:")
        
        # Risk factors and their probabilities
        risk_factors = {
            "Base accident rate": 0.05,          # 5% chance per year
            "Young driver multiplier": 2.0,      # Double the risk
            "City driving multiplier": 1.5,      # 50% higher risk
            "Good driver discount": 0.8          # 20% reduction
        }
        
        # Calculate risk for different customer profiles
        profiles = [
            ("Low risk: Rural, experienced, good record", [1.0, 0.8]),
            ("Medium risk: City, experienced, good record", [1.5, 0.8]),
            ("High risk: City, young, average record", [1.5, 2.0, 1.0]),
        ]
        
        base_rate = risk_factors["Base accident rate"]
        average_claim = 12000  # $ per accident
        
        print(f"\n   Risk Profile Analysis:")
        print(f"   {'Profile':<40} {'Accident Rate':<15} {'Expected Loss':<15} {'Premium'}")
        print("   " + "-" * 85)
        
        for profile_name, multipliers in profiles:
            # Calculate adjusted risk
            adjusted_rate = base_rate
            for multiplier in multipliers:
                adjusted_rate *= multiplier
            
            # Expected annual loss
            expected_loss = adjusted_rate * average_claim
            
            # Premium (expected loss + overhead + profit margin)
            premium = expected_loss * 1.3  # 30% markup
            
            print(f"   {profile_name:<40} {adjusted_rate:>13.1%} ${expected_loss:>13,.0f} ${premium:>10,.0f}")
        
        print(f"\n   Key Principles:")
        print(f"     • Premium should reflect risk probability")
        print(f"     • Pool risks across many customers")
        print(f"     • Use data to refine risk models")
    
    # Run all business applications
    ab_testing_analysis()
    inventory_management()
    customer_lifetime_value()
    risk_assessment()
    
    print(f"\nBusiness Probability Summary:")
    print(f"• A/B testing: Statistical significance for decisions")
    print(f"• Inventory: Balance holding vs. stockout costs")
    print(f"• CLV: Model customer behavior for marketing ROI")
    print(f"• Risk: Price insurance based on probability")

business_applications()
```

</CodeFold>

## Healthcare and Medical Diagnosis

Probability is crucial in medical decision-making, from interpreting diagnostic tests to clinical trial design.

<CodeFold>

```python
def healthcare_applications():
    """Demonstrate probability applications in healthcare"""
    
    print("Healthcare Applications of Probability")
    print("=" * 40)
    
    def diagnostic_testing():
        """Medical diagnosis with Bayes' theorem"""
        
        print("1. Medical Diagnostic Testing")
        print("   Using Bayes' theorem to interpret test results")
        
        # Disease parameters
        disease_prevalence = 0.001  # 0.1% of population has the disease
        
        # Test characteristics
        sensitivity = 0.95  # 95% of sick people test positive (true positive rate)
        specificity = 0.90  # 90% of healthy people test negative (true negative rate)
        
        print(f"\n   Scenario: Rare disease screening")
        print(f"     Disease prevalence: {disease_prevalence:.1%}")
        print(f"     Test sensitivity: {sensitivity:.1%} (detects disease when present)")
        print(f"     Test specificity: {specificity:.1%} (negative when disease absent)")
        
        # Calculate probabilities using Bayes' theorem
        false_positive_rate = 1 - specificity
        
        # P(positive test) = P(pos|disease) × P(disease) + P(pos|no disease) × P(no disease)
        p_positive = sensitivity * disease_prevalence + false_positive_rate * (1 - disease_prevalence)
        
        # P(disease | positive test) = P(pos|disease) × P(disease) / P(positive)
        p_disease_given_positive = (sensitivity * disease_prevalence) / p_positive
        
        # P(no disease | negative test)
        false_negative_rate = 1 - sensitivity
        p_negative = (1 - false_negative_rate) * (1 - disease_prevalence) + false_negative_rate * disease_prevalence
        p_no_disease_given_negative = (specificity * (1 - disease_prevalence)) / p_negative
        
        print(f"\n   Test Result Interpretation:")
        print(f"     P(disease | positive test) = {p_disease_given_positive:.1%}")
        print(f"     P(no disease | negative test) = {p_no_disease_given_negative:.1%}")
        
        print(f"\n   Clinical Impact:")
        print(f"     • Even with positive test, only {p_disease_given_positive:.1%} chance of disease")
        print(f"     • High false positive rate due to low prevalence")
        print(f"     • Need confirmatory testing for positive results")
        print(f"     • Negative test is very reliable ({p_no_disease_given_negative:.2%} confident)")
        
        # Show impact of different prevalence rates
        print(f"\n   Impact of Disease Prevalence:")
        print(f"   {'Prevalence':<12} {'P(Disease|+)':<15} {'P(Healthy|-)':<15}")
        print("   " + "-" * 45)
        
        for prev in [0.001, 0.01, 0.05, 0.10, 0.20]:
            p_pos = sensitivity * prev + false_positive_rate * (1 - prev)
            p_disease_pos = (sensitivity * prev) / p_pos
            
            p_neg = specificity * (1 - prev) + false_negative_rate * prev
            p_healthy_neg = (specificity * (1 - prev)) / p_neg
            
            print(f"   {prev:>10.1%}   {p_disease_pos:>13.1%}   {p_healthy_neg:>13.2%}")
    
    def clinical_trials():
        """Clinical trial design and analysis"""
        
        print(f"\n2. Clinical Trial Analysis")
        print("   Statistical power and sample size calculations")
        
        # Trial parameters
        control_success_rate = 0.60      # 60% success with current treatment
        treatment_success_rate = 0.70    # Hope for 70% with new treatment
        alpha = 0.05                     # Significance level (Type I error)
        power = 0.80                     # Desired power (1 - Type II error)
        
        print(f"\n   Trial Design:")
        print(f"     Control group expected success: {control_success_rate:.1%}")
        print(f"     Treatment group expected success: {treatment_success_rate:.1%}")
        print(f"     Significance level (α): {alpha:.2f}")
        print(f"     Desired power (1-β): {power:.2f}")
        
        # Sample size calculation (simplified)
        effect_size = treatment_success_rate - control_success_rate
        pooled_variance = (control_success_rate * (1 - control_success_rate) + 
                          treatment_success_rate * (1 - treatment_success_rate)) / 2
        
        # Simplified sample size formula
        z_alpha = stats.norm.ppf(1 - alpha/2)  # Two-tailed test
        z_beta = stats.norm.ppf(power)
        
        n_per_group = ((z_alpha + z_beta)**2 * 2 * pooled_variance) / (effect_size**2)
        
        print(f"\n   Sample Size Calculation:")
        print(f"     Effect size: {effect_size:.1%}")
        print(f"     Required per group: {n_per_group:.0f} patients")
        print(f"     Total trial size: {2 * n_per_group:.0f} patients")
        
        # Simulate trial results
        np.random.seed(42)
        n_per_group = int(n_per_group)
        
        # Simulate outcomes
        control_successes = np.random.binomial(n_per_group, control_success_rate)
        treatment_successes = np.random.binomial(n_per_group, treatment_success_rate)
        
        control_rate_observed = control_successes / n_per_group
        treatment_rate_observed = treatment_successes / n_per_group
        
        print(f"\n   Simulated Trial Results:")
        print(f"     Control: {control_successes}/{n_per_group} = {control_rate_observed:.1%}")
        print(f"     Treatment: {treatment_successes}/{n_per_group} = {treatment_rate_observed:.1%}")
        
        # Statistical test
        pooled_rate = (control_successes + treatment_successes) / (2 * n_per_group)
        se = math.sqrt(pooled_rate * (1 - pooled_rate) * (2 / n_per_group))
        z_stat = (treatment_rate_observed - control_rate_observed) / se
        p_value = 2 * (1 - stats.norm.cdf(abs(z_stat)))
        
        print(f"     Z-statistic: {z_stat:.3f}")
        print(f"     P-value: {p_value:.4f}")
        print(f"     Result: {'Significant' if p_value < alpha else 'Not significant'}")
    
    def epidemiology():
        """Disease spread modeling"""
        
        print(f"\n3. Epidemiological Modeling")
        print("   Modeling disease transmission probability")
        
        # SIR model parameters (simplified)
        population = 100000
        initial_infected = 100
        transmission_rate = 0.3    # β: contacts per day × probability of transmission
        recovery_rate = 0.1        # γ: 1/infectious_period
        
        print(f"\n   Disease Model Parameters:")
        print(f"     Population: {population:,}")
        print(f"     Initial infected: {initial_infected}")
        print(f"     Transmission rate (β): {transmission_rate}")
        print(f"     Recovery rate (γ): {recovery_rate}")
        
        # Basic reproduction number
        R0 = transmission_rate / recovery_rate
        
        print(f"     Basic reproduction number (R₀): {R0:.1f}")
        
        # Interpret R0
        if R0 > 1:
            interpretation = "Epidemic will grow"
        elif R0 == 1:
            interpretation = "Epidemic will remain stable"
        else:
            interpretation = "Epidemic will decline"
        
        print(f"     Interpretation: {interpretation}")
        
        # Herd immunity threshold
        herd_immunity_threshold = 1 - (1 / R0) if R0 > 1 else 0
        
        print(f"     Herd immunity threshold: {herd_immunity_threshold:.1%}")
        
        # Simple simulation of early growth
        print(f"\n   Early Epidemic Growth (exponential phase):")
        print(f"   {'Day':<5} {'New Cases':<12} {'Total Cases':<12} {'% Population'}")
        print("   " + "-" * 45)
        
        current_infected = initial_infected
        total_cases = initial_infected
        
        for day in range(0, 15, 2):
            if day == 0:
                new_cases = initial_infected
            else:
                # Simplified: new cases = current_infected × transmission_rate
                new_cases = int(current_infected * transmission_rate)
                current_infected = current_infected + new_cases - int(current_infected * recovery_rate)
                total_cases += new_cases
            
            percent_pop = total_cases / population * 100
            
            print(f"   {day:<5} {new_cases:<12} {total_cases:<12} {percent_pop:.2f}%")
        
        print(f"\n   Public Health Implications:")
        print(f"     • R₀ > 1 requires intervention to reduce transmission")
        print(f"     • Need {herd_immunity_threshold:.0%} immune to stop spread")
        print(f"     • Early exponential growth can overwhelm healthcare")
    
    # Run all healthcare applications
    diagnostic_testing()
    clinical_trials()
    epidemiology()
    
    print(f"\nHealthcare Probability Summary:")
    print(f"• Diagnostics: Bayes' theorem for test interpretation")
    print(f"• Clinical trials: Power analysis and sample size")
    print(f"• Epidemiology: Disease spread modeling")
    print(f"• All require careful probability calculations for lives")

healthcare_applications()
```

</CodeFold>

## Technology and Machine Learning

Probability is the mathematical foundation of artificial intelligence, from spam filters to recommendation systems.

<CodeFold>

```python
def technology_applications():
    """Demonstrate probability applications in technology"""
    
    print("Technology Applications of Probability")
    print("=" * 42)
    
    def spam_detection():
        """Bayesian spam filtering"""
        
        print("1. Email Spam Detection")
        print("   Naive Bayes classifier using word probabilities")
        
        # Training data statistics
        total_emails = 10000
        spam_emails = 3000
        ham_emails = 7000
        
        # Word frequency in spam vs ham
        word_stats = {
            'FREE': {'spam': 0.8, 'ham': 0.01},
            'URGENT': {'spam': 0.6, 'ham': 0.02},
            'money': {'spam': 0.4, 'ham': 0.05},
            'meeting': {'spam': 0.1, 'ham': 0.3},
            'project': {'spam': 0.05, 'ham': 0.25}
        }
        
        print(f"\n   Training Data:")
        print(f"     Total emails: {total_emails:,}")
        print(f"     Spam: {spam_emails:,} ({spam_emails/total_emails:.1%})")
        print(f"     Ham: {ham_emails:,} ({ham_emails/total_emails:.1%})")
        
        print(f"\n   Word Probabilities:")
        print(f"   {'Word':<10} {'P(word|spam)':<15} {'P(word|ham)':<15} {'Spam Indicator'}")
        print("   " + "-" * 55)
        
        for word, probs in word_stats.items():
            spam_prob = probs['spam']
            ham_prob = probs['ham']
            indicator = spam_prob / ham_prob if ham_prob > 0 else float('inf')
            
            print(f"   {word:<10} {spam_prob:<15.2f} {ham_prob:<15.2f} {indicator:>13.1f}x")
        
        # Classify new email
        test_email = ['FREE', 'money', 'meeting']
        
        print(f"\n   Classifying email with words: {test_email}")
        
        # Prior probabilities
        p_spam = spam_emails / total_emails
        p_ham = ham_emails / total_emails
        
        # Calculate likelihood for spam
        likelihood_spam = p_spam
        for word in test_email:
            if word in word_stats:
                likelihood_spam *= word_stats[word]['spam']
        
        # Calculate likelihood for ham
        likelihood_ham = p_ham
        for word in test_email:
            if word in word_stats:
                likelihood_ham *= word_stats[word]['ham']
        
        # Normalize to get probabilities
        total_likelihood = likelihood_spam + likelihood_ham
        prob_spam = likelihood_spam / total_likelihood
        prob_ham = likelihood_ham / total_likelihood
        
        print(f"\n   Classification Results:")
        print(f"     P(spam | words) = {prob_spam:.4f} ({prob_spam*100:.1f}%)")
        print(f"     P(ham | words) = {prob_ham:.4f} ({prob_ham*100:.1f}%)")
        print(f"     Prediction: {'SPAM' if prob_spam > 0.5 else 'HAM'}")
        print(f"     Confidence: {max(prob_spam, prob_ham)*100:.1f}%")
    
    def recommendation_systems():
        """Collaborative filtering with probability"""
        
        print(f"\n2. Recommendation Systems")
        print("   Using probability for personalized recommendations")
        
        # Simplified user-item matrix
        users = ['Alice', 'Bob', 'Carol', 'Dave']
        items = ['Movie A', 'Movie B', 'Movie C', 'Movie D']
        
        # Ratings matrix (0 = not rated, 1-5 = rating)
        ratings = {
            'Alice': {'Movie A': 5, 'Movie B': 3, 'Movie C': 0, 'Movie D': 1},
            'Bob': {'Movie A': 4, 'Movie B': 0, 'Movie C': 4, 'Movie D': 2},
            'Carol': {'Movie A': 0, 'Movie B': 2, 'Movie C': 5, 'Movie D': 4},
            'Dave': {'Movie A': 3, 'Movie B': 4, 'Movie C': 2, 'Movie D': 0}
        }
        
        print(f"\n   User Ratings Matrix:")
        print(f"   {'User':<8}", end='')
        for item in items:
            print(f"{item:<10}", end='')
        print()
        print("   " + "-" * 48)
        
        for user in users:
            print(f"   {user:<8}", end='')
            for item in items:
                rating = ratings[user][item]
                display = str(rating) if rating > 0 else '-'
                print(f"{display:<10}", end='')
            print()
        
        # Predict rating for Alice and Movie C
        target_user = 'Alice'
        target_item = 'Movie C'
        
        print(f"\n   Predicting rating for {target_user} and {target_item}:")
        
        # Find similar users (simplified cosine similarity)
        def calculate_similarity(user1, user2):
            """Calculate similarity between two users"""
            common_items = []
            for item in items:
                if ratings[user1][item] > 0 and ratings[user2][item] > 0:
                    common_items.append(item)
            
            if len(common_items) == 0:
                return 0
            
            # Simple correlation
            user1_ratings = [ratings[user1][item] for item in common_items]
            user2_ratings = [ratings[user2][item] for item in common_items]
            
            mean1 = sum(user1_ratings) / len(user1_ratings)
            mean2 = sum(user2_ratings) / len(user2_ratings)
            
            numerator = sum((r1 - mean1) * (r2 - mean2) for r1, r2 in zip(user1_ratings, user2_ratings))
            denom1 = sum((r1 - mean1)**2 for r1 in user1_ratings)**0.5
            denom2 = sum((r2 - mean2)**2 for r2 in user2_ratings)**0.5
            
            if denom1 == 0 or denom2 == 0:
                return 0
            
            return numerator / (denom1 * denom2)
        
        # Calculate similarities
        similarities = {}
        for user in users:
            if user != target_user:
                similarities[user] = calculate_similarity(target_user, user)
        
        print(f"\n   User Similarities to {target_user}:")
        for user, sim in similarities.items():
            print(f"     {user}: {sim:.3f}")
        
        # Weighted average prediction
        numerator = 0
        denominator = 0
        
        for user, similarity in similarities.items():
            if ratings[user][target_item] > 0 and similarity > 0:
                numerator += similarity * ratings[user][target_item]
                denominator += abs(similarity)
        
        predicted_rating = numerator / denominator if denominator > 0 else 0
        
        print(f"\n   Predicted rating: {predicted_rating:.2f}")
        print(f"   Recommendation: {'Yes' if predicted_rating >= 4 else 'No'} (threshold: 4.0)")
    
    def quality_control():
        """Statistical quality control"""
        
        print(f"\n3. Manufacturing Quality Control")
        print("   Using probability for defect detection and process control")
        
        # Process parameters
        defect_rate = 0.02  # 2% defect rate
        sample_size = 100   # Sample size for inspection
        
        print(f"\n   Process Monitoring:")
        print(f"     Target defect rate: {defect_rate:.1%}")
        print(f"     Sample size: {sample_size}")
        
        # Control limits (3-sigma)
        expected_defects = sample_size * defect_rate
        std_dev = math.sqrt(sample_size * defect_rate * (1 - defect_rate))
        
        upper_control_limit = expected_defects + 3 * std_dev
        lower_control_limit = max(0, expected_defects - 3 * std_dev)
        
        print(f"\n   Control Chart Limits:")
        print(f"     Expected defects: {expected_defects:.1f}")
        print(f"     Standard deviation: {std_dev:.2f}")
        print(f"     Upper control limit: {upper_control_limit:.1f}")
        print(f"     Lower control limit: {lower_control_limit:.1f}")
        
        # Simulate samples
        np.random.seed(42)
        samples = np.random.binomial(sample_size, defect_rate, 10)
        
        print(f"\n   Sample Results:")
        print(f"   {'Sample':<8} {'Defects':<10} {'Rate':<10} {'Status'}")
        print("   " + "-" * 40)
        
        for i, defects in enumerate(samples, 1):
            rate = defects / sample_size
            
            if defects > upper_control_limit:
                status = "OUT (High)"
            elif defects < lower_control_limit:
                status = "OUT (Low)"
            else:
                status = "IN"
            
            print(f"   {i:<8} {defects:<10} {rate:<10.1%} {status}")
        
        # Type I and Type II error analysis
        print(f"\n   Error Analysis:")
        
        # Probability of Type I error (false alarm)
        type_i_error = 2 * (1 - stats.norm.cdf(3))  # Two-tailed, 3-sigma
        
        # Probability of detecting 4% defect rate (Type II error)
        new_defect_rate = 0.04
        new_expected = sample_size * new_defect_rate
        power = 1 - stats.norm.cdf(upper_control_limit, new_expected, 
                                  math.sqrt(sample_size * new_defect_rate * (1 - new_defect_rate)))
        type_ii_error = 1 - power
        
        print(f"     Type I error (false alarm): {type_i_error:.1%}")
        print(f"     Power to detect 4% defect rate: {power:.1%}")
        print(f"     Type II error (missed detection): {type_ii_error:.1%}")
    
    # Run all technology applications
    spam_detection()
    recommendation_systems()
    quality_control()
    
    print(f"\nTechnology Probability Summary:")
    print(f"• Spam detection: Naive Bayes classification")
    print(f"• Recommendations: Collaborative filtering with similarity")
    print(f"• Quality control: Statistical process control")
    print(f"• All rely on probability for automated decision-making")

technology_applications()
```

</CodeFold>

## Finance and Risk Management

Probability drives financial modeling, from portfolio optimization to credit risk assessment.

<CodeFold>

```python
def finance_applications():
    """Demonstrate probability applications in finance"""
    
    print("Finance Applications of Probability")
    print("=" * 38)
    
    def portfolio_risk():
        """Portfolio risk assessment using probability"""
        
        print("1. Portfolio Risk Analysis")
        print("   Using probability to model investment risk")
        
        # Asset parameters (annual returns)
        assets = {
            'Stocks': {'expected_return': 0.10, 'volatility': 0.20},
            'Bonds': {'expected_return': 0.04, 'volatility': 0.05},
            'Real Estate': {'expected_return': 0.08, 'volatility': 0.15}
        }
        
        # Portfolio allocation
        allocation = {'Stocks': 0.6, 'Bonds': 0.3, 'Real Estate': 0.1}
        
        print(f"\n   Asset Characteristics (Annual):")
        print(f"   {'Asset':<12} {'Expected Return':<18} {'Volatility':<12} {'Allocation'}")
        print("   " + "-" * 55)
        
        for asset, params in assets.items():
            exp_ret = params['expected_return']
            vol = params['volatility']
            alloc = allocation[asset]
            
            print(f"   {asset:<12} {exp_ret:>16.1%} {vol:>10.1%} {alloc:>9.1%}")
        
        # Portfolio expected return
        portfolio_return = sum(allocation[asset] * assets[asset]['expected_return'] 
                              for asset in assets)
        
        # Portfolio risk (simplified - assuming uncorrelated assets)
        portfolio_variance = sum((allocation[asset] * assets[asset]['volatility'])**2 
                               for asset in assets)
        portfolio_risk = math.sqrt(portfolio_variance)
        
        print(f"\n   Portfolio Metrics:")
        print(f"     Expected return: {portfolio_return:.1%}")
        print(f"     Risk (volatility): {portfolio_risk:.1%}")
        print(f"     Sharpe ratio: {portfolio_return / portfolio_risk:.2f}")
        
        # Value at Risk (VaR) calculation
        confidence_levels = [0.95, 0.99]
        initial_investment = 100000
        
        print(f"\n   Value at Risk (1-year horizon, ${initial_investment:,} investment):")
        print(f"   {'Confidence':<12} {'Z-score':<10} {'VaR':<15} {'Interpretation'}")
        print("   " + "-" * 50)
        
        for conf in confidence_levels:
            z_score = stats.norm.ppf(1 - conf)  # Negative for losses
            var_return = portfolio_return + z_score * portfolio_risk
            var_dollar = initial_investment * var_return
            
            print(f"   {conf:.0%}        {z_score:>8.2f}   ${var_dollar:>13,.0f}   {(1-conf):.0%} chance of worse loss")
    
    def credit_scoring():
        """Credit risk assessment"""
        
        print(f"\n2. Credit Risk Assessment")
        print("   Probability models for loan default prediction")
        
        # Credit scoring factors
        factors = {
            'Credit Score': {
                'Excellent (>750)': {'weight': 0.4, 'default_rate': 0.01},
                'Good (650-750)': {'weight': 0.3, 'default_rate': 0.03},
                'Fair (550-650)': {'weight': 0.2, 'default_rate': 0.08},
                'Poor (<550)': {'weight': 0.1, 'default_rate': 0.20}
            },
            'Income Level': {
                'High': {'weight': 0.3, 'default_rate': 0.02},
                'Medium': {'weight': 0.5, 'default_rate': 0.04},
                'Low': {'weight': 0.2, 'default_rate': 0.12}
            },
            'Employment': {
                'Stable': {'weight': 0.3, 'default_rate': 0.03},
                'Unstable': {'weight': 0.7, 'default_rate': 0.08}
            }
        }
        
        print(f"\n   Default Rate by Risk Factors:")
        
        for factor, categories in factors.items():
            print(f"\n   {factor}:")
            print(f"   {'Category':<20} {'Population %':<15} {'Default Rate'}")
            print("   " + "-" * 45)
            
            for category, data in categories.items():
                weight = data['weight']
                default_rate = data['default_rate']
                
                print(f"   {category:<20} {weight:>13.1%} {default_rate:>11.1%}")
        
        # Example applicant
        applicant = {
            'Credit Score': 'Good (650-750)',
            'Income Level': 'Medium',
            'Employment': 'Stable'
        }
        
        print(f"\n   Example Applicant Assessment:")
        print(f"     Credit Score: {applicant['Credit Score']}")
        print(f"     Income Level: {applicant['Income Level']}")
        print(f"     Employment: {applicant['Employment']}")
        
        # Simple scoring model (additive)
        risk_score = 0
        for factor, category in applicant.items():
            default_rate = factors[factor][category]['default_rate']
            risk_score += default_rate
        
        # Average risk
        estimated_default_prob = risk_score / len(applicant)
        
        print(f"\n   Risk Assessment:")
        print(f"     Estimated default probability: {estimated_default_prob:.1%}")
        
        # Loan pricing
        loan_amount = 50000
        base_rate = 0.05  # 5% base interest rate
        risk_premium = estimated_default_prob * 2  # 2x default rate as premium
        total_rate = base_rate + risk_premium
        
        print(f"     Recommended interest rate: {total_rate:.1%}")
        print(f"     (Base: {base_rate:.1%} + Risk premium: {risk_premium:.1%})")
        
        # Expected loss
        expected_loss = loan_amount * estimated_default_prob
        print(f"     Expected loss: ${expected_loss:,.0f}")
    
    def options_pricing():
        """Options pricing using probability"""
        
        print(f"\n3. Options Pricing (Simplified)")
        print("   Using probability to value financial derivatives")
        
        # Black-Scholes parameters (simplified)
        stock_price = 100      # Current stock price
        strike_price = 105     # Option strike price
        time_to_expiry = 0.25  # 3 months
        volatility = 0.20      # 20% annual volatility
        risk_free_rate = 0.05  # 5% risk-free rate
        
        print(f"\n   Option Parameters:")
        print(f"     Current stock price: ${stock_price}")
        print(f"     Strike price: ${strike_price}")
        print(f"     Time to expiry: {time_to_expiry:.2f} years")
        print(f"     Volatility: {volatility:.1%}")
        print(f"     Risk-free rate: {risk_free_rate:.1%}")
        
        # Simplified Monte Carlo simulation
        np.random.seed(42)
        n_simulations = 10000
        
        # Simulate stock prices at expiry
        final_prices = []
        for _ in range(n_simulations):
            # Geometric Brownian Motion
            random_shock = np.random.normal(0, 1)
            price_at_expiry = stock_price * math.exp(
                (risk_free_rate - 0.5 * volatility**2) * time_to_expiry + 
                volatility * math.sqrt(time_to_expiry) * random_shock
            )
            final_prices.append(price_at_expiry)
        
        final_prices = np.array(final_prices)
        
        # Option payoffs
        call_payoffs = np.maximum(final_prices - strike_price, 0)
        put_payoffs = np.maximum(strike_price - final_prices, 0)
        
        # Present value of expected payoffs
        call_price = np.mean(call_payoffs) * math.exp(-risk_free_rate * time_to_expiry)
        put_price = np.mean(put_payoffs) * math.exp(-risk_free_rate * time_to_expiry)
        
        print(f"\n   Monte Carlo Option Pricing ({n_simulations:,} simulations):")
        print(f"     Call option value: ${call_price:.2f}")
        print(f"     Put option value: ${put_price:.2f}")
        
        # Probability analysis
        prob_call_itm = np.mean(final_prices > strike_price)
        prob_put_itm = np.mean(final_prices < strike_price)
        
        print(f"\n   Probability Analysis:")
        print(f"     P(stock > ${strike_price}): {prob_call_itm:.1%} (call in-the-money)")
        print(f"     P(stock < ${strike_price}): {prob_put_itm:.1%} (put in-the-money)")
        
        # Risk metrics
        percentiles = [5, 25, 50, 75, 95]
        print(f"\n   Stock Price Distribution at Expiry:")
        print(f"   {'Percentile':<12} {'Price':<10} {'Call Payoff':<12} {'Put Payoff'}")
        print("   " + "-" * 45)
        
        for p in percentiles:
            price = np.percentile(final_prices, p)
            call_payoff = max(price - strike_price, 0)
            put_payoff = max(strike_price - price, 0)
            
            print(f"   {p:>10}%   ${price:>8.2f}   ${call_payoff:>10.2f}   ${put_payoff:>8.2f}")
    
    # Run all finance applications
    portfolio_risk()
    credit_scoring()
    options_pricing()
    
    print(f"\nFinance Probability Summary:")
    print(f"• Portfolio risk: VaR and risk-return analysis")
    print(f"• Credit scoring: Default probability modeling")
    print(f"• Options pricing: Monte Carlo simulation")
    print(f"• All use probability to quantify financial uncertainty")

finance_applications()
```

</CodeFold>

## Interactive Exploration

<ProbabilityApplicationsDemo />

Explore real-world probability applications across different domains and see how changing parameters affects outcomes and decisions!

## Key Takeaways

Probability applications transform uncertainty into actionable insights across every field:

**Business Impact:**
- **A/B Testing**: Statistical significance drives product decisions
- **Inventory Management**: Balance costs using demand uncertainty
- **Customer Analytics**: CLV models guide marketing investment
- **Risk Assessment**: Insurance pricing based on probability

**Healthcare Advancement:**
- **Diagnostic Testing**: Bayes' theorem improves medical decisions
- **Clinical Trials**: Power analysis ensures reliable results
- **Epidemiology**: Disease models inform public health policy
- **Personalized Medicine**: Risk stratification for treatment

**Technology Innovation:**
- **Machine Learning**: Probabilistic models power AI systems
- **Quality Control**: Statistical monitoring prevents defects
- **Recommendation Systems**: Collaborative filtering enhances user experience
- **Spam Detection**: Bayesian classifiers protect communications

**Financial Stability:**
- **Portfolio Management**: Risk-return optimization
- **Credit Decisions**: Default probability guides lending
- **Derivatives Pricing**: Options valued using probability models
- **Regulatory Compliance**: VaR calculations for risk management

## Next Steps

Apply probability to your domain:

- **[Basics](./basics.md)** - Master fundamental probability concepts
- **[Distributions](./distributions.md)** - Choose the right model for your data
- **[Index](./index.md)** - Complete overview and learning path

## Related Concepts

- **Statistical Inference** - Drawing conclusions from data
- **Hypothesis Testing** - Formal decision-making frameworks
- **Bayesian Statistics** - Updating beliefs with evidence
- **Machine Learning** - Algorithms that learn from uncertainty
- **Decision Theory** - Optimal choices under uncertainty
