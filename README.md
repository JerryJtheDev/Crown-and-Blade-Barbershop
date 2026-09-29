# Crown & Blade Barbershop

A responsive appointment booking and daily schedule app for a Lagos barbershop. Customers can build a grooming appointment and choose a barber and time; staff can manage the day's bookings from a timeline view.

## Features

- **Customer booking flow:** browse grooming services, select one or more, choose a barber or any available barber, pick a date and time, and enter contact details.
- **Availability scheduling:** calculates appointment duration from selected services and checks staff shifts, days off, existing bookings, shop hours, and the Monday closure.
- **Booking confirmation:** shows a booking reference and lets the customer download an `.ics` calendar event.
- **Admin agenda:** view bookings by day in a staff timeline, filter by barber or status, inspect booking details, and add bookings directly.
- **Booking management:** update appointment status, cancel or delete bookings, and clear the schedule.
- **Service catalog:** edit the services shown in the customer booking flow.
- **Demo data:** starts with a sample Lagos business profile, three staff members, grooming services, and sample bookings. Use **Reset Demo** to restore the original sample data.
- **Responsive design:** customer and admin views adapt to mobile and desktop layouts.

## Requirements

- Node.js and npm. Use a Node.js release supported by the installed Vite version.

## Getting started

Install the dependencies from the project root:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL printed by Vite (the development script uses port `3000`). To create and preview a production build:

```bash
npm run build
npm run preview
```

Run the TypeScript check with:

```bash
npm run lint
```

## Using the app

The app opens in **Appointment Booking**. Select services, a barber (or **Any specialist**), a date and an available time, then provide the customer's name and phone number to confirm the appointment. The confirmation view includes an option to download the appointment to a calendar.

Switch to **Master Agenda Book** to review and manage appointments. Select a date or use the agenda controls, filter the schedule, select a booking for details, or create a walk-in/phone booking. The admin view also includes service management and schedule controls. The reset action restores the demo profile, staff, services, and sample bookings; clearing bookings removes only appointments.

## Data and configuration

This is a client-side demo. Business profile, services, staff, and bookings are stored in the browser's `localStorage`. Data is specific to the browser and origin where the app is opened; it is not shared between devices and there is no server-side database, sign-in, payment processing, or notification service.

Default business, staff, service, and sample booking data is defined in `src/utils/storage.ts`. Booking and staff data shapes are in `src/types/booking.ts`; availability and calendar helpers are in `src/utils/calendar.ts`.

The repository includes an `.env.example` with `GEMINI_API_KEY` and `APP_URL` placeholders for AI Studio hosting. The current app source does not read these values, so they are not required to run the booking app locally.

## Tech stack

- React 19 and TypeScript
- Vite 8
- Tailwind CSS 4 through the Vite plugin
- Lucide icons and Motion
- Browser `localStorage` for persistence

## Project layout

```text
src/
  components/
    customer/   Customer booking, scheduling, and confirmation flow
    admin/      Agenda, booking management, and service editor
  types/        Booking, service, staff, and business types
  utils/        Browser storage defaults and scheduling/calendar helpers
  assets/       Barbershop and staff imagery
  App.tsx       Shared app state and customer/admin view switching
  main.tsx      React entry point
```

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Vite development server on port 3000, bound to all interfaces. |
| `npm run build` | Build the production site into `dist/`. |
| `npm run preview` | Serve the production build locally for review. |
| `npm run lint` | Run TypeScript with no output files. |
| `npm run clean` | Remove the build output and `server.js` (script uses `rm -rf`). |
