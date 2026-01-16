# Claude Code Prompt: Archive Analysis & Documentation

## Context

This is the SnakeMath project, an educational math site being rebuilt with Vue 3 + TypeScript + Tailwind. The `archive/` folder contains two previous implementations:
- `archive/snake-math/` - Original implementation (likely vanilla JS or different framework)
- `archive/snake-math-vue/` - Previous Vue implementation

We are planning Phase 5 of the rebuild and need comprehensive documentation of what exists in the archive to inform content migration and feature decisions.

### Task

Analyze the archive folder and produce markdown documentation files that catalog:
1. **Educational content** (topics, explanations, examples)
2. **Components** (UI components, widgets, visualizations)
3. **Utilities/Functions** (math helpers, parsers, calculators)
4. **Data files** (symbol tables, example sets, navigation structures)

### Output Requirements

Create the following files in the project root:

**`archive_content.md`** - Educational content inventory
- List every math topic covered (algebra, calculus, statistics, etc.)
- For each topic: summarize the depth of explanation, note any worked examples, identify Python code samples
- Flag content that is complete vs. stub/placeholder
- Note any content that references external resources

**`archive_components.md`** - Component inventory
- List all Vue components (or equivalent UI modules)
- For each: describe purpose, props/inputs, visual output
- Identify interactive widgets vs. display-only components
- Note any visualizations (charts, graphs, diagrams) and how they're implemented
- Flag components that have tests

**`archive_utilities.md`** - Functions and utilities inventory
- List all utility functions (especially math-related)
- For each: describe inputs, outputs, and purpose
- Identify parsing functions (number input, expression parsing)
- Note any calculation engines (quadratic solver, derivative calculator, etc.)
- Flag functions that have tests

**`archive_data.md`** - Data structures inventory
- List all static data files (symbol tables, navigation, examples)
- Describe the structure/schema of each
- Note data that could be directly migrated vs. needs restructuring

### Analysis Guidelines

- Examine both `archive/snake-math/` and `archive/snake-math-vue/` directories
- Note differences between the two implementations where relevant
- Prioritize depth over brevity - this documentation will guide multiple future phases
- Use tables for inventories where appropriate
- Include file paths so content can be located later
- If something is unclear or incomplete in the archive, note it as such rather than guessing

### Structure for Each Inventory Item

For content topics:
```
### [Topic Name]
- **Location**: `archive/.../path/to/file`
- **Completeness**: Complete | Partial | Stub
- **Content**: [Summary of what's covered]
- **Code Examples**: Yes/No (languages if yes)
- **Visualizations**: Yes/No (describe if yes)
- **Migration Notes**: [Any considerations for bringing this into the new system]
```

For components:
```
### [Component Name]
- **Location**: `archive/.../path/to/file`
- **Purpose**: [What it does]
- **Inputs**: [Props, parameters]
- **Output**: [What it renders/displays]
- **Interactive**: Yes/No
- **Dependencies**: [External libraries, other components]
- **Test Coverage**: Yes/No
- **Reuse Potential**: High | Medium | Low | Rewrite
```

For utilities:
```
### [Function/Module Name]
- **Location**: `archive/.../path/to/file`
- **Purpose**: [What it calculates/processes]
- **Signature**: [Inputs → Outputs, described in words]
- **Test Coverage**: Yes/No
- **Migration Notes**: [Can it be used as-is, needs TypeScript, needs rewrite]
```

### Constraints

- Do not modify any files in the archive folder
- Do not execute or test any archive code
- Output files go in project root, not in archive
- Focus on cataloging and describing, not evaluating quality
- If the archive structure is confusing, document what you find and note uncertainties

### Success Criteria

The documentation is successful if someone reading it can:
1. Understand what math topics have existing content ready for migration
2. Identify which interactive widgets existed and what they did
3. Find utility functions that could be reused or adapted
4. Make informed decisions about what to migrate vs. rebuild
5. Locate specific files in the archive when needed
