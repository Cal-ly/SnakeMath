# Phase 2 Decisions - Add to decisions.md

## Phase 2 Decisions

### D-011: Slide-out Drawer for Mobile Navigation
**Decision**: Use a slide-out drawer from the right for mobile navigation instead of a dropdown.

**Rationale**:
- More space for navigation items and future growth
- Familiar pattern on mobile (used by many apps)
- Can show topic hierarchy clearly
- Room for theme toggle and other controls

**Trade-offs**:
- More complex implementation (focus trap, backdrop, animations)
- Requires Teleport for proper z-index stacking

---

### D-012: Theme System with System Preference Detection
**Decision**: Follow OS dark/light preference by default, allow user override that persists.

**Rationale**:
- Respects user's accessibility choices
- No flash of wrong theme on first visit
- User override persists across sessions
- Can reset to system preference if desired

**Implementation**: `localStorage` stores override; absence means follow system.

---

### D-013: Sticky Header
**Decision**: Header remains fixed at top when scrolling (sticky positioning).

**Rationale**:
- Navigation always accessible
- Simple implementation for MVP
- Mobile users don't lose context

**Trade-offs**:
- Takes vertical space on small screens
- Could implement hide-on-scroll-down later if needed

---

### D-014: Full Path Breadcrumbs with Horizontal Scroll
**Decision**: Show full breadcrumb path on mobile with horizontal scroll instead of truncation.

**Rationale**:
- No information loss
- User can see exactly where they are
- Natural swipe gesture on mobile
- No complex truncation logic

**Trade-offs**:
- May require scrolling on deep paths
- Scrollbar hidden (may not be obvious it scrolls)

---

### D-015: Theme Toggle in Mobile Menu Only
**Decision**: Theme toggle is only accessible via mobile menu, not in the header.

**Rationale**:
- Cleaner header UI
- Theme switching is infrequent action
- More space for navigation in header
- Mobile menu needs content anyway

**Trade-offs**:
- Extra tap required to change theme
- Desktop users must resize to access mobile menu (could add desktop toggle later)

---

### D-016: Primary Color - Dark Emerald Green (#27592D)
**Decision**: Use Dark Emerald Green as the primary brand color.

**Rationale**:
- Works well in both light and dark themes
- "Snake" branding connection (snakes are often green)
- Professional appearance
- Good contrast with white text

**Implementation**:
- Light mode: `#27592D` (dark green)
- Dark mode: `#4ade80` (lighter green for contrast)

---

### D-017: Snake Emoji Favicon
**Decision**: Use the snake emoji 🐍 (U+1F40D) as the favicon.

**Rationale**:
- Instant brand recognition
- No image file needed (SVG data URI)
- Works at all sizes
- Memorable and distinctive

**Implementation**: SVG data URI in index.html `<link rel="icon">`.

---

### D-018: Font Awesome for Icons
**Decision**: Use Font Awesome (CDN) for iconography.

**Rationale**:
- Comprehensive icon library
- Consistent outlined style
- CDN delivery is simple
- Widely recognized icons

**Trade-offs**:
- External CDN dependency
- Larger initial load than selective icon imports
- Could self-host or use tree-shaking later if needed
