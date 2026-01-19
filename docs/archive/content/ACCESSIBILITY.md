# SnakeMath Accessibility Guidelines

## Standards
SnakeMath aims to meet WCAG 2.1 Level AA compliance.

## Testing Checklist

### Before Each PR
- [ ] Tab through new components
- [ ] Check focus indicators
- [ ] Verify heading hierarchy
- [ ] Test with screen reader (VoiceOver/NVDA)

### Tools
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension
- [WAVE](https://wave.webaim.org/) - Web accessibility evaluator
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Chrome DevTools

### Manual Testing
1. **Keyboard only**: Navigate entire site without mouse
2. **Screen reader**: Test with VoiceOver (Mac) or NVDA (Windows)
3. **Zoom**: Test at 200% zoom
4. **Color**: Test with color blindness simulators

## Common Patterns

### Interactive Components
- Always include `aria-label` or visible text
- Use `aria-expanded` for toggles
- Trap focus in modals
- Return focus after modal closes

### Images and Icons
- Decorative: `aria-hidden="true"`
- Informative: Provide alt text
- Font Awesome: Always use `aria-hidden="true"`

### Forms (future)
- Associate labels with inputs
- Provide error messages
- Mark required fields

## Resources
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [MDN ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [Inclusive Components](https://inclusive-components.design/)
