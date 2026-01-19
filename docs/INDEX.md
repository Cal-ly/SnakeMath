# SnakeMath Documentation Index

> Last updated: 2026-01-19

## How to Use This Index

This index lists all project documentation. When resuming work on SnakeMath:
1. Start with `CURRENT_STATE.md` for project status
2. Check `ROADMAP.md` for what's next
3. Reference other documents as needed

## Active Documentation

| Document | Location | Purpose | Updated |
|----------|----------|---------|---------|
| ROADMAP.md | `/docs/ROADMAP.md` | Authoritative roadmap, phase status, strategic decisions | Phase 21 |
| CURRENT_STATE.md | `/docs/CURRENT_STATE.md` | Project resume guide, what's implemented | Phase 21 |
| DECISIONS.md | `/docs/DECISIONS.md` | Technical decisions (D-XXX series) | Phase 21 |
| LL_LI.md | `/docs/LL_LI.md` | Lessons Learned and Lessons Identified | Phase 21 |
| DESIGN_SYSTEM.md | `/docs/DESIGN_SYSTEM.md` | UI patterns, component conventions, styling | Phase 21 |
| CLAUDE_CODE_WORKFLOW.md | `/docs/CLAUDE_CODE_WORKFLOW.md` | Implementation workflow for Claude Code | Phase 21 |
| PLANNING_WORKFLOW.md | `/docs/PLANNING_WORKFLOW.md` | Planning session workflow for Claude Opus | Phase 21 |
| ACCESSIBILITY.md | `/docs/ACCESSIBILITY.md` | Accessibility guidelines and WCAG compliance | Phase 21 |
| TODO.md | `/docs/TODO.md` | Task tracking and backlog | Phase 21 |
| REVIEW_PROGRESS.md | `/docs/REVIEW_PROGRESS.md` | Content review and planning progress | Phase 21 |

## Phase Plans (Historical)

Located in `/docs/phases/`. These document the planning for each completed phase.

> **Note**: Numbered phase plans (PHASE_01_PLAN.md through PHASE_21_PLAN.md) were not formally created as separate documents during development. Phase planning was done within conversations and documented in CURRENT_STATE.md and ROADMAP.md.

| Document | Location | Purpose |
|----------|----------|---------|
| PHASE_TEMPLATE_PLAN.md | `/docs/planning/PHASE_TEMPLATE_PLAN.md` | Template for creating future phase plans |
| PLAN_CONTENT.md | `/docs/planning/PLAN_CONTENT.md` | Content planning document |

## Archived Documentation

Located in `/docs/archive/`. These documents describe approaches that were later superseded or are preserved for reference.

### Testing

| Document | Location | Archived | Reason |
|----------|----------|----------|--------|
| VISUAL_TESTING.md | `/docs/archive/testing/VISUAL_TESTING.md` | Phase 9 | Visual regression removed from CI (D-070) |
| TESTING.md | `/docs/archive/testing/TESTING.md` | Phase 21 | Testing strategy reference |

### Content Planning

| Document | Location | Purpose |
|----------|----------|---------|
| CONTENT_OVERVIEW.md | `/docs/archive/content/CONTENT_OVERVIEW.md` | Content extraction overview |
| CONTENT_BASICS.md | `/docs/archive/content/CONTENT_BASICS.md` | Basics module planning |
| CONTENT_ALGEBRA.md | `/docs/archive/content/CONTENT_ALGEBRA.md` | Algebra module planning |
| CONTENT_DESCRIPTIVE_STATS.md | `/docs/archive/content/CONTENT_DESCRIPTIVE_STATS.md` | Statistics content planning |
| CONTENT_PROBABILITY.md | `/docs/archive/content/CONTENT_PROBABILITY.md` | Probability content planning |
| CONTENT_VECTORS_2D.md | `/docs/archive/content/CONTENT_VECTORS_2D.md` | 2D vectors content planning |
| CONTENT_MATRICES_2D.md | `/docs/archive/content/CONTENT_MATRICES_2D.md` | 2D matrices content planning |
| CONTENT_UNITCIRCLE.md | `/docs/archive/content/CONTENT_UNITCIRCLE.md` | Unit circle content planning |
| CONTENT_LIMITS.md | `/docs/archive/content/CONTENT_LIMITS.md` | Limits content planning |
| CONTENT_WORKFLOW.md | `/docs/archive/content/CONTENT_WORKFLOW.md` | Content workflow documentation |

### Instructions

| Document | Location | Purpose |
|----------|----------|---------|
| CLAUDE_CODE_PROMPT_DOCS_INTEGRATION.md | `/docs/archive/instructions/CLAUDE_CODE_PROMPT_DOCS_INTEGRATION.md` | Historical prompt integration guide |
| PROJECT_INSTRUCTIONS_SNIPPET.md | `/docs/archive/instructions/PROJECT_INSTRUCTIONS_SNIPPET.md` | Historical project instructions |

## Archive Overview Files

Located in `/docs/archive_overview/`. These inventory the archived implementations for reference.

| Document | Location | Purpose |
|----------|----------|---------|
| archive_content.md | `/docs/archive_overview/archive_content.md` | Inventory of archive educational content |
| archive_components.md | `/docs/archive_overview/archive_components.md` | Inventory of archive Vue components |
| archive_data.md | `/docs/archive_overview/archive_data.md` | Inventory of archive data structures |
| archive_utilities.md | `/docs/archive_overview/archive_utilities.md` | Inventory of archive utility functions |

## Project Knowledge Files

| Document | Location | Purpose |
|----------|----------|---------|
| CLAUDE.md | `/CLAUDE.md` | Claude Code project instructions |
| README.md | `/README.md` | Project overview and setup |

## Numbering Conventions

| Prefix | Meaning | Current Range |
|--------|---------|---------------|
| R-XXX | Roadmap decisions | R-001 through R-025 |
| D-XXX | Technical decisions | D-001 through D-154 |
| LL-XXX | Lessons Learned | LL-001 through LL-074 |
| LI-XXX | Lessons Identified | LI-001 through LI-087 |

## Document Naming Convention

All documentation files use `UPPER_SNAKE_CASE.md` format.

## Directory Structure

```
docs/
├── INDEX.md                    # This file
├── ACCESSIBILITY.md            # Accessibility guidelines
├── CLAUDE_CODE_WORKFLOW.md     # Implementation workflow
├── CURRENT_STATE.md            # Project status snapshot
├── DECISIONS.md                # Technical decisions
├── DESIGN_SYSTEM.md            # UI patterns and conventions
├── LL_LI.md                    # Lessons learned/identified
├── PLANNING_WORKFLOW.md        # Planning session workflow
├── REVIEW_PROGRESS.md          # Content review progress
├── ROADMAP.md                  # Strategic roadmap
├── TODO.md                     # Task tracking
├── archive/                    # Superseded documentation
│   ├── content/                # Content planning docs
│   ├── instructions/           # Historical instructions
│   └── testing/                # Testing documentation
├── archive_overview/           # Archive inventory files
├── phases/                     # Phase plan storage
└── planning/                   # Planning templates
```
