# Header and Footer Components

This project now includes consistent header and footer components built with Tailwind CSS for your Quran web application.

## Components Created

### Header (`src/lib/components/shared/Header.svelte`)
- **Responsive Navigation**: Works on desktop and mobile
- **Logo**: Arabic letter "ق" (Qaf) in a circular design
- **Navigation Menu**: Home, Al-Quran, Prayer Times, Bookmarks, Settings
- **Search Bar**: Integrated search functionality (desktop only, mobile in dropdown)
- **Mobile Menu**: Hamburger menu for smaller screens
- **Active State**: Highlights current page
- **Sticky Position**: Stays at top when scrolling

### Footer (`src/lib/components/shared/Footer.svelte`)
- **Four Column Layout**: Logo/description, Quick Links, Resources, responsive grid
- **Social Media Icons**: Facebook, Twitter, GitHub (placeholder buttons)
- **Prayer Time Widget**: Next prayer indicator with all prayer times
- **Islamic Information**: Hijri date, location display
- **Responsive Design**: Adapts to different screen sizes

## Design System

### Colors
- **Primary**: Emerald green theme (`emerald-700`, `emerald-600`, etc.)
- **Background**: Light gray (`gray-50`)
- **Text**: Various gray shades for hierarchy
- **Cards**: White backgrounds with subtle shadows

### Typography
- **Headers**: Bold, clear hierarchy
- **Body**: Readable gray text
- **Links**: Emerald hover states

### Layout
- **Container**: Max width with responsive padding
- **Grid System**: CSS Grid for complex layouts
- **Flexbox**: For simpler alignments
- **Spacing**: Consistent spacing using Tailwind's spacing scale

## Pages Included

### Homepage (`src/routes/+page.svelte`)
- Hero section with call-to-action buttons
- Feature cards (Quran, Prayer Times, Bookmarks)
- Daily verse section

### Placeholder Pages
- **Prayer Times** (`/prayer-times`): Prayer schedule display
- **Bookmarks** (`/bookmarks`): Saved verses page
- **Settings** (`/settings`): User preferences

## Features

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive grids and layouts
- Touch-friendly buttons and links

### Accessibility
- Semantic HTML structure
- ARIA labels where needed
- Focus states for keyboard navigation
- Screen reader friendly

### Islamic Theme
- Arabic typography elements
- Islamic iconography (mosque, Quran, etc.)
- Prayer time integration
- Hijri calendar display

## Usage

The header and footer are automatically included in all pages through the layout file (`src/routes/+layout.svelte`). The layout creates a full-height flex container with the header at top, main content in the middle, and footer at bottom.

```svelte
<div class="min-h-screen flex flex-col bg-gray-50">
	<Header />
	<main class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
```

## Development

Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5174/` (or another port if 5174 is in use).

## Customization

### Colors
You can customize the color scheme by modifying the Tailwind classes. The current theme uses emerald green, but you can replace it with any other color:

- `emerald-700` → `blue-700`
- `emerald-600` → `blue-600`
- etc.

### Content
Update the navigation items, social links, and footer content by editing the respective component files.

### Layout
The layout can be modified in `src/routes/+layout.svelte` to change the overall page structure.
