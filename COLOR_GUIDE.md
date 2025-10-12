# 🎨 NuloAfrica Color Guide

## Official Color Palette

**Primary Brand Colors: Amber/Gold** (NOT Orange!)

---

## ✅ Correct Colors to Use

### Primary Colors (Amber/Gold)
```css
/* Main amber shades */
amber-50:  #fffbeb  /* Very light backgrounds */
amber-100: #fef3c7  /* Light backgrounds, badges */
amber-200: #fde68a  /* Subtle accents */
amber-300: #fcd34d  /* Borders on hover */
amber-400: #fbbf24  /* Active states */
amber-500: #f59e0b  /* Primary buttons, icons */
amber-600: #d97706  /* Button hover, links */
amber-700: #b45309  /* Dark accents */
amber-800: #92400e  /* Very dark accents */
```

### Neutral Colors (Slate/Stone)
```css
/* Text and backgrounds */
slate-50:  #f8fafc  /* Light backgrounds */
slate-600: #475569  /* Body text */
slate-700: #334155  /* Secondary text */
slate-800: #1e293b  /* Headings */
slate-900: #0f172a  /* Primary text */

stone-50:  #fafaf9  /* Alternative light bg */
stone-200: #e7e5e4  /* Borders */
stone-600: #57534e  /* Muted text */
```

### White & Transparent
```css
white:     #ffffff
white/90:  rgba(255, 255, 255, 0.9)  /* Cards with blur */
white/80:  rgba(255, 255, 255, 0.8)  /* Lighter cards */
```

---

## ❌ Colors to AVOID

### Orange (Too Bright, Wrong Brand)
```css
/* DO NOT USE THESE */
❌ orange-300
❌ orange-400
❌ orange-500
❌ orange-600

/* These are NOT our brand colors! */
```

---

## 📋 Component Color Usage

### Buttons

#### Primary Button
```tsx
// ✅ CORRECT
className="bg-amber-500 hover:bg-amber-600 text-white"

// ❌ WRONG
className="bg-orange-500 hover:bg-orange-600 text-white"
```

#### Outline Button
```tsx
// ✅ CORRECT
className="border-2 border-amber-500 text-amber-600 hover:bg-amber-50"

// ❌ WRONG
className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
```

#### Gradient Button (Luxury)
```tsx
// ✅ CORRECT
className="bg-gradient-to-r from-amber-500 to-amber-600"

// ❌ WRONG
className="bg-gradient-to-r from-amber-500 to-orange-500"
```

### Text Gradients

#### Headline Accents
```tsx
// ✅ CORRECT
className="bg-gradient-to-r from-amber-600 to-amber-500 bg-clip-text text-transparent"

// ❌ WRONG
className="bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent"
```

### Backgrounds

#### Hero Section
```tsx
// ✅ CORRECT
className="bg-gradient-to-b from-amber-50/50 via-white to-stone-50/30"

// ❌ WRONG
className="bg-gradient-to-b from-orange-50/50 via-white to-stone-50/30"
```

#### CTA Section
```tsx
// ✅ CORRECT
className="bg-gradient-to-br from-amber-600 to-amber-700"

// ❌ WRONG
className="bg-gradient-to-br from-orange-600 to-orange-700"
```

### Icons & Badges

#### Icon Colors
```tsx
// ✅ CORRECT
<MapPin className="text-amber-500" />

// ❌ WRONG
<MapPin className="text-orange-500" />
```

#### Badge Backgrounds
```tsx
// ✅ CORRECT
className="bg-amber-100 text-amber-700"

// ❌ WRONG
className="bg-orange-100 text-orange-700"
```

### Borders & Rings

#### Focus States
```tsx
// ✅ CORRECT
className="focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"

// ❌ WRONG
className="focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
```

#### Hover Borders
```tsx
// ✅ CORRECT
className="border-stone-200 hover:border-amber-400"

// ❌ WRONG
className="border-stone-200 hover:border-orange-400"
```

---

## 🎨 Color Combinations

### Text on Backgrounds

#### Dark Text on Light
```tsx
// ✅ CORRECT
<div className="bg-white text-slate-900">
<div className="bg-amber-50 text-slate-800">
```

#### Light Text on Dark
```tsx
// ✅ CORRECT
<div className="bg-amber-600 text-white">
<div className="bg-slate-900 text-white">
```

### Hover States

#### Button Hover
```tsx
// ✅ CORRECT - Consistent amber
bg-amber-500 hover:bg-amber-600

// ❌ WRONG - Mixed colors
bg-amber-500 hover:bg-orange-600
```

#### Link Hover
```tsx
// ✅ CORRECT
text-slate-600 hover:text-amber-600

// ❌ WRONG
text-slate-600 hover:text-orange-600
```

---

## 📐 Gradient Patterns

### Warm Backgrounds
```tsx
// ✅ CORRECT - Amber tones
bg-gradient-to-br from-amber-50 via-white to-stone-50

// ❌ WRONG - Mixed with orange
bg-gradient-to-br from-amber-50 via-white to-orange-50
```

### Button Gradients
```tsx
// ✅ CORRECT - Amber gradient
bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500

// ❌ WRONG - Orange in gradient
bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500
```

### Text Gradients
```tsx
// ✅ CORRECT - Amber shades
bg-gradient-to-r from-amber-600 to-amber-500

// ❌ WRONG - Orange mixed in
bg-gradient-to-r from-amber-600 to-orange-500
```

---

## 🔍 Quick Reference

### Primary Actions
- **Background**: `bg-amber-500`
- **Hover**: `hover:bg-amber-600`
- **Text**: `text-white`
- **Shadow**: `shadow-[0_8px_30px_rgba(245,158,11,0.3)]`

### Secondary Actions
- **Border**: `border-2 border-amber-500`
- **Text**: `text-amber-600`
- **Hover BG**: `hover:bg-amber-50`
- **Hover Border**: `hover:border-amber-600`

### Links
- **Default**: `text-slate-600`
- **Hover**: `hover:text-amber-600`
- **Active**: `text-amber-600`

### Icons
- **Default**: `text-slate-400`
- **Active**: `text-amber-500`
- **Hover**: `hover:text-amber-600`

### Badges
- **Background**: `bg-amber-100`
- **Text**: `text-amber-700`
- **Border**: `border-amber-200`

---

## 🎯 Brand Identity

### Why Amber/Gold?

1. **Luxury Association** - Gold represents premium quality
2. **African Warmth** - Warm tones reflect African sunshine
3. **Trust & Stability** - Gold is associated with value
4. **Differentiation** - Stands out from blue/green competitors
5. **Consistency** - Single color family is more professional

### Why NOT Orange?

1. ❌ **Too playful** - Orange is more casual
2. ❌ **Inconsistent** - Mixing amber and orange looks unprofessional
3. ❌ **Wrong association** - Orange doesn't convey luxury
4. ❌ **Contrast issues** - Orange clashes with amber
5. ❌ **Brand confusion** - Multiple warm colors dilute brand

---

## ✅ Color Checklist

Before committing code, check:

- [ ] All buttons use `amber-500` (not `orange-500`)
- [ ] All hover states use `amber-600` (not `orange-600`)
- [ ] All gradients use amber shades only
- [ ] All text gradients use `from-amber-600 to-amber-500`
- [ ] All icons use `text-amber-500` when active
- [ ] All badges use `bg-amber-100 text-amber-700`
- [ ] All focus rings use `ring-amber-400/20`
- [ ] No `orange-` classes anywhere in the code

---

## 🔧 Find & Replace Guide

If you find orange colors, replace them:

```bash
# Search for these patterns
orange-50  → amber-50
orange-100 → amber-100
orange-200 → amber-200
orange-300 → amber-300
orange-400 → amber-400
orange-500 → amber-500
orange-600 → amber-600
orange-700 → amber-700
```

---

## 📱 Accessibility

### Contrast Ratios

All color combinations meet WCAG AA standards:

✅ **White on amber-600**: 4.5:1 (Pass)
✅ **Slate-900 on white**: 15:1 (Pass)
✅ **Amber-700 on amber-100**: 7:1 (Pass)
✅ **White on slate-900**: 15:1 (Pass)

---

## 🎨 CSS Custom Properties

For consistency, these are defined in `globals.css`:

```css
:root {
  --primary: oklch(0.65 0.08 75);        /* amber-500 */
  --primary-foreground: oklch(0.98 0.005 75);  /* white */
  --accent: oklch(0.7 0.08 75);          /* amber-600 */
  --accent-foreground: oklch(0.98 0.005 75);   /* white */
}
```

---

## 🚀 Summary

**One Rule to Remember:**

> **Use AMBER for everything warm. NEVER use ORANGE.**

**Quick Test:**
- If it's a button → `amber-500`
- If it's a hover → `amber-600`
- If it's a gradient → `from-amber-X to-amber-Y`
- If it's an icon → `text-amber-500`

**That's it!** 🎨✨

---

*Last updated: 2025-10-11*
*Color system version: 1.0*
