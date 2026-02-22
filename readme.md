# 📊 Resilient — Quantitative Portfolio Risk Engine

Resilient is a production-grade quantitative portfolio risk engine that uses Monte Carlo simulation and Conditional Value-at-Risk (CVaR) optimization to construct portfolios designed for extreme downside protection.

The system integrates a FastAPI backend with a dynamic frontend dashboard, simulating thousands of correlated market scenarios to estimate tail risk and optimize asset allocation accordingly.

---

## 🚀 Overview

Traditional portfolios optimize expected return.

**Resilient optimizes survivability under extreme stress.**

The engine:

- Simulates thousands of correlated future market paths  
- Estimates 95% Conditional Value-at-Risk (CVaR)  
- Optimizes portfolio weights to minimize tail loss  
- Dynamically serves results through a REST API  
- Visualizes allocation and downside risk via dashboard  

This project demonstrates institutional-grade risk modeling with full-stack implementation.

---

## 🧠 Quantitative Methodology

### 1️⃣ Data Layer

- Real ETF historical data: `SPY`, `QQQ`, `IWM`, `EFA`, `TLT`  
- Daily log returns  
- Cleaned and aligned time series  

---

### 2️⃣ Monte Carlo Simulation

- Multivariate **Student-t distribution**
- Fat-tailed modeling for realistic crash behavior  
- 8,000+ stochastic simulations  
- Daily rebalanced portfolio construction  
- Multi-year horizon scaling (3, 5, 10 years)

**Why Student-t?**  
It captures heavy tails and crisis-like extreme events better than Gaussian models.

---

### 3️⃣ Covariance Estimation

- **Ledoit–Wolf Shrinkage Estimator**  
- Reduces sampling noise  
- Improves numerical stability  
- Prevents extreme allocation concentration  

---

### 4️⃣ Risk Metric — 95% CVaR

Conditional Value-at-Risk (Expected Shortfall):
