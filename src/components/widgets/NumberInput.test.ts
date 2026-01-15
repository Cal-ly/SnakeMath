import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import NumberInput from './NumberInput.vue'

describe('NumberInput', () => {
  it('renders with default props', () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '' },
    })
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe('Enter a number')
  })

  it('shows valid state for valid numbers', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '42' },
    })
    // Should have check icon for valid input
    expect(wrapper.find('.fa-check').exists()).toBe(true)
  })

  it('shows error for invalid input', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: 'not a number' },
    })
    expect(wrapper.find('.fa-xmark').exists()).toBe(true)
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '' },
    })
    await wrapper.find('input').setValue('123')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['123'])
  })

  it('accepts negative numbers', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '-5' },
    })
    expect(wrapper.find('.fa-check').exists()).toBe(true)
  })

  it('accepts decimal numbers', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '3.14' },
    })
    expect(wrapper.find('.fa-check').exists()).toBe(true)
  })

  it('accepts complex numbers', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '3+4i' },
    })
    expect(wrapper.find('.fa-check').exists()).toBe(true)
    // Should show complex type hint
    expect(wrapper.text()).toContain('Complex')
  })

  it('handles empty input gracefully', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '' },
    })
    // Empty input should not show error or check icons
    expect(wrapper.find('.fa-check').exists()).toBe(false)
    expect(wrapper.find('.fa-xmark').exists()).toBe(false)
  })

  it('uses custom label when provided', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: '',
        label: 'Custom Label',
      },
    })
    expect(wrapper.find('label').text()).toBe('Custom Label')
  })

  it('uses custom placeholder when provided', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: '',
        placeholder: 'Custom placeholder',
      },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Custom placeholder')
  })

  it('disables input when disabled prop is true', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: '',
        disabled: true,
      },
    })
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('emits validChange when validity changes', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '42' },
    })

    // Change to invalid
    await wrapper.setProps({ modelValue: 'invalid' })

    expect(wrapper.emitted('validChange')).toBeTruthy()
  })

  it('accepts infinity', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: 'infinity' },
    })
    expect(wrapper.find('.fa-check').exists()).toBe(true)
  })

  it('accepts negative infinity', async () => {
    const wrapper = mount(NumberInput, {
      props: { modelValue: '-infinity' },
    })
    expect(wrapper.find('.fa-check').exists()).toBe(true)
  })
})
