# TripSync Mobile

Flutter mobile client for the TripSync vacation-reservation platform (iOS & Android).

Browse and reserve Hotels & Vacation Rentals, Car Rentals, and Tours & Activities through an API Gateway running at `http://localhost:4000`.

## Features

- Discover and search properties, cars, and tours
- Detail views with date selection and quantity steppers
- Checkout with order summary and mock card entry
- Booking confirmation with status and totals

## Getting started

```sh
flutter pub get
flutter run
```

The app talks to the API Gateway at `http://localhost:4000` by default. To point it at another API, override the base URL at build time:

```sh
flutter run --dart-define=API_BASE_URL=https://your-api.example.com
```
