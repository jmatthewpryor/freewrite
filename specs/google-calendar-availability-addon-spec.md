# Google Calendar Availability Snippet Generator Add-on

## Specification Document

**Version:** 1.0
**Date:** January 20, 2026
**Status:** Draft

---

## 1. Overview

### 1.1 Purpose

This Google Calendar add-on enables users to visually select blocks of available time from their calendar and generate formatted text snippets that can be inserted or pasted into Gmail (or other communication channels). The snippets describe the user's availability in a specified timezone and optionally include booking/confirmation links.

### 1.2 Problem Statement

Scheduling meetings across timezones is tedious. Users currently must:
- Manually check their calendar for open slots
- Mentally convert times to the recipient's timezone
- Type out availability in an email
- Repeat this process for each scheduling request

### 1.3 Solution

A calendar add-on that allows users to:
1. View their calendar in any timezone ("timeshift")
2. Visually select available time blocks via click-and-drag
3. Configure meeting parameters (duration, video conferencing, etc.)
4. Generate formatted availability text with one click

---

## 2. User Stories

### 2.1 Primary User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-01 | Calendar user | View my calendar in a different timezone | I can see my availability from the perspective of someone in another location |
| US-02 | Calendar user | Click and drag to select available time blocks | I can quickly mark when I'm free for meetings |
| US-03 | Calendar user | Set the duration for potential meetings | Recipients know how much time to book |
| US-04 | Calendar user | Specify video conferencing preferences | Meeting invites include the correct call details |
| US-05 | Calendar user | Generate plain text availability | I can paste it into any email client or messaging app |
| US-06 | Calendar user | Generate rich/HTML formatted availability | I can insert nicely formatted availability into Gmail |
| US-07 | Calendar user | Include booking links with each slot | Recipients can confirm a time with one click |
| US-08 | Calendar user | Customize the preamble text | My availability message matches my communication style |

### 2.2 Secondary User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| US-09 | Calendar user | Save my preferences | I don't have to reconfigure settings each time |
| US-10 | Calendar user | Select slots across multiple days | I can offer flexibility for scheduling |
| US-11 | Calendar user | Remove individual selected slots | I can refine my availability before generating |
| US-12 | Calendar user | Preview the generated output | I can verify it looks correct before copying |

---

## 3. Functional Requirements

### 3.1 Timezone Selection ("Timeshift")

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-01 | The add-on SHALL allow users to select a target timezone from a searchable dropdown | Must Have |
| FR-02 | The add-on SHALL display calendar events shifted to the selected timezone | Must Have |
| FR-03 | The add-on SHALL clearly indicate the currently selected timezone | Must Have |
| FR-04 | The add-on SHALL default to the user's local timezone | Must Have |
| FR-05 | The add-on SHOULD remember the last-used timezone | Should Have |
| FR-06 | The add-on SHOULD support common timezone aliases (e.g., "PST", "EST", "GMT") | Should Have |

### 3.2 Availability Block Selection

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-10 | The add-on SHALL allow users to click and drag on the calendar to select time blocks | Must Have |
| FR-11 | The add-on SHALL visually highlight selected availability blocks | Must Have |
| FR-12 | The add-on SHALL allow selection of multiple non-contiguous blocks | Must Have |
| FR-13 | The add-on SHALL prevent selection of times that overlap with existing events | Should Have |
| FR-14 | The add-on SHALL allow users to remove individual selected blocks | Must Have |
| FR-15 | The add-on SHALL allow users to clear all selected blocks | Must Have |
| FR-16 | The add-on SHOULD snap selections to configurable intervals (15min, 30min, 1hr) | Should Have |
| FR-17 | The add-on SHOULD allow selections across multiple days in week view | Should Have |

### 3.3 Side Panel - Selection Summary

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-20 | The add-on SHALL display a side panel showing all selected availability blocks | Must Have |
| FR-21 | The side panel SHALL show start time, end time, and duration for each block | Must Have |
| FR-22 | The side panel SHALL display times in the selected target timezone | Must Have |
| FR-23 | The side panel SHALL allow removal of individual blocks | Must Have |
| FR-24 | The side panel SHOULD group blocks by date | Should Have |
| FR-25 | The side panel SHOULD show a total count of selected slots | Should Have |

### 3.4 Meeting Configuration

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-30 | The add-on SHALL allow users to specify meeting duration | Must Have |
| FR-31 | The add-on SHALL support common durations: 15min, 30min, 45min, 1hr, 1.5hr, 2hr | Must Have |
| FR-32 | The add-on SHALL allow custom duration entry | Should Have |
| FR-33 | The add-on SHALL allow users to specify a meeting title/subject | Should Have |
| FR-34 | The add-on SHALL allow selection of video conferencing provider | Should Have |
| FR-35 | The add-on SHALL support: Zoom, Google Meet, Microsoft Teams, No video call | Should Have |
| FR-36 | The add-on SHOULD auto-detect user's default conferencing provider | Could Have |
| FR-37 | The add-on SHOULD allow users to add a meeting description/agenda | Could Have |

### 3.5 Booking Link Generation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-40 | The add-on SHALL support generating unique booking/confirmation URLs per slot | Should Have |
| FR-41 | Clicking a booking link SHALL create a calendar event for that slot | Should Have |
| FR-42 | Booking links SHOULD expire after the slot's start time | Should Have |
| FR-43 | The add-on SHOULD notify the user when a slot is booked | Could Have |
| FR-44 | The add-on SHOULD mark booked slots as unavailable in subsequent generations | Could Have |
| FR-45 | The add-on MAY integrate with external scheduling tools (Calendly, etc.) | Could Have |

### 3.6 Output Generation

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-50 | The add-on SHALL generate plain text output | Must Have |
| FR-51 | The add-on SHALL generate rich text/HTML output | Must Have |
| FR-52 | The add-on SHALL include the target timezone in the output | Must Have |
| FR-53 | The add-on SHALL allow customizable preamble text | Must Have |
| FR-54 | The add-on SHALL provide a "Copy to Clipboard" function | Must Have |
| FR-55 | The add-on SHOULD provide direct "Insert into Gmail" function | Should Have |
| FR-56 | The add-on SHALL show a preview of the generated output | Must Have |
| FR-57 | The add-on SHOULD support multiple output format templates | Could Have |
| FR-58 | The add-on SHOULD allow users to save custom templates | Could Have |

---

## 4. User Interface Specifications

### 4.1 Add-on Activation

The add-on is accessed via:
- Google Calendar sidebar (primary)
- Gmail compose window sidebar (secondary)

### 4.2 Main Panel Layout

```
┌─────────────────────────────────────────┐
│  📅 Availability Snippet Generator      │
├─────────────────────────────────────────┤
│  Target Timezone                        │
│  ┌─────────────────────────────────┐   │
│  │ America/New_York (EST)      ▼   │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Meeting Settings                       │
│  ┌─────────────────────────────────┐   │
│  │ Duration: 30 minutes        ▼   │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │ Video: Zoom                 ▼   │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Selected Availability                  │
│  ┌─────────────────────────────────┐   │
│  │ 📆 Tuesday, Jan 21              │   │
│  │   • 10:00 AM - 11:30 AM  [✕]   │   │
│  │   • 2:00 PM - 4:00 PM    [✕]   │   │
│  │ 📆 Wednesday, Jan 22            │   │
│  │   • 9:00 AM - 10:00 AM   [✕]   │   │
│  └─────────────────────────────────┘   │
│                         [Clear All]     │
├─────────────────────────────────────────┤
│  Preamble                               │
│  ┌─────────────────────────────────┐   │
│  │ Here are some times that work   │   │
│  │ for me:                         │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Options                                │
│  ☑ Include booking links               │
│  ☐ Include timezone note               │
│  ☑ Group by date                       │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │      Generate Plain Text        │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │      Generate Rich Text         │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 4.3 Calendar Overlay

When the add-on is active:
- Available time slots appear with a subtle highlight/pattern
- Clicking and dragging creates a selection overlay
- Selected blocks show a distinct color (e.g., green)
- Existing events remain visible but are visually distinct (cannot be selected)

### 4.4 Output Preview Modal

```
┌─────────────────────────────────────────┐
│  Preview                          [✕]   │
├─────────────────────────────────────────┤
│                                         │
│  Here are some times that work for me   │
│  (all times in Eastern Time):           │
│                                         │
│  Tuesday, January 21:                   │
│    • 10:00 AM - 11:30 AM [Book this]   │
│    • 2:00 PM - 4:00 PM [Book this]     │
│                                         │
│  Wednesday, January 22:                 │
│    • 9:00 AM - 10:00 AM [Book this]    │
│                                         │
│  Let me know what works best!           │
│                                         │
├─────────────────────────────────────────┤
│  [Copy to Clipboard]  [Insert in Gmail] │
└─────────────────────────────────────────┘
```

---

## 5. Output Format Specifications

### 5.1 Plain Text Format

```
Here are some times that work for me (all times in Eastern Time):

Tuesday, January 21:
  • 10:00 AM - 11:30 AM
  • 2:00 PM - 4:00 PM

Wednesday, January 22:
  • 9:00 AM - 10:00 AM

Let me know what works best!
```

### 5.2 Plain Text with Booking Links

```
Here are some times that work for me (all times in Eastern Time):

Tuesday, January 21:
  • 10:00 AM - 11:30 AM - Book: https://cal.example.com/book/abc123
  • 2:00 PM - 4:00 PM - Book: https://cal.example.com/book/def456

Wednesday, January 22:
  • 9:00 AM - 10:00 AM - Book: https://cal.example.com/book/ghi789

Let me know what works best!
```

### 5.3 Rich Text/HTML Format

```html
<p>Here are some times that work for me <em>(all times in Eastern Time)</em>:</p>

<p><strong>Tuesday, January 21:</strong></p>
<ul>
  <li>10:00 AM - 11:30 AM <a href="https://cal.example.com/book/abc123">[Book this time]</a></li>
  <li>2:00 PM - 4:00 PM <a href="https://cal.example.com/book/def456">[Book this time]</a></li>
</ul>

<p><strong>Wednesday, January 22:</strong></p>
<ul>
  <li>9:00 AM - 10:00 AM <a href="https://cal.example.com/book/ghi789">[Book this time]</a></li>
</ul>

<p>Let me know what works best!</p>
```

### 5.4 Configurable Elements

| Element | Description | Default |
|---------|-------------|---------|
| Preamble | Text before the availability list | "Here are some times that work for me:" |
| Timezone note | Shows timezone context | "(all times in [Timezone])" |
| Date format | How dates are displayed | "EEEE, MMMM d" (e.g., "Tuesday, January 21") |
| Time format | How times are displayed | "h:mm a" (e.g., "10:00 AM") |
| Closing | Text after the availability list | "Let me know what works best!" |
| Booking link text | Link label | "[Book this time]" |

---

## 6. Technical Requirements

### 6.1 Platform Requirements

| ID | Requirement |
|----|-------------|
| TR-01 | The add-on SHALL be built using Google Apps Script |
| TR-02 | The add-on SHALL use the Google Calendar API |
| TR-03 | The add-on SHALL use the Gmail API for direct insertion (optional) |
| TR-04 | The add-on SHALL be compatible with Google Workspace Marketplace |

### 6.2 Authentication & Permissions

| ID | Requirement |
|----|-------------|
| TR-10 | The add-on SHALL request only necessary OAuth scopes |
| TR-11 | Required scope: `https://www.googleapis.com/auth/calendar.readonly` |
| TR-12 | Required scope: `https://www.googleapis.com/auth/gmail.addons.current.action.compose` (for Gmail insertion) |
| TR-13 | The add-on SHALL handle permission errors gracefully |

### 6.3 Data Storage

| ID | Requirement |
|----|-------------|
| TR-20 | User preferences SHALL be stored using PropertiesService (user properties) |
| TR-21 | Booking link tokens SHALL be stored securely |
| TR-22 | No calendar data SHALL be stored on external servers |
| TR-23 | Booking link data MAY use Firebase or similar for persistence |

### 6.4 Performance

| ID | Requirement |
|----|-------------|
| TR-30 | Calendar data SHALL load within 2 seconds |
| TR-31 | Timezone conversion SHALL be calculated client-side where possible |
| TR-32 | Output generation SHALL complete within 500ms |

---

## 7. Security & Privacy

### 7.1 Data Handling

| ID | Requirement |
|----|-------------|
| SP-01 | The add-on SHALL NOT store calendar event details externally |
| SP-02 | Booking links SHALL use cryptographically secure tokens |
| SP-03 | Booking links SHALL be single-use or expire after slot time |
| SP-04 | The add-on SHALL comply with Google's add-on security policies |

### 7.2 Privacy

| ID | Requirement |
|----|-------------|
| SP-10 | The add-on SHALL include a privacy policy |
| SP-11 | The add-on SHALL clearly disclose what data is accessed |
| SP-12 | Users SHALL be able to revoke access at any time |

---

## 8. Future Considerations

The following features are out of scope for v1.0 but may be considered for future versions:

1. **Multi-calendar support** - Select availability across multiple calendars
2. **Buffer time** - Automatically add buffer before/after meetings
3. **Working hours** - Only allow selection within defined working hours
4. **Recurring availability** - Generate availability for recurring time slots
5. **Team availability** - Show combined availability for multiple team members
6. **Integration with scheduling tools** - Deep integration with Calendly, Cal.com, etc.
7. **Mobile support** - Native mobile add-on experience
8. **Analytics** - Track booking link usage and conversion

---

## 9. Success Metrics

| Metric | Target |
|--------|--------|
| Time to generate availability snippet | < 30 seconds (vs. 2-5 minutes manually) |
| User satisfaction score | > 4.5/5.0 |
| Weekly active users (6 months post-launch) | 10,000+ |
| Booking link conversion rate | > 40% |

---

## 10. Glossary

| Term | Definition |
|------|------------|
| Timeshift | Viewing calendar events converted to a different timezone |
| Availability block | A selected time range when the user is free for meetings |
| Booking link | A unique URL that allows a recipient to confirm a specific time slot |
| Preamble | Introductory text that appears before the list of available times |
| Rich text | Formatted text (HTML) that includes styling, links, and structure |

---

## Appendix A: Competitive Analysis

| Feature | This Add-on | Calendly | Cal.com | When2meet |
|---------|-------------|----------|---------|-----------|
| Timezone conversion | ✅ | ✅ | ✅ | ✅ |
| Visual slot selection | ✅ | ❌ | ❌ | ✅ |
| Email snippet generation | ✅ | ❌ | ❌ | ❌ |
| Native Google Calendar | ✅ | ❌ | ❌ | ❌ |
| No external account needed | ✅ | ❌ | ❌ | ✅ |
| One-click booking | ✅ | ✅ | ✅ | ❌ |
| Free tier | ✅ | Limited | ✅ | ✅ |

---

## Appendix B: User Flow Diagram

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Open Google │────▶│ Open Add-on  │────▶│ Select Target   │
│ Calendar    │     │ Sidebar      │     │ Timezone        │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                                   ▼
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ Copy/Insert │◀────│ Preview &    │◀────│ Configure       │
│ into Email  │     │ Generate     │     │ Meeting Settings│
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                                                   ▼
                                         ┌─────────────────┐
                                         │ Click & Drag to │
                                         │ Select Slots    │
                                         └─────────────────┘
```

---

*End of Specification Document*
