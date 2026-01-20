# Google Calendar Availability Snippet Generator

## Phased Implementation Plan

**Version:** 1.0
**Date:** January 20, 2026
**Related Document:** [google-calendar-availability-addon-spec.md](./google-calendar-availability-addon-spec.md)

---

## Executive Summary

This implementation plan breaks the add-on development into 5 phases, progressing from foundational setup through to marketplace launch. Each phase delivers incremental, testable value.

| Phase | Name | Focus | Key Outcome |
|-------|------|-------|-------------|
| 0 | Foundation | Project setup & infrastructure | Development environment ready |
| 1 | MVP | Core availability selection & text generation | Usable add-on with basic features |
| 2 | Enhanced UX | Improved interactions & Gmail integration | Polished user experience |
| 3 | Booking System | Booking links & confirmation flow | One-click scheduling capability |
| 4 | Launch | Marketplace preparation & release | Public availability |

---

## Phase 0: Foundation

### Goals
- Establish development environment and project structure
- Set up Google Cloud project and required APIs
- Create basic add-on scaffold with authentication
- Implement CI/CD pipeline

### Technical Tasks

#### 0.1 Google Cloud Setup
- [ ] Create Google Cloud project
- [ ] Enable Google Calendar API
- [ ] Enable Gmail API
- [ ] Configure OAuth consent screen
- [ ] Set up OAuth 2.0 credentials
- [ ] Configure test users for development

#### 0.2 Project Structure
```
availability-snippet-addon/
├── src/
│   ├── Code.gs              # Main entry point
│   ├── Calendar.gs          # Calendar API interactions
│   ├── Timezone.gs          # Timezone utilities
│   ├── Output.gs            # Snippet generation
│   ├── Storage.gs           # User preferences
│   └── UI.gs                # Card/UI builders
├── views/
│   ├── Sidebar.html         # Main sidebar template
│   └── styles.css           # Custom styles
├── tests/
│   └── *.test.js            # Unit tests
├── appsscript.json          # Manifest
├── .clasp.json              # CLASP config
└── README.md
```

#### 0.3 Development Environment
- [ ] Install and configure CLASP (Command Line Apps Script)
- [ ] Set up local development workflow
- [ ] Configure ESLint for Apps Script
- [ ] Set up version control branching strategy
- [ ] Create deployment scripts (dev/staging/prod)

#### 0.4 Add-on Scaffold
- [ ] Create `appsscript.json` manifest with required scopes:
  ```json
  {
    "oauthScopes": [
      "https://www.googleapis.com/auth/calendar.readonly",
      "https://www.googleapis.com/auth/script.external_request"
    ],
    "addOns": {
      "calendar": {
        "homepageTrigger": {
          "runFunction": "onCalendarHomepage"
        }
      }
    }
  }
  ```
- [ ] Implement basic homepage card
- [ ] Verify add-on loads in Google Calendar
- [ ] Implement error handling framework
- [ ] Set up logging infrastructure

### Deliverables
- Working development environment
- Basic add-on that loads in Google Calendar sidebar
- Project documentation (README, contributing guide)

### Exit Criteria
- [ ] Add-on installs and displays "Hello World" card
- [ ] OAuth flow completes successfully
- [ ] Calendar API can be called from add-on
- [ ] Code can be deployed via CLASP

### Requirements Covered
| Requirement ID | Description |
|----------------|-------------|
| TR-01 | Built using Google Apps Script |
| TR-02 | Uses Google Calendar API |
| TR-10 | Request only necessary OAuth scopes |

---

## Phase 1: MVP (Minimum Viable Product)

### Goals
- Implement timezone selection and display
- Enable basic availability block selection
- Generate plain text output
- Deliver a functional, end-to-end user experience

### Technical Tasks

#### 1.1 Timezone Selection
- [ ] Create timezone dropdown component
- [ ] Implement searchable timezone list (IANA timezone database)
- [ ] Display current selection prominently
- [ ] Default to user's calendar timezone
- [ ] Store last-used timezone in user properties

**Implementation Notes:**
```javascript
// Timezone.gs
function getTimezoneList() {
  // Return array of {id, label, offset} objects
  // Support searching by name, abbreviation, or offset
}

function convertToTimezone(date, fromTz, toTz) {
  // Use Utilities.formatDate with timezone parameter
}
```

#### 1.2 Calendar Data Retrieval
- [ ] Fetch events for visible date range
- [ ] Convert event times to selected timezone
- [ ] Identify free/busy periods
- [ ] Handle all-day events appropriately
- [ ] Handle multi-day events

**Implementation Notes:**
```javascript
// Calendar.gs
function getEventsInRange(startDate, endDate, calendarId) {
  const calendar = CalendarApp.getCalendarById(calendarId);
  return calendar.getEvents(startDate, endDate);
}

function getFreeBusyPeriods(startDate, endDate, timezone) {
  // Return array of {start, end, isBusy} objects
}
```

#### 1.3 Availability Selection (Simplified)
- [ ] Create "Add Availability" button in sidebar
- [ ] Implement time slot picker (date, start time, end time)
- [ ] Display selected slots in sidebar list
- [ ] Allow removal of individual slots
- [ ] Implement "Clear All" functionality
- [ ] Validate selections don't overlap with events

**UI Component:**
```
┌─────────────────────────────────┐
│ Add Availability Slot           │
├─────────────────────────────────┤
│ Date: [Jan 21, 2026      ▼]    │
│ From: [10:00 AM          ▼]    │
│ To:   [11:30 AM          ▼]    │
│            [Add Slot]           │
└─────────────────────────────────┘
```

#### 1.4 Meeting Duration Setting
- [ ] Add duration dropdown (15, 30, 45, 60, 90, 120 min)
- [ ] Store preference in user properties
- [ ] Apply duration to output formatting

#### 1.5 Plain Text Output Generation
- [ ] Implement output formatter
- [ ] Support configurable preamble text
- [ ] Group slots by date
- [ ] Include timezone in output
- [ ] Add "Copy to Clipboard" button
- [ ] Show preview before copying

**Output Template:**
```javascript
// Output.gs
function generatePlainText(slots, timezone, preamble, closing) {
  let output = preamble + ` (all times in ${timezone}):\n\n`;

  // Group by date
  const grouped = groupSlotsByDate(slots);

  for (const [date, dateSlots] of Object.entries(grouped)) {
    output += `${formatDate(date)}:\n`;
    dateSlots.forEach(slot => {
      output += `  • ${formatTime(slot.start)} - ${formatTime(slot.end)}\n`;
    });
    output += '\n';
  }

  output += closing;
  return output;
}
```

#### 1.6 User Preferences Storage
- [ ] Implement preferences manager using PropertiesService
- [ ] Store: last timezone, default duration, preamble text
- [ ] Load preferences on add-on open
- [ ] Save preferences on change

### Deliverables
- Functional add-on with timezone selection
- Ability to manually add availability slots
- Plain text output generation with copy functionality
- User preferences persistence

### Exit Criteria
- [ ] User can select a timezone from dropdown
- [ ] User can add multiple availability slots
- [ ] User can remove individual slots
- [ ] Plain text output generates correctly
- [ ] Copy to clipboard works
- [ ] Preferences persist across sessions

### Requirements Covered
| Requirement ID | Description | Status |
|----------------|-------------|--------|
| FR-01 | Timezone dropdown | ✅ |
| FR-03 | Display current timezone | ✅ |
| FR-04 | Default to user's timezone | ✅ |
| FR-05 | Remember last timezone | ✅ |
| FR-12 | Multiple non-contiguous blocks | ✅ |
| FR-14 | Remove individual blocks | ✅ |
| FR-15 | Clear all blocks | ✅ |
| FR-20 | Side panel with selected blocks | ✅ |
| FR-21 | Show start/end/duration | ✅ |
| FR-22 | Display in target timezone | ✅ |
| FR-23 | Remove from side panel | ✅ |
| FR-30 | Specify meeting duration | ✅ |
| FR-31 | Common duration presets | ✅ |
| FR-50 | Plain text output | ✅ |
| FR-52 | Include timezone in output | ✅ |
| FR-53 | Customizable preamble | ✅ |
| FR-54 | Copy to clipboard | ✅ |
| TR-20 | PropertiesService storage | ✅ |

---

## Phase 2: Enhanced User Experience

### Goals
- Implement visual drag-to-select on calendar (if technically feasible)
- Add rich text/HTML output generation
- Enable direct Gmail insertion
- Polish UI and add quality-of-life features

### Technical Tasks

#### 2.1 Enhanced Slot Selection
- [ ] Research Google Calendar add-on calendar interaction capabilities
- [ ] **Option A (Preferred):** Implement calendar overlay with drag selection
  - Requires understanding of Calendar add-on event hooks
  - May need to use contextual triggers
- [ ] **Option B (Fallback):** Enhanced time picker with visual calendar widget
  - Build custom date/time picker in sidebar
  - Show mini-calendar with existing events visible
- [ ] Implement time snapping (15/30/60 min intervals)
- [ ] Add conflict detection with visual warning

**Research Note:** Google Calendar add-ons have limited ability to modify the calendar UI directly. The drag-to-select feature may need to be implemented as an enhanced picker within the sidebar rather than directly on the calendar grid. Investigate:
- `CalendarEventActionResponse` for event context
- `CalendarHomepageTrigger` capabilities
- Custom HTML sidebar with embedded calendar view

#### 2.2 Rich Text Output
- [ ] Implement HTML output generator
- [ ] Style output with inline CSS (for email compatibility)
- [ ] Create formatted date/time display
- [ ] Add preview modal showing rendered HTML
- [ ] Implement rich text copy (clipboard with HTML MIME type)

**HTML Template:**
```html
<div style="font-family: Arial, sans-serif; font-size: 14px;">
  <p>{{preamble}} <em>(all times in {{timezone}})</em>:</p>
  {{#each dateGroups}}
  <p style="margin-bottom: 4px;"><strong>{{date}}</strong></p>
  <ul style="margin-top: 0;">
    {{#each slots}}
    <li>{{startTime}} - {{endTime}}</li>
    {{/each}}
  </ul>
  {{/each}}
  <p>{{closing}}</p>
</div>
```

#### 2.3 Gmail Integration
- [ ] Add Gmail compose trigger to manifest
- [ ] Implement "Insert into Email" action
- [ ] Handle compose context (get draft, insert at cursor)
- [ ] Test with various Gmail compose scenarios

**Manifest Update:**
```json
{
  "addOns": {
    "gmail": {
      "composeTrigger": {
        "selectActions": [{
          "text": "Insert Availability",
          "runFunction": "insertAvailabilityIntoEmail"
        }],
        "draftAccess": "NONE"
      }
    }
  }
}
```

#### 2.4 UI Polish
- [ ] Add loading states for async operations
- [ ] Implement error messages with recovery suggestions
- [ ] Add success confirmations (toast notifications)
- [ ] Improve visual hierarchy of sidebar
- [ ] Add keyboard shortcuts for common actions
- [ ] Implement "undo" for slot removal

#### 2.5 Additional Meeting Settings
- [ ] Add meeting title/subject field
- [ ] Add video conferencing provider selector
- [ ] Implement custom duration entry
- [ ] Add closing text customization

#### 2.6 Output Enhancements
- [ ] Group by date toggle
- [ ] Timezone note toggle
- [ ] Preview modal with plain/rich text tabs
- [ ] Output format memory (remember last used)

### Deliverables
- Enhanced slot selection experience
- Rich text/HTML output with styling
- Gmail compose integration
- Polished, production-ready UI

### Exit Criteria
- [ ] Slot selection feels intuitive and fast
- [ ] Rich text output renders correctly in email clients
- [ ] Insert into Gmail works from compose window
- [ ] No jarring UI states or unhandled errors
- [ ] All "Should Have" requirements implemented

### Requirements Covered
| Requirement ID | Description | Status |
|----------------|-------------|--------|
| FR-02 | Display events shifted to timezone | ✅ |
| FR-06 | Timezone aliases | ✅ |
| FR-10 | Click and drag selection | ⚠️ (may be Option B) |
| FR-11 | Highlight selected blocks | ✅ |
| FR-13 | Prevent overlap with events | ✅ |
| FR-16 | Snap to intervals | ✅ |
| FR-17 | Select across multiple days | ✅ |
| FR-24 | Group blocks by date | ✅ |
| FR-25 | Total count of slots | ✅ |
| FR-32 | Custom duration entry | ✅ |
| FR-33 | Meeting title/subject | ✅ |
| FR-34 | Video conferencing selector | ✅ |
| FR-35 | Support Zoom/Meet/Teams | ✅ |
| FR-51 | Rich text output | ✅ |
| FR-55 | Insert into Gmail | ✅ |
| FR-56 | Preview output | ✅ |
| TR-03 | Gmail API integration | ✅ |
| TR-12 | Gmail compose OAuth scope | ✅ |

---

## Phase 3: Booking System

### Goals
- Generate unique, trackable booking links
- Implement booking confirmation flow
- Create event from booking link click
- Add notification system

### Technical Tasks

#### 3.1 Booking Link Architecture

**Option A: Apps Script Web App (Simpler)**
- Deploy Apps Script as web app to handle booking URLs
- Store booking tokens in Script Properties or Spreadsheet
- Limited scalability but no external dependencies

**Option B: Firebase Backend (Scalable)**
- Use Firebase Functions for booking endpoints
- Firestore for token storage
- Better scalability and real-time capabilities

**Recommended:** Start with Option A, migrate to Option B if needed.

#### 3.2 Booking Token Generation
- [ ] Generate cryptographically secure tokens
- [ ] Store token metadata: slot time, creator, expiry, status
- [ ] Implement token validation endpoint
- [ ] Handle token expiration (expire after slot time)

**Data Model:**
```javascript
{
  token: "abc123xyz",
  createdBy: "user@example.com",
  slotStart: "2026-01-21T10:00:00-05:00",
  slotEnd: "2026-01-21T11:30:00-05:00",
  duration: 90,
  meetingTitle: "Intro Call",
  videoProvider: "zoom",
  timezone: "America/New_York",
  status: "pending", // pending, booked, expired, cancelled
  expiresAt: "2026-01-21T10:00:00-05:00",
  bookedBy: null,
  bookedAt: null
}
```

#### 3.3 Booking Web App
- [ ] Create booking landing page
- [ ] Display slot details to invitee
- [ ] Collect invitee name and email
- [ ] Validate token is still valid
- [ ] Show error for expired/used tokens

**Booking Page Flow:**
```
┌─────────────────────────────────────────┐
│  📅 Confirm Your Meeting                │
├─────────────────────────────────────────┤
│                                         │
│  You're booking a meeting with          │
│  [User Name]                            │
│                                         │
│  📆 Tuesday, January 21, 2026           │
│  🕐 10:00 AM - 11:30 AM (EST)          │
│  📹 Zoom video call                     │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Your Name                       │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Your Email                      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │       Confirm Booking           │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

#### 3.4 Calendar Event Creation
- [ ] Request calendar.events.create scope
- [ ] Create event on slot owner's calendar
- [ ] Add invitee as attendee
- [ ] Include video conferencing link
- [ ] Send calendar invitations

**Scope Update:**
```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/calendar.events"
  ]
}
```

#### 3.5 Notification System
- [ ] Email notification to slot owner on booking
- [ ] Confirmation email to invitee
- [ ] Use Gmail API or MailApp
- [ ] Include calendar invite attachment

#### 3.6 Booking Link Output Integration
- [ ] Add booking link toggle to output options
- [ ] Generate tokens when output is created
- [ ] Include links in plain text and HTML output
- [ ] Show booking status in sidebar (booked slots)

### Deliverables
- Booking link generation and validation
- Self-service booking page
- Automatic event creation
- Email notifications
- Booking status tracking

### Exit Criteria
- [ ] Booking links are unique and secure
- [ ] Booking page loads and displays correctly
- [ ] Event is created on confirmation
- [ ] Both parties receive notifications
- [ ] Expired links show appropriate error

### Requirements Covered
| Requirement ID | Description | Status |
|----------------|-------------|--------|
| FR-40 | Unique booking URLs per slot | ✅ |
| FR-41 | Booking creates calendar event | ✅ |
| FR-42 | Links expire after slot time | ✅ |
| FR-43 | Notification on booking | ✅ |
| FR-44 | Mark booked slots unavailable | ✅ |
| SP-02 | Secure tokens | ✅ |
| SP-03 | Single-use/expiring links | ✅ |

---

## Phase 4: Launch Preparation

### Goals
- Prepare for Google Workspace Marketplace submission
- Complete security and privacy requirements
- Implement analytics and monitoring
- Create user documentation

### Technical Tasks

#### 4.1 Marketplace Requirements
- [ ] Complete OAuth verification process
- [ ] Create Marketplace listing assets:
  - [ ] App icon (96x96, 128x128)
  - [ ] Screenshots (1280x800 minimum, 5 recommended)
  - [ ] Promotional banner (440x280)
  - [ ] Short description (80 char limit)
  - [ ] Long description (4000 char limit)
- [ ] Configure Marketplace SDK in Cloud Console
- [ ] Set up developer profile

#### 4.2 Privacy & Compliance
- [ ] Write privacy policy
- [ ] Write terms of service
- [ ] Complete data handling disclosures
- [ ] Implement data deletion workflow (GDPR)
- [ ] Security review of all endpoints

**Privacy Policy Must Include:**
- What data is accessed
- How data is used
- What data is stored (and where)
- How to request data deletion
- Contact information

#### 4.3 Testing & Quality
- [ ] Comprehensive unit test coverage
- [ ] Integration tests for all flows
- [ ] Manual QA test plan execution
- [ ] Performance testing
- [ ] Cross-browser testing for booking page
- [ ] Mobile responsiveness testing
- [ ] Accessibility audit (WCAG 2.1 AA)

#### 4.4 Documentation
- [ ] User guide / Help documentation
- [ ] FAQ section
- [ ] Troubleshooting guide
- [ ] Video tutorial (optional)
- [ ] In-app onboarding flow

#### 4.5 Monitoring & Analytics
- [ ] Implement usage analytics (privacy-respecting)
- [ ] Set up error monitoring/alerting
- [ ] Create operational dashboard
- [ ] Define SLIs and SLOs

#### 4.6 Launch Checklist
- [ ] Final security review
- [ ] Load testing
- [ ] Rollback plan documented
- [ ] Support channel established
- [ ] Submit for Marketplace review
- [ ] Respond to reviewer feedback
- [ ] Publish to Marketplace

### Deliverables
- Marketplace-ready submission
- Privacy policy and terms of service
- User documentation
- Monitoring and analytics infrastructure

### Exit Criteria
- [ ] Marketplace submission accepted
- [ ] No critical bugs in production
- [ ] Documentation complete and accessible
- [ ] Support process established

### Requirements Covered
| Requirement ID | Description | Status |
|----------------|-------------|--------|
| TR-04 | Workspace Marketplace compatible | ✅ |
| TR-13 | Handle permission errors | ✅ |
| SP-01 | No external calendar storage | ✅ |
| SP-04 | Comply with Google policies | ✅ |
| SP-10 | Privacy policy | ✅ |
| SP-11 | Data disclosure | ✅ |
| SP-12 | Revocation capability | ✅ |

---

## Risk Register

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Calendar add-on API doesn't support drag selection | High | Medium | Design fallback UI (Option B in Phase 2) |
| OAuth verification delays | Medium | High | Start verification process early in Phase 3 |
| Booking link abuse/spam | High | Low | Rate limiting, CAPTCHA, token expiration |
| Performance issues at scale | Medium | Medium | Load testing, caching, consider Firebase |
| Marketplace rejection | High | Low | Follow guidelines strictly, early submission |
| Timezone edge cases (DST) | Medium | Medium | Comprehensive testing around DST transitions |

---

## Dependencies

```
Phase 0 ─────► Phase 1 ─────► Phase 2 ─────► Phase 3 ─────► Phase 4
   │              │              │              │              │
   │              │              │              │              │
   ▼              ▼              ▼              ▼              ▼
GCloud         Calendar       Gmail         Booking        Marketplace
Setup          API Ready      Integration   System         Review
               Basic UI       Enhanced UI   Backend        Docs
               Plain Text     Rich Text     Tokens         Legal
```

**External Dependencies:**
- Google Cloud project approval
- OAuth consent screen verification (for sensitive scopes)
- Marketplace review process
- (Phase 3) Firebase project setup (if Option B)

---

## Success Criteria Summary

| Phase | Key Success Metric |
|-------|-------------------|
| 0 | Add-on loads and authenticates |
| 1 | User can generate plain text availability |
| 2 | User can insert formatted availability into Gmail |
| 3 | Invitee can book meeting via link |
| 4 | Add-on published on Marketplace |

---

## Appendix: Technology Stack

| Layer | Technology |
|-------|------------|
| Runtime | Google Apps Script (V8) |
| UI Framework | Google Card Service / HTML Service |
| Storage | PropertiesService, (optional) Firestore |
| APIs | Google Calendar API, Gmail API |
| Booking Backend | Apps Script Web App or Firebase Functions |
| Deployment | CLASP CLI |
| Testing | Jest (local), manual QA |
| Monitoring | Google Cloud Logging, (optional) Sentry |

---

*End of Implementation Plan*
