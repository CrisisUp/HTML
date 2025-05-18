// src/ui/themeManager.ts
type Theme = 'classic' | 'modern' | 'nature' | 'dark' | 'ocean';

let currentTheme: Theme = 'classic';

export function changeTheme(theme: Theme): void {
  document.body.classList.remove(currentTheme);
  document.body.classList.add(theme);
  currentTheme = theme;
}