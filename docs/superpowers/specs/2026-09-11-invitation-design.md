# Botirjon & Durdonaxon — Wedding Invitation Design

## Goal
Create a new standalone wedding invitation inspired by the ChorLove “Modern Floral” invitation shown by the user, without copying proprietary source code. The result must preserve the same light watercolor/floral visual language, scroll-based mobile-first structure, music control, and reveal animations as closely as can be reproduced from the public reference and screenshots.

## Event data
- Couple: Botirjon & Durdonaxon
- Date: 26.09.2026
- Time: 15:00
- Venue: Oqsaroy to'yxona
- Location behavior: same venue/location intent as the reference invitation; use the Oqsaroy venue map target in the location CTA.
- Background music: use the uploaded MP3 file from this conversation.

## Page / section order
1. **Bosh sahifa / Intro**
   - “TO'Y TAKLIFNOMASI”
   - Botirjon & Durdonaxon
   - Existing invitation’s pale watercolor background, purple floral corners, thin gold organic line art, soft pink/lavender floating petals.
   - Scroll cue and floating music control.

2. **Tabrik / Kelin-kuyov**
   - “ASSALOMU ALAYKUM”
   - Couple names with a floral wreath composition.
   - Invitation copy in the same centered elegant style as the reference.

3. **Ar-Rum 21**
   - Arabic verse exactly as approved by user:
     “وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا”
   - Uzbek line:
     “Va sizlarga sokinlik topishingiz uchun o‘zingizdan juftlar yaratganligi ham Uning oyat-belgilaridandir.”
   - Source: “AR-RUM, 21”
   - Same floral/light background — no dark sunset treatment.

4. **To'y ma'lumotlari**
   - Date: 26.09.2026
   - Time: 15:00
   - Venue: Oqsaroy to'yxona
   - Calendar/clock/location icon treatment in muted gold.

5. **Countdown**
   - Heading: “BAXTLI KUNIMIZGACHA”
   - Real-time countdown to 2026-09-26 15:00 Asia/Tashkent.
   - Values: KUN / SOAT / DAQIQA / SONIYA.
   - Elegant serif numbers, purple/gold accents, same light floral background.

6. **Lokatsiya**
   - Venue name: Oqsaroy to'yxona
   - Map preview card / map embed.
   - CTA: “Lokatsiyani ochish” or equivalent.

7. **Mehmonlar tilaklari**
   - Replace the earlier RSVP/confirmation section with the guest-wishes section, visually matching the reference invitation.
   - Show existing messages as stacked cards with initials, names and message text.
   - Form fields: “Ismingiz”, “Kelin-kuyovga tilagingiz...”
   - Submit button: “TILAK YUBORISH”
   - Wishes must persist across visitors; implement through a small serverless API + persistent database rather than browser-only local state.

## Visual system
- Background: warm white / ivory watercolor texture.
- Main accent: lavender / deep purple.
- Secondary accent: muted warm gold.
- Decoration: watercolor purple/blue/pink flowers concentrated in corners; thin abstract gold contour lines; translucent pink/lavender petals.
- Typography: elegant high-contrast serif for headings/names; clean sans-serif for small labels; italic serif for sentimental copy.
- Music button: floating circular button at lower-right, same visual weight as reference.
- Layout: mobile-first full-height sections; desktop centers content in a constrained column while keeping floral decoration at the edges.

## Animation behavior
Reproduce the invitation’s motion language rather than source code:
- section content enters with soft opacity + upward translation on scroll;
- floral groups use subtle scale/fade entrance;
- decorative petals drift slowly and continuously;
- scroll arrow gently bounces;
- countdown updates every second without layout shift;
- music button changes state smoothly and may use a very subtle pulse while audio is playing;
- transitions are calm, 600–900ms, with no aggressive effects.
- respect `prefers-reduced-motion`.

## Audio
- One global audio element for the entire invitation.
- Audio must not restart when moving between sections.
- Play/pause state controlled by floating button.
- Due to browser autoplay rules, start audio only after the first user interaction if autoplay is blocked.

## Technical architecture
- Dependency-free HTML + CSS + modern JavaScript modules for the simplest GitHub/Vercel deployment.
- CSS/IntersectionObserver animations with no heavy animation framework.
- Small utility modules isolate countdown and guest-wish logic.
- Optional Vercel serverless endpoint for shared guest wishes via Supabase environment variables; browser-local persistence is the zero-configuration fallback.
- Static assets optimized for mobile; audio loaded with `preload="metadata"`.

## Deployment
- New GitHub repository.
- Vercel project connected to GitHub.
- Production deployment after responsive and interaction checks.

## Acceptance criteria
- Visual style is clearly consistent with the supplied ChorLove screenshots: light floral/watercolor, not dark/sunset.
- Sections appear in the exact order above.
- Program page is absent.
- RSVP/confirmation page is absent.
- Guest wishes page replaces it and persists comments for all visitors.
- Countdown targets 26.09.2026 15:00 Asia/Tashkent.
- Uploaded MP3 is used as the invitation music.
- Mobile behavior is first-class and music/scroll animations remain smooth.
