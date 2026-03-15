// src/theme/colors.js
export const Colors = {
  primary: '#714B67',
  primaryLight: '#9a7090',
  primaryDark: '#533650',
  secondary: '#017E84',
  secondaryLight: '#2da8ae',
  secondaryDark: '#015a5e',

  gray: '#8F8F8F',
  grayLight: '#D6D6D6',
  grayLighter: '#F4F2F3',

  bgBody: '#F0EDF1',
  surface: '#FFFFFF',
  surfaceAlt: '#FBF9FA',

  border: '#E4DCE2',
  borderFocus: 'rgba(113,75,103,0.28)',

  textMain: '#1E1218',
  textMuted: '#7A6574',

  success: '#017E84',
  successBg: '#D2F0F1',
  danger: '#C0392B',
  dangerBg: '#FDECEA',

  white: '#FFFFFF',
  black: '#000000',
};

export const Shadows = {
  sm: {
    shadowColor: '#714B67',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#714B67',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 6,
  },
  lg: {
    shadowColor: '#714B67',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.16,
    shadowRadius: 50,
    elevation: 12,
  },
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 100,
};
