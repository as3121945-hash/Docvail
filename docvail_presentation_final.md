# Docvail: Official Solution Challenge 2026 PPT Content
*This document is perfectly mapped to the exact headers provided in your `[EXT] Solution Challenge 2026 - Prototype PPT Template.pptx` file.*

---

## Slide 2: Team Details
*   **a. Team name:** Docvail Team
*   **b. Team leader name:** Ankit Solanki
*   **c. Problem Statement:** Bridging the gap in healthcare accessibility (**SDG 3: Good Health & Well-being**) by solving the patient dilemma of not knowing *which* specialist to consult and *when* they are available, reducing dangerous delays in medical diagnosis.

---

## Slide 3: Brief about your solution
Docvail is a comprehensive healthcare discovery and real-time booking ecosystem. It acts as an intelligent bridge between patients and providers. 
First, it uses **Google Vertex AI (Gemini 2.5 Flash)** to analyze a patient's natural-language symptoms (including "Hinglish") to accurately determine the required medical specialty. Then, it instantly connects the patient to a live database of verified doctors in their city, showing real-time slot availability for immediate booking without the need for phone calls or waiting rooms.

---

## Slide 4: Opportunities
*   **a. How different is it from existing ideas?** Traditional platforms act as simple phonebooks (you have to know what kind of doctor you need) or symptom checkers (which only give advice, not an appointment). Docvail merges both: AI Triage directly feeds into Live Booking.
*   **b. How will it solve the problem?** It eliminates the "knowledge gap" (AI tells you who to see) and the "access gap" (Live scheduling tells you exactly when they are free).
*   **c. USP of the proposed solution:** The seamless integration of Google's state-of-the-art conversational AI (**Vertex AI**) with a secure, multi-tenant hospital scheduling architecture, accessible even to users typing in regional dialects.

---

## Slide 5: List of features offered by the solution
1.  **AI Symptom Analyzer:** Parses complex, unstructured symptom descriptions into precise medical specialties using Vertex AI.
2.  **Dynamic Real-Time Scheduling:** Patients view live availability grids for doctors and can book instant, confirmed time slots.
3.  **Provider Workflow Efficiency:** Dedicated dashboards for Hospitals and Doctors to manage their profiles, schedules, and incoming patient leads with zero manual queues.
4.  **Secure Authentication:** High-security, Dual-Identifier (Email/Mobile) login flow with OTP verification for both patients and providers.

---

## Slide 6: Process flow diagram or Use-case diagram
*(Use `docvail_flow_vertex.png` from your Downloads)*
1.  **Input:** Patient enters symptoms ("Chest pain and dizziness, Jaipur").
2.  **Processing:** Google Vertex AI translates input -> Output: `Cardiologist`.
3.  **Database Query:** Backend searches MongoDB for Cardiologists in Jaipur.
4.  **Display & Selection:** Real-time slots are displayed; Patient selects `10:00 AM`.
5.  **Confirmation:** Booking is saved and confirmed via OTP.

---

## Slide 7: Wireframes/Mock diagrams of the proposed solution
*(Use your live MVP screenshots here as they are better than wireframes).*

---

## Slide 8: Architecture diagram of the proposed solution
*(Use `docvail_architecture_vertex.png` from your Downloads)*
*   **Frontend (User Interface):** React.js + Tailwind CSS -> **Deployed on Google Firebase Hosting**.
*   **Intelligence Layer (AI Engine):** **Google Vertex AI (Gemini 2.5 Flash)** for enterprise-grade NLP.
*   **Backend API (Business Logic):** Node.js + Express.js -> **Deployed on Google Cloud Run** (Serverless).
*   **Database (Data Storage):** MongoDB Atlas Cloud Cluster.
*   **DevOps:** **Google Cloud Logging & Monitoring** for real-time system health tracking.
*   **Payment Gateway:** **Google Pay API** + Razorpay for secure digital transactions.

---

## Slide 9: Technologies to be used in the solution
*   **Google Technologies:** **Google Vertex AI** (Gemini 2.5), **Google Cloud Run** (Compute), **Google Firebase Hosting** (CDN), **Google Pay API** (Payments), and **Google Cloud Logging**.
*   **Frontend:** React, TailwindCSS, Axios.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB.
*   **Payment Gateway:** Razorpay (UPI, NetBanking, and Card processing).
*   **Security:** JSON Web Tokens (JWT), Bcrypt.

---

## Slide 10: Implementation & Setup Roadmap

### Phase 1: Prototype Status (Current)
*   **Total Monthly Cost: ₹0**
*   **Strategy:** Leveraging Google for Startups credits and generous Free Tiers for Vertex AI, Cloud Run, and Firebase Spark Plan.

### Phase 2: Pilot Implementation (Target: 1 District / 15+ Clinics)
*   **Cloud Infrastructure Setup:** ~₹15,000 (Vertex AI & Cloud Run production scaling).
*   **Hospital Digitalization:** ~₹75,000 (One-time setup for clinic dashboards & staff training).
*   **Regulatory Compliance:** ~₹40,000 (ABHA/ABDM integration & security audits).
*   **Local Patient Awareness:** ~₹50,000 (On-ground banners & localized SMS outreach).
*   **Total Setup Budget:** **~₹1.80 Lakh (Pilot Ready)**

---

## Slide 11: Snapshots of the MVP
*(Paste screenshots of your live website here)*
*   **Snapshot 1:** Homepage showing the AI Symptom input bar.
*   **Snapshot 2:** Search results showing Doctor Cards with the Glassmorphism design.
*   **Snapshot 3:** Login/OTP verification screen.

---

## Slide 12: Additional Details/Future Development
1.  **Hybrid Payment Ecosystem:** Full deployment of **Google Pay API** for digital users and "Pay at Counter" offline support.
2.  **Regional Language Voice Support:** Utilizing Google Speech-to-Text for 10+ Indian languages.
3.  **Telemedicine Integration:** Adding secure WebRTC video consultations.
4.  **Google Maps Integration:** Embedding Maps API for clinic navigation and live traffic.

---

## Slide 13: Provide links to your:
*   **1. GitHub Public Repository:** [Link to your GitHub repo]
*   **2. Demo Video Link (3 Minutes):** [Link to your Unlisted YouTube video]
*   **3. MVP Link:** [https://docvail-26827.web.app](https://docvail-26827.web.app)
*   **4. Working Prototype Link:** [https://docvail-26827.web.app](https://docvail-26827.web.app)