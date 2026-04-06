'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const DARK_VARS: Record<string, string> = {
  '--background':                '#09090b',
  '--foreground':                '#ededed',
  '--card':                      '#18181b',
  '--card-foreground':           '#ededed',
  '--popover':                   '#1c1c1c',
  '--popover-foreground':        '#e5e5e5',
  '--primary':                   '#3b82f6',
  '--primary-foreground':        '#ffffff',
  '--secondary':                 '#1c1c1c',
  '--secondary-foreground':      '#e5e5e5',
  '--muted':                     '#1c1c1c',
  '--muted-foreground':          '#737373',
  '--accent':                    '#3b82f6',
  '--accent-foreground':         '#ffffff',
  '--destructive':               '#ef4444',
  '--destructive-foreground':    '#ffffff',
  '--border':                    'rgba(255, 255, 255, 0.08)',
  '--input':                     '#1c1c1c',
  '--ring':                      '#3b82f6',
  '--sidebar':                   '#050505',
  '--sidebar-foreground':        '#ededed',
  '--sidebar-primary':           '#3b82f6',
  '--sidebar-primary-foreground':'#ffffff',
  '--sidebar-accent':            '#1c1c1c',
  '--sidebar-accent-foreground': '#e5e5e5',
  '--sidebar-border':            'rgba(255, 255, 255, 0.05)',
  '--sidebar-ring':              '#3b82f6',
  // Tailwind color tokens (used by bg-background, etc.)
  '--color-background':          '#09090b',
  '--color-foreground':          '#ededed',
  '--color-card':                '#18181b',
  '--color-card-foreground':     '#ededed',
  '--color-popover':             '#1c1c1c',
  '--color-popover-foreground':  '#e5e5e5',
  '--color-primary':             '#3b82f6',
  '--color-primary-foreground':  '#ffffff',
  '--color-secondary':           '#1c1c1c',
  '--color-secondary-foreground':'#e5e5e5',
  '--color-muted':               '#1c1c1c',
  '--color-muted-foreground':    '#737373',
  '--color-accent':              '#3b82f6',
  '--color-accent-foreground':   '#ffffff',
  '--color-destructive':         '#ef4444',
  '--color-border':              'rgba(255, 255, 255, 0.08)',
  '--color-input':               '#1c1c1c',
  '--color-ring':                '#3b82f6',
};

const LIGHT_VARS: Record<string, string> = {
  '--background':                '#f5f5f7',
  '--foreground':                '#111111',
  '--card':                      '#ffffff',
  '--card-foreground':           '#111111',
  '--popover':                   '#ffffff',
  '--popover-foreground':        '#111111',
  '--primary':                   '#2563eb',
  '--primary-foreground':        '#ffffff',
  '--secondary':                 '#f0f0f0',
  '--secondary-foreground':      '#111111',
  '--muted':                     '#e8e8ea',
  '--muted-foreground':          '#6b7280',
  '--accent':                    '#2563eb',
  '--accent-foreground':         '#ffffff',
  '--destructive':               '#dc2626',
  '--destructive-foreground':    '#ffffff',
  '--border':                    'rgba(0, 0, 0, 0.08)',
  '--input':                     '#f0f0f2',
  '--ring':                      '#2563eb',
  '--sidebar':                   '#ececee',
  '--sidebar-foreground':        '#111111',
  '--sidebar-primary':           '#2563eb',
  '--sidebar-primary-foreground':'#ffffff',
  '--sidebar-accent':            '#e0e0e2',
  '--sidebar-accent-foreground': '#111111',
  '--sidebar-border':            'rgba(0, 0, 0, 0.06)',
  '--sidebar-ring':              '#2563eb',
  // Tailwind color tokens — directly override compiled Tailwind values
  '--color-background':          '#f5f5f7',
  '--color-foreground':          '#111111',
  '--color-card':                '#ffffff',
  '--color-card-foreground':     '#111111',
  '--color-popover':             '#ffffff',
  '--color-popover-foreground':  '#111111',
  '--color-primary':             '#2563eb',
  '--color-primary-foreground':  '#ffffff',
  '--color-secondary':           '#f0f0f0',
  '--color-secondary-foreground':'#111111',
  '--color-muted':               '#e8e8ea',
  '--color-muted-foreground':    '#6b7280',
  '--color-accent':              '#2563eb',
  '--color-accent-foreground':   '#ffffff',
  '--color-destructive':         '#dc2626',
  '--color-border':              'rgba(0, 0, 0, 0.08)',
  '--color-input':               '#f0f0f2',
  '--color-ring':                '#2563eb',
};

export function ThemeApplier() {
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const activeTheme = resolvedTheme ?? theme;
    const vars = activeTheme === 'light' ? LIGHT_VARS : DARK_VARS;
    const root = document.documentElement;

    // Apply as inline styles on <html> — highest possible specificity
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Also toggle the data-theme attribute for any data-attribute-based CSS
    root.setAttribute('data-theme', activeTheme === 'light' ? 'light' : 'dark');
  }, [theme, resolvedTheme]);

  return null;
}
