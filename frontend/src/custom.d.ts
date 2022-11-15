import 'styled-components';
import { ColorConfig, TypoConfig } from './style/theme';

declare module 'styled-components' {
	export interface DefaultTheme {
		COLOR: ColorConfig;
		TYPO: TypoConfig;
	}
}
