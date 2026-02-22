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

  CVaRα​=E[R∣R≤VaRα​]


- Computed on terminal portfolio return distribution  
- Measures expected loss in worst 5% scenarios  
- Industry-standard institutional downside metric  

---

### 5️⃣ Optimization Framework

- Constrained SLSQP optimizer  
- Objective: minimize 95% CVaR  
- Fully invested constraint (weights sum to 1)  
- Risk-profile-dependent max weight bounds  
- Deterministic seed for reproducibility  

No dummy logic.  
No hardcoded outputs.  
All values are dynamically computed.

---

## 🏗 System Architecture
Backend (FastAPI)
│
├── Data Layer
│ ├── ETF download (yfinance)
│ └── Log return computation
│
├── Risk Engine
│ ├── Student-t Monte Carlo
│ ├── Shrinkage covariance
│ └── Terminal return simulation
│
├── Optimization Layer
│ └── CVaR minimization
│
└── API Endpoint (/analyze)

Frontend (HTML + JS)
│
├── Profile input page
├── Dynamic API integration
└── Risk dashboard visualization


---

## 🖥 Tech Stack

### Backend
- Python  
- FastAPI  
- NumPy  
- SciPy  
- Scikit-learn  
- Pandas  
- yfinance  

### Frontend
- HTML5  
- CSS3  
- Vanilla JavaScript  
- GSAP  
- Three.js  

---

## 📈 Example Output

For a given profile:

- Risk Level: Balanced  
- Time Horizon: 5 Years  
- Simulations: 8,000  

The engine returns:

- Optimized strategic asset allocation  
- Estimated 95% worst-case tail loss  
- Fully diversified portfolio weights  

All results are computed in real-time using Monte Carlo simulation.

---


