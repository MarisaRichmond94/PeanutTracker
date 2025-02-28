import { defaultTheme, DefaultTheme } from '@xstyled/styled-components'

export const theme: DefaultTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    'blue-100': '#b5ead7',
    'blue-200': '#8aa1ae',
    'blue-300': '#4a6172',
    'gray-100': '#e3e5ec',
    'gray-200': '#868686',
    'gray-300': '#737373',
    'gray-400': '#545454',
    'black': '#000000',
    'white': '#ffffff'
  }
};
