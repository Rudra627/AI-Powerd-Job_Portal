import { Link } from "react-router-dom";
import "../styles/Landing.css";
import heroImg from "../assets/job_portal_hero.png";

export default function Landing() {
  return (
    <div className="landing-wrapper">
      
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 hero-content">
              <h1 className="hero-title">
                Find Your <span>Dream Career</span> With JobPortal
              </h1>
              <p className="hero-subtitle">
                Explore thousands of job opportunities or find the perfect candidate for your company. The modern way to connect talent with opportunity.
              </p>
              <div className="d-flex gap-3">
                <Link to="/signup" className="btn btn-landing btn-landing-primary">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-landing btn-outline-primary">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6 mt-5 mt-lg-0">
              <div className="hero-image-container text-center">
                <img src={heroImg} alt="Job Search Illustration" className="hero-image img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Choose JobPortal?</h2>
            <p className="text-muted">We provide the best tools for both job seekers and employers.</p>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-lightning-charge-fill"></i>
                </div>
                <h4>Instant Matches</h4>
                <p className="text-muted">Our smart algorithm connects you with the most relevant roles based on your skills and experience.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h4>Secure & Verified</h4>
                <p className="text-muted">Every job posting and company profile is verified to ensure a safe and trustworthy environment.</p>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="bi bi-graph-up-arrow"></i>
                </div>
                <h4>Career Growth</h4>
                <p className="text-muted">Access insights and tools to help you level up your professional profile and career trajectory.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <div className="stat-label">Active Jobs</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">20K+</div>
                <div className="stat-label">Companies</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">100K+</div>
                <div className="stat-label">Candidates</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">15K+</div>
                <div className="stat-label">Success Hires</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="container">
        <div className="cta-section">
          <h2>Ready to Take the Next Step?</h2>
          <p className="mb-4 opacity-75">Join thousands of professionals and companies already using JobPortal.</p>
          <Link to="/signup" className="btn btn-landing btn-light text-primary">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-5 bg-white border-top">
        <div className="container text-center">
          <h4 className="text-primary fw-bold mb-3">JobPortal</h4>
          <p className="text-muted mb-4">Connecting Talent with Opportunity, Anywhere.</p>
          <div className="d-flex justify-content-center gap-4 mb-4">
            <a href="#" className="text-muted"><i className="bi bi-facebook fs-5"></i></a>
            <a href="#" className="text-muted"><i className="bi bi-twitter-x fs-5"></i></a>
            <a href="#" className="text-muted"><i className="bi bi-linkedin fs-5"></i></a>
            <a href="#" className="text-muted"><i className="bi bi-instagram fs-5"></i></a>
          </div>
          <p className="text-muted small mb-0">© 2026 JobPortal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
