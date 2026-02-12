# Delivery Module

This module manages the delivery planning, tracking, and history for sites.

## Directory Structure

- `pages/`: Top-level page components (e.g., `DeliveryPlanPage.jsx`).
- `components/`:
  - `layout/`: Layout components like tabs and headers.
  - `plan/`: Main "Delivery Plan" view components.
  - `summary/`: "Year Summary" view components.
  - `completed/`: "Completed Delivery" view components.
  - `history/`: "Change History" view components.
  - `snapshot/`: Snapshot management components.
  - `filters/`: Reusable filter bars.
  - `table/`: Reusable table components (`PlanTable`, `SummaryTable`, etc.).
  - `modals/`: All modal dialogs.
- `hooks/`: Custom React hooks (`usePlanFilter`, `useModal`, etc.).
- `utils/`: Helper functions (`summaryUtils.js`).
- `data/`: Mock data and constants.

## Key Components

### DeliveryPlan (`components/plan/DeliveryPlan.jsx`)
The main interactive planning view. Features:
- Snapshot management
- Filtering by item type (Bidet/All)
- Inline editing of plan details
- Partial delivery and completion actions

### YearSummary (`components/summary/YearSummary.jsx`)
Read-only summary of delivery performance by year.

### CompletedDeliveryList (`components/completed/CompletedDeliveryList.jsx`)
List of completed deliveries with monthly filtering and yearly performance reports.

## Architecture Notes
- State management for complex views is handled via custom hooks in `hooks/`.
- Common logic like summary calculations is extracted to `utils/`.
- `PlanTable` and `SummaryTable` are designed to be reusable where possible.
