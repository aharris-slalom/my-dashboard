# Project Pulse: Hospital Cold-Chain Operations Dashboard

**Client:** FastForward Logistics (Medical Division)  
**Target User:** VP of Operations, North Dallas Medical Center  
**Persona:** Executive stakeholder focused on risk mitigation, financial exposure, and regulatory compliance.

---

## 1. Project Vision
A high-tech, vibrant, and responsive SaaS dashboard designed for iPad and Laptop. The application monitors high-value medical assets (blood, vaccines, biologics) in real-time, prioritizing "At-Risk" assets to drive immediate operational intervention and prevent loss.

## 2. The "North Star" Metric
**Total Value at Risk ($)**: A dynamic, real-time calculation summing the `asset_value` of all units currently in a "Critical" state (temperature excursion exceeding safety thresholds).

## 3. Team Roles
*   **UX Architect (User):** Responsible for information architecture, visual design language, and user journey optimization.
*   **Senior Full Stack Developer (AI):** Responsible for implementing modular React components, robust state management, and the real-time simulation engine.

## 4. Tech Stack
*   **Framework:** React / Vite (Fast HMR for prototyping)
*   **Styling:** Tailwind CSS (Utilizing glassmorphism and custom brand colors)
*   **Components:** Radix UI (Primitives) + Framer Motion (Transitions)
*   **Icons:** Lucide-React
*   **State Management:** React Context API (to manage simulation state globally)

## 5. Page Structure & Layout
*   **Main Dashboard:** 3-column "Bento" grid featuring Vitals, Exceptions, and 24h Trends.
*   **Sidebar Navigation:** Permanent on Desktop (Left); collapsible "Drawer" on iPad.
*   **Unit Detail Slide-over:** A right-aligned Radix UI Drawer that appears when a unit card is clicked, showing granular logs and sensor health.
*   **Logistics Map View:** A dedicated screen for tracking FastForward courier vehicles via a dark-mode monochrome map.

## 6. Design System
*   **Background:** Deep Charcoal/Navy (`#0f172a`)
*   **Cards:** Glassmorphic surfaces (`bg-white/5`, `backdrop-blur-xl`, `border-white/10`)
*   **Accents:**
    *   **Neon Emerald:** `#10b981` (Safe/Optimal status)
    *   **Vivid Coral:** `#fb7185` (Critical/Risk status)
    *   **Electric Blue:** `#3b82f6` (Data/In-Transit status)
*   **Typography:** Inter or Geist Sans (Modern, high-readability sans-serif)

## 7. Behavioral Logic & Simulation
*   **Current Phase:** 100% Client-side Mocking. The system uses a `Service Layer` pattern to allow for future API integration.
*   **Threshold Logic:**
    *   **Optimal:** Temperature is within `min` and `max` range.
    *   **Warning:** Outside range for **< 10 seconds** (Visual: Static Orange).
    *   **Critical:** Outside range for **> 10 seconds** (Visual: Pulsing Red + Value at Risk update).
    *   *Note: Returning to range resets status to Optimal immediately.*
*   **Audit Mode Behavior:** 
    *   **Visuals:** Swaps "Live Data" components for "Compliance Log" components.
    *   **Data Filter:** Focuses on resolved/unresolved critical incidents, ignoring transient fluctuations.
*   **Live Heartbeat:** A `useHeartbeat` hook fluctuates temp by ±0.1°C every 3s (controlled by `VITE_SIMULATION_SPEED`).

## 8. Responsiveness Rules
*   **Laptop (1024px+):** Full 3-column bento grid.
*   **iPad Landscape:** 3-column grid; sidebar becomes icons-only.
*   **iPad Portrait (768px):** 1-column stack; Vitals bar becomes a horizontal carousel.
*   **Touch Targets:** Minimum `44px x 44px` for all interactive elements.

## 9. User Stories and Acceptance Criteria
*   **US1: Executive Visibility:** As a VP, I want to see the "Total Value at Risk" update in real-time so I can quantify exposure instantly.
    *   *AC:* Metric must reactively sum values from all units in `critical` status.
*   **US2: Critical Response:** As a VP, I want "Critical" units to be visually distinct with motion so they command immediate attention.
    *   *AC:* Use Framer Motion for a "breathing" red glow and scale effect on critical cards.
*   **US3: Compliance Audit:** As a VP, I want to toggle "Audit Mode" to show inspectors a clean view of historical stability.
    *   *AC:* Global state toggle (`isAuditMode`) must trigger a conditional UI swap across all widgets.

## 10. Deployment and Environment
*   **Platform:** Vercel (Production: `main` branch; Preview: `develop` branch).
*   **Env Variables:** `VITE_SIMULATION_SPEED` (ms) to control heartbeat frequency.