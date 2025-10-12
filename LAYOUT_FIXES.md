# Layout and Component Fixes for NuloAfrica

## Identified Issues

### 1. Duplicate Property Detail Pages
- **Issue**: Two property detail pages exist:
  - `app/property/[id]/page.tsx` (simpler version)
  - `app/properties/[id]/page.tsx` (enhanced version with map)
- **Fix**: Remove the duplicate at `app/property/[id]/page.tsx` and keep only `app/properties/[id]/page.tsx`

### 2. Google Maps API Integration
- **Status**: Google Maps script added to layout
- **Required**: Set environment variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **File**: Create `.env.local` with your API key (see `env.example`)

### 3. CSS Classes
- **Status**: All custom CSS classes are defined in `globals.css`
- **Classes Available**:
  - `.glass-nav` - Navigation glassmorphism
  - `.bg-warm-ivory-gradient` - Background gradient
  - `.luxury-gradient-button` - Gold gradient buttons
  - `.animate-fade-in-up` - Fade animations
  - `.hover-lift` - Hover effects

## Common Fixes

### Fix 1: Missing Component Imports
Ensure all pages import required components:
```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
```

### Fix 2: Google Maps TypeScript Errors
Add to `global.d.ts` or component:
```tsx
declare global {
  interface Window {
    google: typeof google;
  }
}
```

### Fix 3: Layout Consistency
All non-dashboard pages should have:
1. Fixed header with glassmorphism
2. Main content with proper padding
3. Consistent color scheme (amber/gold accents)
4. Responsive design

## Pages Status

✅ **Working Pages**:
- Home (`/`) - Enhanced search bar with Google Autocomplete
- Properties (`/properties`) - List/Map view toggle, location-based filtering
- Property Details (`/properties/[id]`) - With map preview
- Profile (`/profile`) - Editable form fields
- Messages (`/messages`) - Two-column layout
- Favorites (`/favorites`) - Grid view with empty state

⚠️ **Needs Review**:
- Dashboard (`/dashboard`) - Check if sidebar layout works
- Sign In/Sign Up - Verify form styling
- Admin - Check permissions and layout

## Next Steps

1. **Remove duplicate property page**:
   ```bash
   rm -rf app/property
   ```

2. **Set up environment variables**:
   - Copy `env.example` to `.env.local`
   - Add your Google Maps API key

3. **Test each page** for:
   - Responsive design
   - Component rendering
   - Navigation links
   - Form submissions
   - Map functionality

4. **Fix any TypeScript errors** related to Google Maps types

## Component Structure

```
app/
├── page.tsx (Home - ✅)
├── properties/
│   ├── page.tsx (Listings - ✅)
│   └── [id]/page.tsx (Details - ✅)
├── dashboard/page.tsx (Dashboard - ⚠️)
├── profile/page.tsx (Profile - ✅)
├── messages/page.tsx (Messages - ✅)
├── favorites/page.tsx (Favorites - ✅)
├── signin/page.tsx (Sign In - ⚠️)
├── signup/page.tsx (Sign Up - ⚠️)
└── admin/page.tsx (Admin - ⚠️)
```

## Styling Guidelines

All pages should follow:
- **Background**: `bg-gradient-to-br from-amber-50 via-white to-stone-50`
- **Cards**: `bg-white/90 backdrop-blur-sm border-white/50 rounded-2xl shadow-lg`
- **Buttons**: `bg-amber-500 hover:bg-amber-600 text-white rounded-xl`
- **Accent Color**: Amber/Gold (#f59e0b, #d4a857)
- **Text**: Slate shades for hierarchy
- **Animations**: Fade-in, slide-up, hover-lift effects
