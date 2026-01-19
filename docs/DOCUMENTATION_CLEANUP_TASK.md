# Documentation Cleanup Task

## Context

SnakeMath has completed 21 development phases and is approaching MVP completion. Over this development cycle, documentation has grown organically across multiple files, locations, and formats. Before marking MVP complete, we need to consolidate, archive, and index our documentation to:

1. **Reduce cognitive load** — Make it easy to find the right document
2. **Preserve history** — Archive completed work without cluttering active workspace
3. **Enable onboarding** — A new contributor (or Claude Code in a fresh session) should quickly understand what exists and where
4. **Remove outdated content** — Decisions that were superseded or features that were cut should be clearly marked

## Project Documentation Philosophy

This project follows a documentation-first approach with structured numbering:
- **R-XXX**: Roadmap-level decisions (strategic)
- **D-XXX**: Technical decisions (implementation)
- **LL-XXX**: Lessons Learned (what went wrong and how we fixed it)
- **LI-XXX**: Lessons Identified (patterns discovered for future use)

All documentation uses **UPPER_SNAKE_CASE** naming convention.

---

## Task 1: Audit Current Documentation State

**Intent**: Before making changes, understand what exists and where.

### Actions

1. List all markdown files in the repository root
2. List all files in `docs/` directory (and subdirectories if any exist)
3. List any phase plan files (`PHASE_XX_PLAN.md` or similar) wherever they exist
4. Check if `docs/archive/` subdirectory exists
5. Check if `docs/phases/` subdirectory exists

### Output

Create a temporary audit summary (can be in working memory or a scratch file) noting:
- Which expected documents exist
- Which are missing
- Any unexpected documents found
- Current directory structure

---

## Task 2: Archive Completed Phase Plans

**Intent**: Phase plans are valuable historical artifacts but clutter the workspace once completed. Moving them to a dedicated subdirectory preserves history while keeping active documents prominent.

### Actions

1. Create `docs/phases/` directory if it doesn't exist
2. Move all completed phase plan documents to `docs/phases/`
3. Rename if needed to ensure consistent naming: `PHASE_XX_PLAN.md`
4. Do NOT move any phase plan marked as "current" or "in progress"

### Naming Convention
- `PHASE_01_PLAN.md` through `PHASE_21_PLAN.md` (or however many exist)
- Use zero-padded numbers for sorting (01, 02, ... 09, 10, 11)

### Notes
- Some phase plans may be in root, some in docs/, some elsewhere — consolidate all to `docs/phases/`
- If a phase plan doesn't exist (was never created or was informal), that's fine — don't create empty placeholders

---

## Task 3: Archive Outdated Documentation

**Intent**: Some documents describe approaches that were later abandoned or superseded. Rather than delete them (losing context), archive them with clear marking.

### Known Candidates

1. **VISUAL_TESTING.md** (if it exists)
   - Context: Visual regression testing was removed from CI in Phase 9 (D-070) due to environment-caused flakiness
   - Action: Move to `docs/archive/VISUAL_TESTING.md`
   - Add a header note: `> **Archived**: Visual regression testing was removed from CI in Phase 9. See D-070 in DECISIONS.md. This document preserved for historical context.`

2. **Any PWA-related documentation** (if it exists)
   - Context: PWA was deferred early in the project and has now been formally removed from scope
   - Action: Move to `docs/archive/` with similar archive header

### Actions

1. Create `docs/archive/` directory if it doesn't exist
2. Move identified outdated documents
3. Add archive header to each moved document explaining why it was archived and where to find the relevant decision

---

## Task 4: Update ROADMAP_V2.md — Remove PWA

**Intent**: PWA was originally planned as a future enhancement but has been evaluated and determined to not provide sufficient value for the target audience (programmers learning math at computers with internet). Removing it from the roadmap prevents future confusion about project scope.

### Actions

1. Locate any references to PWA, "Progressive Web App", "offline support", "installability", or "service worker" in `ROADMAP_V2.md`
2. Remove these from planned phases or future enhancements sections
3. Add a decision entry if a Decision Log section exists:
   ```
   | R-0XX | PWA removed from scope | Target audience (programmers at computers) has low offline need; complexity outweighs benefits |
   ```
4. If there's a "Future Horizons" or similar section listing PWA, remove or move to a "Considered and Deferred" subsection

### Do NOT
- Remove historical references if PWA was mentioned in completed phase descriptions
- Delete any archived PWA documentation (that's preserved in `docs/archive/`)

---

## Task 5: Create Documentation Index

**Intent**: A single manifest file that lists all documentation, its purpose, location, and status makes the project navigable. This is especially valuable for AI assistants resuming work on the project.

### Actions

Create `docs/INDEX.md` with the following structure:

```markdown
# SnakeMath Documentation Index

> Last updated: [DATE]

## How to Use This Index

This index lists all project documentation. When resuming work on SnakeMath:
1. Start with `CURRENT_STATE.md` for project status
2. Check `ROADMAP_V2.md` for what's next
3. Reference other documents as needed

## Active Documentation

| Document | Location | Purpose | Updated |
|----------|----------|---------|---------|
| ROADMAP_V2.md | `/ROADMAP_V2.md` | Authoritative roadmap, phase status, strategic decisions | Phase XX |
| CURRENT_STATE.md | `/docs/CURRENT_STATE.md` | Project resume guide, what's implemented | Phase XX |
| DECISIONS.md | `/docs/DECISIONS.md` | Technical decisions (D-XXX series) | Phase XX |
| LL_LI.md | `/docs/LL_LI.md` | Lessons Learned and Lessons Identified | Phase XX |
| DESIGN_SYSTEM.md | `/docs/DESIGN_SYSTEM.md` | UI patterns, component conventions, styling | Phase XX |
| TESTING.md | `/docs/TESTING.md` | Testing strategy, commands, CI configuration | Phase XX |
| CLAUDE_CODE_WORKFLOW.md | `/docs/CLAUDE_CODE_WORKFLOW.md` | Implementation workflow for Claude Code | Phase XX |
| PLANNING_WORKFLOW.md | `/docs/PLANNING_WORKFLOW.md` | Planning session workflow for Claude Opus | Phase XX |

## Phase Plans (Historical)

Located in `/docs/phases/`. These document the planning for each completed phase.

| Phase | Document | Summary |
|-------|----------|---------|
| 1 | PHASE_01_PLAN.md | Project foundation |
| 2 | PHASE_02_PLAN.md | Layout & Navigation |
| ... | ... | ... |

## Archived Documentation

Located in `/docs/archive/`. These documents describe approaches that were later superseded.

| Document | Archived | Reason |
|----------|----------|--------|
| VISUAL_TESTING.md | Phase 9 | Visual regression removed from CI (D-070) |

## Project Knowledge Files

| Document | Location | Purpose |
|----------|----------|---------|
| CLAUDE.md | `/CLAUDE.md` | Claude Code project instructions |
| archive_components.md | Project Knowledge | Inventory of archive Vue components |
| archive_content.md | Project Knowledge | Inventory of archive educational content |
| archive_data.md | Project Knowledge | Inventory of archive data structures |
| archive_utilities.md | Project Knowledge | Inventory of archive utility functions |
| PHASE_TEMPLATE_PLAN.md | Project Knowledge | Template for creating phase plans |

## Numbering Conventions

| Prefix | Meaning | Current Range |
|--------|---------|---------------|
| R-XXX | Roadmap decisions | R-001 through R-0XX |
| D-XXX | Technical decisions | D-001 through D-1XX |
| LL-XXX | Lessons Learned | LL-001 through LL-0XX |
| LI-XXX | Lessons Identified | LI-001 through LI-0XX |

## Document Naming Convention

All documentation files use `UPPER_SNAKE_CASE.md` format.
```

### Filling In Details

- Replace `[DATE]` with current date
- Replace `Phase XX` entries with actual phase numbers by checking each document
- Fill in the phase plans table based on what exists in `docs/phases/`
- Update numbering ranges by scanning DECISIONS.md and LL_LI.md for highest numbers
- Add any other documents discovered during the audit

---

## Task 6: Add Document History to Key Files (If Missing)

**Intent**: Major documents should track their evolution. ROADMAP_V2.md already has this pattern; extend to other core documents if they lack it.

### Target Documents
- `docs/DECISIONS.md`
- `docs/LL_LI.md`
- `docs/CURRENT_STATE.md`

### Actions

For each document, check if it has a "Document History" or "Changelog" section at the bottom. If not, add one:

```markdown
---

## Document History

| Date | Phase | Changes |
|------|-------|---------|
| [Initial date if known] | Phase 1 | Document created |
| ... | ... | ... |
| [Current date] | Phase 21 | Added document history section |
```

If the document already has history tracking, leave it as-is.

---

## Task 7: Verify and Report

**Intent**: Confirm the cleanup was successful and document what was done.

### Actions

1. Verify directory structure:
   ```
   docs/
   ├── INDEX.md (new)
   ├── CURRENT_STATE.md
   ├── DECISIONS.md
   ├── LL_LI.md
   ├── DESIGN_SYSTEM.md
   ├── TESTING.md
   ├── CLAUDE_CODE_WORKFLOW.md
   ├── PLANNING_WORKFLOW.md
   ├── phases/
   │   ├── PHASE_01_PLAN.md
   │   ├── PHASE_02_PLAN.md
   │   └── ... (completed phase plans)
   └── archive/
       ├── VISUAL_TESTING.md (if existed)
       └── ... (other archived docs)
   ```

2. Verify ROADMAP_V2.md no longer references PWA in future plans

3. Create a brief summary of changes made (can be added to LL_LI.md as a new entry or reported in the response)

---

## Success Criteria

- [ ] All phase plans consolidated in `docs/phases/`
- [ ] Outdated documentation moved to `docs/archive/` with archive headers
- [ ] PWA removed from ROADMAP_V2.md future plans
- [ ] `docs/INDEX.md` created with complete inventory
- [ ] Document history sections added to core docs (if missing)
- [ ] No orphaned or duplicate documentation files
- [ ] Directory structure is clean and navigable

---

## Notes for Claude Code

- **Read before acting**: Audit the current state before making changes
- **Preserve content**: Move and annotate, don't delete
- **Be thorough**: Check root, docs/, and any subdirectories for documentation
- **Update cross-references**: If any document references a moved file, update the path
- **Commit message suggestion**: `docs: consolidate and index documentation for MVP`

---

## Questions to Resolve During Execution

If you encounter any of these situations, use your judgment:

1. **Phase plan exists but is incomplete/draft**: Move to `docs/phases/` anyway with a note
2. **Document serves multiple purposes**: List in INDEX.md under most relevant category, note secondary purpose
3. **Uncertain if document is outdated**: Keep in active docs/, add to INDEX.md, note uncertainty
4. **Numbering gaps in decisions/lessons**: Don't renumber — gaps indicate removed/merged entries
