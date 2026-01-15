export interface ExampleNumber {
  label: string
  value: string
  description: string
  category: 'natural' | 'integer' | 'rational' | 'irrational' | 'complex' | 'special'
}

export const exampleNumbers: ExampleNumber[] = [
  // Natural numbers
  { label: '42', value: '42', description: 'A natural number', category: 'natural' },
  { label: '1', value: '1', description: 'The first natural number', category: 'natural' },
  { label: '0', value: '0', description: 'Zero (natural in some definitions)', category: 'natural' },

  // Integers
  { label: '-5', value: '-5', description: 'A negative integer', category: 'integer' },
  { label: '-1', value: '-1', description: 'Negative one', category: 'integer' },

  // Rational numbers
  { label: '1/2', value: '0.5', description: 'One half', category: 'rational' },
  { label: '3/4', value: '0.75', description: 'Three quarters', category: 'rational' },
  { label: '0.25', value: '0.25', description: 'Quarter (decimal)', category: 'rational' },
  { label: '-2/3', value: '-0.666666667', description: 'Negative fraction', category: 'rational' },

  // Irrational numbers
  {
    label: 'π',
    value: '3.14159265359',
    description: '3.14159... (pi)',
    category: 'irrational',
  },
  {
    label: 'e',
    value: '2.71828182846',
    description: "2.71828... (Euler's number)",
    category: 'irrational',
  },
  {
    label: '√2',
    value: '1.41421356237',
    description: '1.41421... (square root of 2)',
    category: 'irrational',
  },

  // Complex numbers
  { label: 'i', value: 'i', description: 'The imaginary unit', category: 'complex' },
  { label: '3+4i', value: '3+4i', description: 'A complex number', category: 'complex' },
  { label: '-2i', value: '-2i', description: 'Pure imaginary', category: 'complex' },

  // Special values
  { label: '∞', value: 'infinity', description: 'Positive infinity', category: 'special' },
  { label: '-∞', value: '-infinity', description: 'Negative infinity', category: 'special' },
]

export const examplesByCategory = {
  natural: exampleNumbers.filter((e) => e.category === 'natural'),
  integer: exampleNumbers.filter((e) => e.category === 'integer'),
  rational: exampleNumbers.filter((e) => e.category === 'rational'),
  irrational: exampleNumbers.filter((e) => e.category === 'irrational'),
  complex: exampleNumbers.filter((e) => e.category === 'complex'),
  special: exampleNumbers.filter((e) => e.category === 'special'),
}
