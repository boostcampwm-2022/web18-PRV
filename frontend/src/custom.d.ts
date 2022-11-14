import 'styled-components';
import { ColorConfig } from './style/theme';

declare module 'styled-components' {
	export interface DefaultTheme {
		COLOR: ColorConfig;
	}
}
