# Pivot

Pivot is a fashion marketplace focused on making clothing discovery, resale, and
sustainable shopping more accessible.

## Authors

- Khushi Kunjoor — [GitHub](https://github.com/orangek1020)
- Saumya Chourasia — [GitHub](https://github.com/saumyaxc)
- Allen Biju — [GitHub](https://github.com/allenbiju30301)

## Project Description

Pivot connects buyers and sellers in a simple marketplace for discovering,
listing, and purchasing clothing.

The application is designed around two user experiences:

- Buying clothing
- Selling clothing

## Current Features

The feature list below describes Pivot's product scope. Some flows are still
under development and may be represented by a local prototype in the app.

### Buyer

- Browse clothing listings
- View product details
- View item price and condition
- View sustainability information
- Like and save items
- Add items to cart
- Purchase resale items
- Make offers on listings
- Message sellers
- Track orders
- Earn rewards points
- Rate purchased items

### Seller

- Create clothing listings
- Upload item photos
- Select item categories
- Add brand, size, and condition
- Add original and selling prices
- Receive suggested pricing based on similar listings
- Receive warnings when an item may be overpriced
- Publish listings to the marketplace
- Receive buyer offers
- Accept, counter, or decline offers
- Message buyers
- Receive shipping information
- Track completed sales
- Earn rewards points

## Design

Pivot uses a warm, natural color palette inspired by fashion and sustainability.

### Colors

| Name | Hex |
| --- | --- |
| Warm Beige | `#CF9B7A` |
| Forest Green | `#4F6B56` |
| Orange | `#C95B0C` |

### Typography

**Font:** Genty Sans

## Tech Stack

- React Native
- Expo
- Expo Router
- JavaScript / TypeScript
- Figma
- Figma MCP
- VS Code

## Getting Started

### 1. Clone the repository

```sh
git clone <repository-url>
cd Pivot/Pivot
```

If you already have the repository, change into the app directory containing
`package.json` before running the following commands.

### 2. Install dependencies

```sh
npm install
```

### 3. Start the Expo development server

```sh
npx expo start
```

Keep this terminal window open while using the app. Expo displays a QR code and
keyboard shortcuts in the terminal. If the default port is already in use, accept
the suggested available port or start Expo with a specific port:

```sh
npx expo start --port 8082
```

## Preview on a phone with Expo Go

1. Install **Expo Go** from the [Apple App Store](https://apps.apple.com/app/expo-go/id982107779)
   (iPhone) or [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
   (Android).
2. Sign in to Expo Go. If prompted, sign in to the Expo CLI on your computer as
   well by running `npx expo login` from the app directory.
3. Connect your phone and computer to the same Wi-Fi network.
4. Start the development server with `npx expo start`, then scan its QR code:
   - On iPhone, scan with the Camera app and open the link in Expo Go.
   - On Android, scan from Expo Go.
5. If the phone cannot reach your computer over the local network, stop Expo and
   restart with `npx expo start --tunnel`, then scan the new QR code.

Each collaborator needs their own Expo account; do not share account passwords.

## Preview in the iOS Simulator

Install Xcode and an iOS Simulator, start Expo with `npx expo start`, then press
`i` in the same terminal window.

## Project Structure

```text
Pivot/
├── Pivot/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── constants/
│   │   └── state/
│   ├── assets/
│   ├── package.json
│   └── app.json
└── README.md
```

## Development

Pivot is under active development. Additional features and functionality will be
added as the project progresses.
