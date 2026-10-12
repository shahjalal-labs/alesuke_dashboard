# 🏛️ Alesuke Dashboard — Estate Custody & Will Preparation Admin Portal

![UI Architecture Banner](https://github.com/shahjalal-labs/alesuke_dashboard/blob/main/assets/banner.svg)

---

## 📌 Executive Overview

**Alesuke Dashboard** is an enterprise-grade administrative and operations command center engineered for the Alesuke Digital Estate & Legacy Custody ecosystem. Built with **Next.js 16 (App Router, Turbopack)**, **Ant Design**, **Redux Toolkit (RTK Query)**, and **Tailwind CSS**, this platform delivers complete managerial oversight over legal will preparation workflows, estate asset verification, user dispute resolution, subscription billing, and multi-tier role authorization.

---

## 🚀 Key Administrative & Domain Capabilities

- **User & Beneficiary Oversight:** Comprehensive management of estate creators, designated beneficiaries, account verifications, and audit trails.
- **Dispute & Compliance Resolution:** Structured workflows for handling contested inheritance allocations, clause disputes, and documentation verification.
- **Sales & Financial Analytics:** Visualized gross volume, active custody subscriptions, churn metrics, and revenue trajectories powered by **Recharts**.
- **Discount & Coupon Engine:** Creation, tracking, and redemption management for seasonal estate planning promotion codes and legal partner vouchers.
- **Order & Estate Inventory Auditing:** Centralized audit tables for tracking drafted testamentary wills, tangible property registries, and physical storage custody orders.
- **Secure Authentication & RBAC:** Multi-factor OTP verification, session token persistence via `js-cookie`, and protected administrative route guards.

---

## 🏛️ Application Architecture & Route Tree

```text
alesuke_dashboard/
├── assets/
│   └── banner.svg                     # High-resolution architectural banner
├── src/
│   ├── app/
│   │   ├── (auth)/                    # Admin authentication & credential recovery
│   │   │   ├── login/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   └── verify-otp/
│   │   ├── (dashboard)/               # Protected administrative layout & pages
│   │   │   ├── admin/                 # Role-restricted operations
│   │   │   ├── layout.tsx             # Root dashboard navigation & sidebar provider
│   │   │   └── page.tsx               # Analytics overview & operational metrics
│   │   ├── layout.tsx                 # Global root layout with Redux provider
│   │   └── globals.css                # Tailwind CSS styling and theme primitives
│   ├── components/
│   │   ├── Admin/                     # Module management panels
│   │   │   ├── DiscountCoupon/        # Voucher & promotional code manager
│   │   │   ├── DisputeManagement/     # Legal claim & dispute tickets
│   │   │   ├── OrderList/             # Custody order & plan fulfillment
│   │   │   ├── Products/              # Estate tier & service catalog
│   │   │   ├── sales-activity/        # Transaction breakdown & charts
│   │   │   └── user-management/       # Estate creator identity tables
│   │   ├── Auth/                      # Form layouts, OTP input & credentials
│   │   ├── dashboard/                 # Sidebar, Topbar, and KPI card widgets
│   │   └── table/                     # Data grids, pagination, and filter modals
│   ├── redux/
│   │   ├── api/                       # RTK Query service slices (Auth, Admin, Orders)
│   │   └── store.ts                   # Centralized application store with Redux Persist
│   ├── schema/                        # Zod form validation schemas
│   └── types/                         # TypeScript interfaces & domain models
├── package.json                       # Next.js 16, React 18, Ant Design, RTK
└── tsconfig.json                      # Strict TypeScript compiler options
```

---

## 💻 Tech Stack Specification

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (Turbopack, App Router, React 18) |
| **UI Design System** | Ant Design 5, Radix UI Primitives, Lucide Icons |
| **State & API Caching** | Redux Toolkit (RTK), RTK Query, Redux Persist |
| **Styling & Animation** | Tailwind CSS 3.4, PostCSS, Tailwindcss-Animate |
| **Data Visualization** | Recharts, React Organizational Chart |
| **Form Validation** | React Hook Form, Zod Resolver |
| **Authentication** | JWT Decode, JS Cookie, Input OTP, SweetAlert2 |
| **Language** | TypeScript 5 (Strict Mode) |

---

## 🛠️ Getting Started & Local Development

### Prerequisites

- **Node.js:** `v20.x` or higher
- **Package Manager:** `npm`, `yarn`, or `pnpm`

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/shahjalal-labs/alesuke_dashboard.git
cd alesuke_dashboard
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run Development Server (Turbopack)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the administrative dashboard.

---

## 👨‍💻 Engineering & Authorship

Developed and engineered by **Md. Shahjalal**.

- **GitHub:** [@shahjalal-labs](https://github.com/shahjalal-labs)
- **Email:** [muhommodshahjalal@gmail.com](mailto:muhommodshahjalal@gmail.com)

---

## 📄 License

This project is licensed under the **ISC License**.
