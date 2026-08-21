# FoodBridge — Master Figma UI/UX Design Prompt

Design the complete **FoodBridge** frontend as a production-quality, modern cloud-native web application for surplus food rescue and last-mile distribution.

FoodBridge connects **donors, NGOs, volunteers, and platform administrators** through an event-driven food rescue network.

The frontend must be designed as a **real SaaS/product experience**, not as a generic college-project dashboard.

The design must support the complete workflow:

**Donor creates surplus food donation → donation is validated and published → matching system finds suitable NGO → NGO receives and accepts offer → delivery service finds volunteer → volunteer accepts delivery → food is picked up → delivery is tracked → food is delivered → impact/analytics are updated → relevant users receive notifications.**

## The backend architecture uses separate Identity, Donation, Matching, Delivery, Notification, and Analytics capabilities, with API Gateway, Keycloak authentication, Kafka event communication, Redis, PostgreSQL, MongoDB, Elasticsearch, WebSockets, and analytics infrastructure. The frontend should expose these capabilities through intuitive user experiences without exposing unnecessary backend complexity.

# 1. PRODUCT IDENTITY

## Product Name

**FoodBridge**

## Product Positioning

**A cloud-native platform for surplus food rescue and community distribution.**

## Core message

**Rescue surplus food. Connect communities. Create measurable impact.**

## Product goals

The interface must make it extremely easy to:

1. Donate surplus food.
2. Find and connect with suitable NGOs.
3. Match food requirements with available donations.
4. Coordinate volunteers.
5. Track food deliveries.
6. Measure social and environmental impact.
7. Manage organizations, users, verification, and platform operations.

The product should communicate:

* Trust
* Community
* Sustainability
* Reliability
* Transparency
* Technology
* Real-world impact

Avoid making the UI look like a generic logistics company.

The product should feel like a combination of:

**modern SaaS dashboard + social-impact platform + logistics platform + intelligent matching system.**

---

# 2. DESIGN PHILOSOPHY

Create a polished, modern, accessible and scalable interface.

Visual direction:

* Modern SaaS
* Minimal but expressive
* Premium
* Clean information hierarchy
* Generous whitespace
* Soft rounded corners
* Strong typography
* Subtle gradients
* Subtle glass effects
* Meaningful animation
* Accessible contrast
* Responsive layouts
* Data-rich but not visually overwhelming

Do not overuse:

* Neon effects
* Excessive glassmorphism
* Giant gradients
* Excessive shadows
* Excessive animated backgrounds
* Decorative elements that interfere with usability

Animations should communicate state, progress, connection or feedback.

The design should look believable as a real startup product.

---

# 3. DESIGN SYSTEM

Create a complete reusable design system in Figma before designing individual pages.

## Typography

Use a modern sans-serif typeface.

Recommended hierarchy:

* Display / Hero
* H1
* H2
* H3
* H4
* Body Large
* Body
* Body Small
* Caption
* Label
* Button
* Metric / Number

Use strong hierarchy rather than excessive font sizes.

## Color system

Create semantic tokens:

### Brand

* Primary
* Primary foreground
* Secondary
* Accent

### Surface

* Background
* Surface
* Elevated surface
* Card
* Overlay

### Text

* Primary
* Secondary
* Muted
* Disabled

### Semantic

* Success
* Warning
* Error
* Info
* Pending

### Donation status

* Draft
* Published
* Matched
* Accepted
* Pickup
* Delivered
* Expired
* Cancelled

Color must not be the only indicator of status. Combine colors with labels/icons.

---

# 4. COMPONENT LIBRARY

Build reusable Figma components.

Include:

## Navigation

* Sidebar
* Top navigation
* Mobile navigation
* Breadcrumb
* Tab navigation
* Command palette
* User menu
* Notification menu

## Buttons

* Primary
* Secondary
* Outline
* Ghost
* Destructive
* Icon button
* Loading button

States:

* Default
* Hover
* Pressed
* Focus
* Disabled
* Loading

## Form controls

* Input
* Textarea
* Select
* Combobox
* Search
* Checkbox
* Radio
* Switch
* Slider
* Date picker
* Time picker
* File uploader
* Location selector

## Feedback

* Toast
* Alert
* Banner
* Dialog
* Confirmation dialog
* Drawer
* Modal
* Tooltip
* Popover
* Skeleton
* Empty state
* Error state
* Loading state

## Data components

* Data table
* Pagination
* Filter
* Sort
* Status badge
* Avatar
* Avatar group
* Stat card
* Progress
* Timeline
* Activity feed
* Chart
* Metric card

## FoodBridge-specific components

Create dedicated components:

* Donation Card
* Donation Status
* Food Item Card
* Match Score Card
* NGO Card
* Organization Card
* Volunteer Card
* Delivery Card
* Delivery Timeline
* Delivery Status
* Live Delivery Map
* Pickup Window
* Expiry Countdown
* Compatibility Score
* Impact Metric
* Notification Item
* Verification Card
* Food Safety Card
* Route Summary
* Delivery Proof Card

---

# 5. VISUAL EFFECTS

Use premium visual effects selectively.

For the public-facing marketing pages, use concepts inspired by:

* Aceternity UI
* React Bits
* Framer Motion-style interactions

Potential visual treatments:

* Aurora background
* Spotlight
* Animated grid
* Background beams
* Moving border
* Hover card
* Glowing card
* Text reveal
* Animated number counter
* Scroll reveal
* Timeline animation

Do NOT use these effects heavily inside operational dashboards.

Operational pages must prioritize clarity.

---

# 6. INFORMATION ARCHITECTURE

Create the following major application areas.

## Public

* Landing page
* About FoodBridge
* How it works
* Impact
* Organizations
* Sign in
* Register

## Authenticated

Role-dependent application:

### Donor

* Dashboard
* Donations
* Create Donation
* Donation Details
* Organization
* Impact
* Notifications
* Profile
* Settings

### NGO

* Dashboard
* Food Requirements
* Available Donations
* Matching Offers
* Accepted Donations
* Deliveries
* Impact
* Notifications
* Profile
* Settings

### Volunteer

* Dashboard
* Available Deliveries
* My Deliveries
* Delivery Details
* Live Tracking
* Delivery History
* Notifications
* Profile
* Settings

### Platform Admin

* Dashboard
* Users
* Organizations
* Verification
* Donations
* Matching
* Deliveries
* Volunteers
* Notifications
* Analytics
* Audit Logs
* Settings

The available platform roles include DONOR_ADMIN, DONOR_STAFF, NGO_ADMIN, NGO_STAFF, VOLUNTEER, PLATFORM_ADMIN and AUDITOR.

---

# 7. PUBLIC LANDING PAGE

Create a visually impressive responsive landing page.

## Hero

Headline:

**Rescue surplus food. Create real impact.**

Supporting text:

FoodBridge connects surplus food donors with NGOs and volunteers to move food quickly from excess supply to communities that need it.

Primary CTA:

**Start Rescuing Food**

Secondary CTA:

**Explore the Network**

Visual:

A sophisticated animated network visualization showing:

**Donor → Food → Matching → Volunteer → NGO → Impact**

Use subtle particles, lines or nodes.

## Impact statistics

Display example metrics:

* Food Rescued
* Meals Distributed
* Active NGOs
* Active Volunteers

Clearly label example/demo data where appropriate.

## How FoodBridge Works

Four or five stages:

1. Donate
2. Match
3. Accept
4. Deliver
5. Measure Impact

## Intelligent matching section

Explain that FoodBridge evaluates:

* Distance
* Expiration urgency
* Food requirement match
* NGO capacity
* Dietary compatibility
* NGO reliability

The architecture defines these matching factors with weights of 30%, 25%, 20%, 10%, 10%, and 5% respectively.

Visualize this with a polished score visualization.

## Real-time logistics section

Show a delivery map with:

* Donor location
* Volunteer route
* NGO destination
* ETA
* Delivery status

## Impact section

Visualize:

* Food rescued
* Meals distributed
* Carbon emissions avoided
* Successful donation percentage

These are core analytics concepts in the product architecture.

## Final CTA

**Turn surplus into impact.**

Buttons:

**Join FoodBridge**

**Become a Partner**

---

# 8. AUTHENTICATION

Design:

## Login

* Logo
* Email
* Password
* Remember me
* Sign in
* Forgot password
* Registration link

## Organization registration

Make this a multi-step wizard.

### Step 1

Choose organization/user type:

* Donor
* NGO
* Volunteer

### Step 2

Basic information

### Step 3

Organization information

### Step 4

Address/location

### Step 5

Verification documents

### Step 6

Confirmation

Include:

* Progress indicator
* Back
* Continue
* Save progress
* Validation errors
* Success state

---

# 9. ONBOARDING

After first login, show role-specific onboarding.

## Donor onboarding

Collect:

* Organization information
* Default pickup location
* Food categories
* Contact information

## NGO onboarding

Collect:

* Organization information
* Service area
* Food requirements
* Capacity
* Dietary requirements
* Pickup capabilities

## Volunteer onboarding

Collect:

* Profile
* Service area
* Availability
* Vehicle/transport information
* Preferred delivery radius

---

# 10. SHARED DASHBOARD STRUCTURE

Create a reusable dashboard shell.

Desktop:

```text
Sidebar | Header
        | Page content
        | Cards
        | Charts
        | Tables
```

Sidebar must contain:

* FoodBridge logo
* Role label
* Navigation
* Notification indicator
* Profile

Header contains:

* Breadcrumb
* Page title
* Search / command menu
* Notifications
* User menu

Mobile:

* Compact header
* Bottom navigation or drawer
* Responsive cards
* Full-width tables converted into cards

---

# 11. DONOR EXPERIENCE

## Donor dashboard

Top metrics:

* Total donations
* Food rescued
* Successful donations
* Meals distributed
* Active donations

Show:

* Donation activity chart
* Recent donations
* Donation status distribution
* Upcoming pickups
* Impact summary

## My Donations

Provide:

* Search
* Filter
* Status filter
* Date filter
* Category filter
* Table/list toggle

Columns:

* Donation
* Food
* Quantity
* Status
* NGO
* Pickup
* Expiry
* Actions

## Create Donation

Design a production-quality multi-section form.

Sections:

### Food information

* Food name
* Category
* Quantity
* Unit
* Description
* Dietary information

### Food safety

* Preparation time/date
* Expiry
* Storage information
* Safety notes

### Pickup

* Pickup address
* Pickup window
* Contact person
* Instructions

### Images

* Upload food images
* Preview
* Remove image

Actions:

**Save Draft**

**Publish Donation**

The donation service supports creating, updating before publishing, uploading food images, validating food-safety information, publishing, cancelling and expiring donations.

---

# 12. DONATION DETAILS

Create a highly informative details page.

Header:

**Donation #DON-2026-000124**

Status badge.

Show:

* Food image
* Food name
* Category
* Quantity
* Dietary information
* Donor
* Pickup location
* Pickup window
* Expiry countdown

## Lifecycle timeline

Create:

Created → Validated → Published → Matched → Accepted → Pickup → Delivered

Show timestamps and responsible actors.

## Match section

Show:

* Matched NGO
* Compatibility score
* Distance
* Matching reasons
* Offer status

## Delivery section

Show:

* Volunteer
* Current status
* ETA
* Route
* Pickup confirmation
* Delivery confirmation

---

# 13. NGO EXPERIENCE

## NGO dashboard

Metrics:

* Active requirements
* Available matches
* Accepted donations
* Pending pickups
* Food received
* Meals distributed

## Food requirements

CRUD interface:

* Requirement name
* Category
* Quantity
* Dietary requirements
* Service area
* Capacity
* Required date/time

## Available donations

Use rich donation cards.

Each card shows:

* Food
* Quantity
* Distance
* Expiry
* Compatibility
* Pickup time
* Donor
* Match score

Primary action:

**View Offer**

Secondary action:

**Accept**

---

# 14. MATCHING EXPERIENCE

This should be one of the signature FoodBridge screens.

Create an explanation of the matching score:

```text
Compatibility Score
94%
```

Breakdown:

```text
Distance                 30%    ███████████████
Expiration urgency       25%    ████████████
Food requirement match   20%    ██████████
NGO capacity             10%    █████
Dietary compatibility    10%    █████
Reliability               5%    ██
```

Then show:

**Recommended NGO**

with:

* Organization
* Distance
* Capacity
* Reliability
* Dietary compatibility
* Acceptance probability / recommendation indicator

Do not make unsupported AI claims. Describe it as a **matching/recommendation system**, consistent with the architecture.

---

# 15. VOLUNTEER EXPERIENCE

## Volunteer dashboard

Metrics:

* Available deliveries
* Active delivery
* Completed deliveries
* Food delivered
* Volunteer impact

## Available deliveries

Display:

* Pickup location
* Drop-off location
* Distance
* Estimated duration
* Food quantity
* Pickup time
* Delivery priority

Primary CTA:

**Accept Delivery**

## My deliveries

Tabs:

* Active
* Upcoming
* Completed

---

# 16. DELIVERY TRACKING

Make this a flagship interface.

Screen structure:

```text
------------------------------------------------
Delivery header
------------------------------------------------
Status / ETA / Delivery ID

----------------------+-------------------------
                      |
       LIVE MAP       | Delivery information
                      |
       Donor 📍       | Pickup ✓
          ↓           | In Transit ●
         🚚           | Delivered ○
          ↓           |
       NGO 📍         |
                      |
----------------------+-------------------------

Volunteer information

Delivery timeline

Proof of delivery

Actions
```

Use a real map-style visual.

Show:

* Donor marker
* Volunteer marker
* NGO marker
* Route
* ETA
* Current status
* Last updated

The backend architecture explicitly supports nearby-volunteer search, live location tracking, route optimization, delivery proof and real-time WebSocket updates.

---

# 17. PICKUP EXPERIENCE

When volunteer arrives:

Show a step-by-step flow.

### Step 1

Arrived at pickup

### Step 2

Verify donation

### Step 3

Confirm quantity

### Step 4

Take pickup photo/proof

### Step 5

Mark food picked up

Use a confirmation dialog and clear status progression.

---

# 18. DELIVERY COMPLETION

Show:

* Destination
* Recipient
* Quantity delivered
* Delivery time
* Proof image
* Signature/confirmation if supported
* Notes

Primary CTA:

**Complete Delivery**

Then show a successful completion animation.

---

# 19. NOTIFICATION SYSTEM

Create:

## Notification center

Categories:

* Donations
* Matches
* Deliveries
* System

Examples:

* New donation matched
* NGO accepted your donation
* Volunteer assigned
* Pickup completed
* Delivery completed
* Donation expired
* Delivery failed

The Notification Service consumes business events including donation publication, matching, acceptance, volunteer assignment, pickup, delivery, expiration and failure.

---

# 20. ANALYTICS DASHBOARD

Create a sophisticated impact dashboard.

## Top metrics

* Total food rescued
* Estimated meals distributed
* Carbon emissions avoided
* Successful donation rate
* Average matching time
* Average delivery time
* Donation expiration rate
* Volunteer completion rate

These metrics are defined in the architecture.

## Charts

Create:

* Food rescued over time
* Donations by category
* Donation success rate
* Average matching time
* Delivery completion time
* Geographic distribution
* NGO performance
* Volunteer activity

Use chart cards with clear labels and accessible legends.

---

# 21. DONOR IMPACT REPORT

Create a report screen showing:

**Your Impact**

* Food rescued
* Meals contributed
* Donations completed
* Organizations supported
* Estimated environmental impact

Allow:

**View Report**

**Export Report**

---

# 22. NGO IMPACT REPORT

Show:

* Donations received
* Food received
* Meals distributed
* Delivery success
* Donor partners
* Volunteer support

---

# 23. ADMIN DASHBOARD

Design a more operational interface.

## Overview

Show:

* Total users
* Active organizations
* Active donations
* Active deliveries
* Matching success
* Platform food rescued
* Platform impact

## User management

Data table:

* User
* Organization
* Role
* Status
* Created
* Last activity
* Actions

## Organization verification

Cards/table showing:

* Organization
* Type
* Submitted date
* Documents
* Status
* Reviewer
* Actions

Actions:

**Approve**

**Reject**

**Request Information**

## Donation monitoring

Show:

* Active
* Matched
* Delivered
* Expired
* Cancelled

## Delivery monitoring

Show:

* Active deliveries
* Failed deliveries
* Delayed deliveries
* Completed deliveries

---

# 24. AUDIT LOGS

Create an enterprise-style audit log screen.

Columns:

* Timestamp
* User
* Role
* Action
* Resource
* Resource ID
* IP/device if supported
* Result

Include filters and search.

Do not invent sensitive fields that are not actually planned in the backend.

---

# 25. PROFILE AND SETTINGS

Create reusable settings pages.

Sections:

* Profile
* Organization
* Notifications
* Security
* Preferences
* Location
* Connected services

Use tabs or settings navigation.

---

# 26. SYSTEM STATES

For every major screen, design all important states.

Create Figma variants for:

### Loading

Skeletons, not blank screens.

### Empty

Examples:

**No donations yet**

**Create your first donation to start rescuing food.**

### Error

Clear human-readable message.

### Permission denied

Explain why the user cannot access the resource.

### Offline

Show appropriate retry messaging.

### Success

Show confirmation.

### Expired

Clearly communicate that an action is no longer available.

### Processing

Show progress where an operation is asynchronous.

---

# 27. RESPONSIVE DESIGN

Design every major screen in:

### Desktop

1440px

### Laptop

1280px

### Tablet

768px

### Mobile

390px

Do not simply scale the desktop design down.

Adapt layouts.

Examples:

Desktop table:

**Table**

Mobile:

**Stacked donation cards**

Desktop sidebar:

**Mobile drawer/bottom navigation**

Desktop two-column delivery screen:

**Mobile map above details**

---

# 28. ACCESSIBILITY

Design for:

* Keyboard navigation
* Visible focus
* Adequate contrast
* Clear form validation
* Descriptive labels
* Non-color-only status
* Touch-friendly mobile controls
* Clear error messages

Do not make the interface depend entirely on animation.

---

# 29. SEARCH AND COMMAND PALETTE

Create a global search experience.

Keyboard shortcut:

**Ctrl/Cmd + K**

Search:

* Donations
* Organizations
* Users
* Deliveries
* Requirements

Quick actions:

* Create donation
* Create requirement
* Accept delivery
* Open analytics
* Notifications
* Settings

---

# 30. PAGE TRANSITIONS AND MICRO-INTERACTIONS

Use subtle animation for:

* Page transitions
* Card hover
* Status changes
* Progress changes
* Number counters
* Timeline progression
* Donation published confirmation
* Match score visualization
* Delivery completion
* Toast notifications
* Notification arrival

Do not animate every UI element.

---

# 31. IMPORTANT DESIGN RULE

Separate the **marketing experience** from the **operational product experience**.

Marketing:

More visual.

More expressive.

More animation.

More Aceternity/React Bits.

Application:

More functional.

More data-focused.

More shadcn-style components.

Minimal animation.

This distinction is critical.

---

# 32. FIGMA FILE STRUCTURE

Create the Figma project with these pages:

```text
00 — Cover
01 — Design Tokens
02 — Foundations
03 — Components
04 — Marketing
05 — Authentication
06 — Donor
07 — NGO
08 — Volunteer
09 — Admin
10 — Delivery & Maps
11 — Analytics
12 — Responsive
13 — Prototype Flows
14 — Developer Handoff
```

---

# 33. COMPONENT NAMING

Use consistent naming:

```text
Button/Primary
Button/Secondary
Card/Donation
Card/Match
Card/Delivery
Card/Impact
Badge/Status
Form/Donation
Form/Organization
Navigation/Sidebar
Navigation/Mobile
Modal/Confirmation
Map/Delivery
Timeline/Donation
Chart/Impact
```

Use Auto Layout and component variants.

Create design tokens for:

* Colors
* Typography
* Radius
* Spacing
* Shadows
* Borders
* Motion

---

# 34. PROTOTYPE THE MAIN USER JOURNEYS

At minimum, create interactive Figma prototypes for these flows.

## Journey 1 — Donor

```text
Landing
→ Register
→ Donor onboarding
→ Dashboard
→ Create donation
→ Publish
→ Donation details
→ NGO matched
→ Delivery tracking
→ Delivered
→ Impact
```

## Journey 2 — NGO

```text
Login
→ Dashboard
→ Requirements
→ Available donation
→ Match details
→ Accept
→ Delivery tracking
→ Delivery completed
```

## Journey 3 — Volunteer

```text
Login
→ Dashboard
→ Available delivery
→ Delivery details
→ Accept
→ Pickup
→ Live tracking
→ Complete delivery
```

## Journey 4 — Admin

```text
Login
→ Admin dashboard
→ Organization verification
→ User management
→ Donation monitoring
→ Delivery monitoring
→ Analytics
→ Audit logs
```

---

# 35. FINAL DESIGN QUALITY

The final Figma design must communicate that FoodBridge is:

**a real, scalable, production-oriented platform rather than a simple CRUD application.**

The visual hierarchy should make the core business process obvious:

**Food → Match → Deliver → Impact**

The strongest visual elements should be:

1. Food donation experience
2. Intelligent matching
3. Live delivery tracking
4. Impact analytics

These four areas should become the signature of the product.

Do not invent product functionality merely to make the screens look impressive. Every major interface element should correspond to a real FoodBridge workflow, role, event or backend capability described in the architecture. The backend specifically uses asynchronous events for donation publication, matching, acceptance, volunteer assignment, pickup and delivery completion, so the frontend should represent those states clearly rather than pretending everything is instantaneous.

## FINAL Figma DELIVERABLE

Produce a complete responsive design system and application containing:

* Public marketing website
* Authentication
* Onboarding
* Donor application
* NGO application
* Volunteer application
* Admin application
* Donation management
* NGO requirement management
* Matching experience
* Delivery management
* Live tracking
* Notifications
* Analytics
* Impact reporting
* Organization verification
* User management
* Audit logs
* Settings
* Loading states
* Empty states
* Error states
* Success states
* Mobile layouts
* Tablet layouts
* Desktop layouts
* Interactive prototypes
* Reusable components
* Design tokens
* Developer handoff specifications

The final design should be **modern, accessible, responsive, scalable, component-based, implementation-friendly, and visually distinctive**, while remaining faithful to the FoodBridge business architecture.
