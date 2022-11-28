import { DefaultTheme } from 'styled-components';

type ColorName =
  | 'primary1'
  | 'primary2'
  | 'primary3'
  | 'primary4'
  | 'secondary1'
  | 'secondary2'
  | 'offWhite'
  | 'gray1'
  | 'gray2'
  | 'gray3'
  | 'gray4'
  | 'black'
  | 'error';

type TypoName = 'H4' | 'H5' | 'title' | 'subtitle' | 'body_h' | 'body1' | 'body2_h' | 'body2' | 'caption';

export type ColorConfig = {
  [key in ColorName]: string;
};

export type TypoConfig = {
  [key in TypoName]: string;
};

const COLOR: ColorConfig = {
  primary1: '#DFA9A7',
  primary2: '#7E4B77',
  primary3: '#3D334F',
  primary4: '#1F1D34',
  secondary1: '#FFF5BF',
  secondary2: '#FFD600',
  offWhite: '#F8F8F8',
  gray1: '#DCDCDC',
  gray2: '#B5B5B5',
  gray3: '#727272',
  gray4: '#474747',
  black: '#151515',
  error: '#F45452',
};

const TYPO: TypoConfig = {
  H4: `
		font-weight: 300;
		font-size: 36px;
	`,
  H5: `
		font-weight: 700;
		font-size: 18px;
  `,
  title: `
		font-weight: 400;
		font-size: 16px;
  `,
  subtitle: `
		font-weight: 300;
		font-size: 16px;
	`,
  body_h: `
		font-weight: 700;
		font-size: 14px;`,
  body1: `
		font-weight: 300;
		font-size: 14px;`,
  body2_h: `
    font-weight: 400;
    font-size: 12px;`,
  body2: `
		font-weight: 300;
		font-size: 12px;`,
  caption: `
		font-weight: 300;
		font-size: 10px;`,
};

const theme: DefaultTheme = {
  COLOR,
  TYPO,
};

export default theme;
