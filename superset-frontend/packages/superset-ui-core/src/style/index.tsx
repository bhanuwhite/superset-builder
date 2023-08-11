/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import emotionStyled from '@emotion/styled';
import { useTheme as useThemeBasic } from '@emotion/react';
import createCache from '@emotion/cache';

export {
  css,
  keyframes,
  jsx,
  ThemeProvider,
  CacheProvider as EmotionCacheProvider,
  withTheme,
} from '@emotion/react';
export { default as createEmotionCache } from '@emotion/cache';

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends SupersetTheme { }
}

export function useTheme() {
  const theme = useThemeBasic();
  // in the case there is no theme, useTheme returns an empty object
  if (Object.keys(theme).length === 0 && theme.constructor === Object) {
    throw new Error(
      'useTheme() could not find a ThemeContext. The <ThemeProvider/> component is likely missing from the app.',
    );
  }
  return theme;
}

export const emotionCache = createCache({
  key: 'superset',
});

export const styled = emotionStyled;
const appliedTheme = localStorage.getItem('theme');
const backgroundColor = localStorage.getItem('backgroundColor');
const subHeaderColor = localStorage.getItem('subHeaderColor');
// console.log(backgroundColor, subHeaderColor, appliedTheme, 'bgc');

const defaultTheme = {
  borderRadius: 4,
  colors: {
    customBstStyles: {
      subHeader: '#FFFFFF',
      primaryButtonColor: '#fbfbfb',
      formInputColor: 'rgba(0, 0, 0, 0.08)',
      formInputText: 'rgba(0, 0, 0, 0.67)',
      tableHeaderbg: 'rgba(0,0,0,0.2)',
      heatMapToolTipText: '#000000',
      modalBg: '#ffffff',
      chartBg: '#ffffff',
      aceEditorBG: '#F5F5F8',
      tableChartHover: '#ECEEF2',
      tooltipBg: '#252525',
      borderColor: 'rgba(0,0,0,0.12)',
      errorIcon: '#000000',
    },
    text: {
      label: '#879399',
      help: '#737373',
    },
    toast: {
      base: '#1d98ff',
      success: '#00ca98',
      warning: '#ff9b56',
      error: 'fc5c66',
    },
    primary: {
      base: '#20A7C9',
      dark1: backgroundColor ? backgroundColor : '#1d98ff',
      dark2: '#156378',
      light1: '#79CADE',
      light2: '#A5DAE9',
      light3: '#D2EDF4',
      light4: '#E9F6F9',
      light5: '#F3F8FA',
    },
    secondary: {
      base: '#444E7C',
      dark1: '#363E63',
      dark2: '#282E4A',
      dark3: '#1B1F31',
      light1: '#8E94B0',
      light2: '#B4B8CA',
      light3: '#D9DBE4',
      light4: '#ECEEF2',
      light5: '#F5F5F8',
    },
    grayscale: {
      base: '#666666',
      dark1: 'rgba(0,0,0,0.87)',
      dark2: '#000000',
      light1: '#B2B2B2',
      light2: '#E0E0E0',
      light3: '#F0F0F0',
      light4: '#F7F7F7',
      light5: '#FFFFFF',
    },
    error: {
      base: '#cb323c',
      dark1: '#A7323F',
      dark2: '#FFFFFF',
      light1: '#EFA1AA',
      light2: 'rgba(203,50,60,.2)',
    },
    warning: {
      base: '#f26c0e',
      dark1: '#BF5E33',
      dark2: '#FFFFFF',
      light1: '#FEC0A1',
      light2: 'rgba(242,108,14,.2)',
    },
    alert: {
      base: '#007ad9',
      dark1: '#BC9501',
      dark2: '#7D6300',
      light1: '#FDE380',
      light2: '#FEF9E6',
    },
    success: {
      base: '#00796b',
      dark1: '#439066',
      dark2: '#FFFFFF',
      light1: '#ACE1C4',
      light2: 'rgba(0,121,107,.2)',
    },
    info: {
      base: '#007ad9',
      dark1: '#4D8CBE',
      dark2: '#FFFFFF',
      light1: '#B3DEFE',
      light2: 'rgba(0,122,217,.2)',
    },
  },
  opacity: {
    light: '10%',
    mediumLight: '35%',
    mediumHeavy: '60%',
    heavy: '80%',
  },
  typography: {
    families: {
      sansSerif: `'Inter', Helvetica, Arial`,
      serif: `Georgia, 'Times New Roman', Times, serif`,
      monospace: `'Fira Code', 'Courier New', monospace`,
    },
    weights: {
      light: 200,
      normal: 400,
      medium: 500,
      bold: 600,
    },
    sizes: {
      xxs: 9,
      xs: 10,
      s: 12,
      m: 14,
      l: 16,
      xl: 21,
      xxl: 28,
    },
  },
  zIndex: {
    aboveDashboardCharts: 10,
    dropdown: 11,
    max: 3000,
  },
  transitionTiming: 0.3,
  gridUnit: 4,
  gridUnit_6: 6,
  brandIconMaxWidth: 37,
};

const defaultThemeDark = {
  borderRadius: 4,
  colors: {
    customBstStyles: {
      subHeader: subHeaderColor ? subHeaderColor : '#008874',
      primaryButtonColor: '#fbfbfb',
      formInputColor: 'rgba(255, 255, 255, 0.08)',
      formInputText: 'rgba(255, 255, 255, 0.67)',
      heatMapToolTipText: '#010101',
      tableHeaderbg: '#5f5f5f',
      borderColor: 'rgba(255,255,255,0.12)',
      primaryButtonDsabledBg: 'rgba(255,255,255,0.12)',
      primaryButtonDsabledText: 'rgba(255,255,255,0.32)',
      modalBg: '#424242',
      chartBg: '#2d2d2d',
      aceEditorBG: '#c0c0c0',
      tableChartHover: '#000000',
      tooltipBg: '#5f5f5f',
      errorIcon: '#000000',
    },
    text: {
      label: '#879399',
      help: '#737373',
    },
    toast: {
      base: '#1d98ff',
      success: '#00ca98',
      warning: '#ff9b56',
      error: 'fc5c66',
    },
    primary: {
      base: '#20A7C9',
      dark1: backgroundColor ? backgroundColor : '#1d98ff',
      dark2: '#156378',
      light1: '#79CADE',
      light2: '#A5DAE9',
      light3: '#D2EDF4',
      light4: '#E9F6F9',
      light5: '#F3F8FA',
    },
    secondary: {
      base: '#444E7C',
      dark1: '#363E63',
      dark2: '#282E4A',
      dark3: '#1B1F31',
      light1: '#8E94B0',
      light2: '#B4B8CA',
      light3: '#D9DBE4',
      light4: '#ECEEF2',
      light5: '#F5F5F8',
    },
    grayscale: {
      base: '#666666',
      dark1: 'rgba(255,255,255,0.87)',
      dark2: '#fbfbfb',
      light1: '#B2B2B2',
      light2: '#E0E0E0',
      light3: '#F0F0F0',
      light4: '#383838',
      light5: '#2d2d2d',
    },
    error: {
      base: '#cb323c',
      dark1: '#A7323F',
      dark2: '#FFFFFF',
      light1: '#EFA1AA',
      light2: 'rgba(203,50,60,.2)',
    },
    warning: {
      base: '#f26c0e',
      dark1: '#BF5E33',
      dark2: '#FFFFFF',
      light1: '#FEC0A1',
      light2: 'rgba(242,108,14,.2)',
    },
    alert: {
      base: '#007ad9',
      dark1: '#BC9501',
      dark2: '#7D6300',
      light1: '#FDE380',
      light2: '#FEF9E6',
    },
    success: {
      base: '#00796b',
      dark1: '#439066',
      dark2: '#FFFFFF',
      light1: '#ACE1C4',
      light2: 'rgba(0,121,107,.2)',
    },
    info: {
      base: '#007ad9',
      dark1: '#4D8CBE',
      dark2: '#FFFFFF',
      light1: '#B3DEFE',
      light2: 'rgba(0,122,217,.2)',
    },
  },
  opacity: {
    light: '10%',
    mediumLight: '35%',
    mediumHeavy: '60%',
    heavy: '80%',
  },
  typography: {
    families: {
      sansSerif: `'Inter', Helvetica, Arial`,
      serif: `Georgia, 'Times New Roman', Times, serif`,
      monospace: `'Fira Code', 'Courier New', monospace`,
    },
    weights: {
      light: 200,
      normal: 400,
      medium: 500,
      bold: 600,
    },
    sizes: {
      xxs: 9,
      xs: 10,
      s: 12,
      m: 14,
      l: 16,
      xl: 21,
      xxl: 28,
    },
  },
  zIndex: {
    aboveDashboardCharts: 10,
    dropdown: 11,
    max: 3000,
  },
  transitionTiming: 0.3,
  gridUnit: 4,
  gridUnit_6: 6,
  brandIconMaxWidth: 37,
};

// console.log(defaultTheme.colors.customBstStyles, 'bgc');
export type SupersetTheme = typeof defaultThemeDark;

export interface SupersetThemeProps {
  theme: SupersetTheme;
}

export const supersetTheme =
  appliedTheme === 'light' ? defaultTheme : defaultThemeDark;
