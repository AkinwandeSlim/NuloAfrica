# 🗺️ Mapbox Setup - Quick Start

## ✅ What's Been Done

1. ✅ **Updated `app/layout.tsx`** - Removed Google Maps script, added Mapbox CSS
2. ✅ **Updated `env.example`** - Changed to Mapbox access token
3. ✅ **Created migration guide** - Complete documentation in `MAPBOX_MIGRATION.md`

---

## 🚀 Next Steps (You Need to Do)

### Step 1: Install Mapbox Packages

Run this command in your terminal:

```bash
npm install mapbox-gl @mapbox/mapbox-gl-geocoder react-map-gl
```

**What these do:**
- `mapbox-gl` - Core Mapbox library
- `@mapbox/mapbox-gl-geocoder` - Location search/autocomplete
- `react-map-gl` - React wrapper for easy integration

### Step 2: Get Your Mapbox Access Token

1. **Sign up** (free, no credit card): https://account.mapbox.com/auth/signup/
2. **Get token**: https://account.mapbox.com/access-tokens/
3. Copy your **Default public token** (starts with `pk.`)

### Step 3: Create `.env.local` File

Create a file named `.env.local` in your project root:

```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4eHgifQ.xxxxxxxxxxxxx
```

Replace with your actual token!

### Step 4: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart
npm run dev
```

---

## 📝 Pages That Need Updating

I can help you update these pages to use Mapbox:

### 1. Home Page (`app/(public)/page.tsx`)
**Current:** Google Maps Autocomplete for location search
**Update to:** Mapbox Geocoder

### 2. Properties Page (`app/(public)/properties/page.tsx`)
**Current:** Google Maps with property markers
**Update to:** react-map-gl with Mapbox

### 3. Property Details (`app/(public)/properties/[id]/page.tsx`)
**Current:** Embedded Google Map
**Update to:** Mapbox static map

---

## 💡 Quick Comparison

| Feature | Google Maps | Mapbox |
|---------|-------------|--------|
| **Free tier** | $200 credit | 50,000 loads |
| **Cost after** | $7/1k loads | $5/1k loads |
| **Credit card** | Required | Not required |
| **Customization** | Limited | Extensive |
| **React support** | Manual | Official wrapper |
| **Map styles** | Standard | Beautiful, customizable |

---

## 🎯 Ready to Update Pages?

Once you've completed Steps 1-4 above, let me know and I'll update all the pages to use Mapbox!

**Commands to run:**

```bash
# 1. Install packages
npm install mapbox-gl @mapbox/mapbox-gl-geocoder react-map-gl

# 2. Create .env.local with your token
# (see Step 3 above)

# 3. Restart server
npm run dev
```

Then say: **"Update pages to use Mapbox"** and I'll do the rest! 🚀

---

## 📚 Documentation

- **Full migration guide:** `MAPBOX_MIGRATION.md`
- **Code examples:** See migration guide
- **Mapbox docs:** https://docs.mapbox.com/

---

## ❓ FAQ

**Q: Do I need a credit card?**
A: No! Free tier doesn't require a credit card.

**Q: How many map loads do I get?**
A: 50,000 per month for free.

**Q: Can I customize the map style?**
A: Yes! Mapbox has beautiful pre-built styles and you can create custom ones.

**Q: Is it hard to migrate?**
A: No! I'll help you update all the pages. It's mostly find-and-replace.

**Q: Will my URLs change?**
A: No, everything stays the same. Only the map provider changes.

---

**Ready? Complete Steps 1-4 above, then let me know!** ✨
