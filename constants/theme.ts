/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#1E70BF';
const accentColor = '#0F4C81';
const tintColorDark = '#8FB3FF';

export const Colors = {
  light: {
    text: '#111827',
    background: '#F4F7FB',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#F8FBFF',
    border: '#E2E8F0',
    accent: accentColor,
    tint: tintColorLight,
    icon: '#475569',
    iconSecondary: '#64748B',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorLight,
    subtle: '#CBD5E1',
    mutedText: '#64748B',
  },
  dark: {
    text: '#E2E8F0',
    background: '#0F172A',
    surface: '#111827',
    surfaceElevated: '#111B2D',
    card: '#111B2D',
    border: '#334155',
    accent: '#82A1FF',
    tint: tintColorDark,
    icon: '#94A3B8',
    iconSecondary: '#CBD5E1',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorDark,
    subtle: '#334155',
    mutedText: '#94A3B8',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
