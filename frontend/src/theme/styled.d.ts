import 'styled-components';
import { ThemeType } from './theme/theme';

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    background: string;
    text: string;
    cardBackground: string;
  }
}