/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

const numColumns = 12;

let columnSizes = Array(numColumns + 1)
  .fill(null)
  .map((x, i) => {
    return ((i / numColumns) * 100).toFixed(5).replace('.00000', '');
  });

columnSizes = columnSizes.reduce((result, value, key) => {
  result['cols-' + key] = value + '%';
  return result;
}, {});

const numDivisions = 20;

const divisions = Array(numDivisions + 1)
  .fill(null)
  .map((x, i) => {
    return ((100 / numDivisions) * i).toFixed(5).replace('.00000', '');
  });

const percentSizes = divisions.reduce((result, value) => {
  result['p-' + value] = value + '%';
  return result;
}, {});

const viewportWidthSizes = divisions.reduce((result, value) => {
  result['vw-' + value] = value + 'vw';
  return result;
}, {});

const viewportHeightSizes = divisions.reduce((result, value) => {
  result['vh-' + value] = value + 'vh';
  return result;
}, {});

module.exports = {
  separator: '_',

  theme: {
    screens: {
      sm: '0',
      md: '601px',
      lg: '1025px',
      xl: '1441px',
      xxl: '1651px',
      xxxl: '1921px',
    },
    fontFamily: {
      sans: [
        'neue-haas-grotesk-text',
        'Helvetica Neue',
        'Helvetica',
        'Arial',
        'sans-serif',
      ],
      serif: ['Times New Roman', 'Times', 'serif'],
      mono: ['monospace'],
    },
    width: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
      ...columnSizes,
      ...percentSizes,
      ...viewportWidthSizes,
      ...viewportHeightSizes,
      full: '100%',
      screen: '100vw',
    }),
    height: (theme) => ({
      auto: 'auto',
      ...theme('spacing'),
      ...percentSizes,
      ...viewportWidthSizes,
      ...viewportHeightSizes,
      full: '100%',
      screen: '100vh',
    }),
    minWidth: (theme) => ({
      none: 'none',
      ...theme('spacing'),
      ...columnSizes,
      ...percentSizes,
      ...viewportWidthSizes,
      ...viewportHeightSizes,
      full: '100%',
      screen: '100vw',
    }),
    minHeight: (theme) => ({
      none: 'none',
      ...theme('spacing'),
      ...percentSizes,
      ...viewportWidthSizes,
      ...viewportHeightSizes,
      full: '100%',
      screen: '100vh',
    }),
    maxWidth: (theme) => ({
      none: 'none',
      ...theme('spacing'),
      ...columnSizes,
      ...percentSizes,
      ...viewportWidthSizes,
      ...viewportHeightSizes,
      full: '100%',
      screen: '100vw',
    }),
    maxHeight: (theme) => ({
      none: 'none',
      ...theme('spacing'),
      ...percentSizes,
      ...viewportWidthSizes,
      ...viewportHeightSizes,
      full: '100%',
      screen: '100vh',
    }),
    colors: {
      black: '#000000',
      white: '#ffffff',
      gray: {
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
      },
    },
  },

  plugins: [
    // require('tailwind-css-variables')(),
    ({ addUtilities }) => {
      addUtilities({
        '.flex': {
          display: 'flex',
          'flex-wrap': 'wrap',
        },
        '.flex-no-wrap': {
          display: 'flex',
          'flex-wrap': 'nowrap',
        },
      });
    },
  ],

  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js',
    ],
  },
};
