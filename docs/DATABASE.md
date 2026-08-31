# Database & Storage

Home AI uses Firebase Firestore for data and ImageKit for images.

## Firestore collections

### `items`

Each document represents one household item.

- `id`: string document ID
- `name`: item name
- `room`: room name
- `location`: storage location
- `tags`: array of strings
- `description`: text description
- `image_url`: primary ImageKit URL
- `created_at`: ISO timestamp
- `trashed_at`: ISO timestamp or empty when active

### `item_images`

Extra images for an item.

- `id`: string document ID
- `item_id`: related `items.id`
- `image_url`: ImageKit URL
- `sort_order`: display order

### `rooms`

- `id`: string document ID
- `name`: room name

### `access_users`

Family access control. The document ID is the lowercase Google email.

- `email`: approved Google email
- `role`: `owner` or `member`
- `active`: whether access is enabled
- `created_at`: ISO timestamp

## Images

All new primary and extra images upload to ImageKit under `/home-ai`. Firestore stores only the public URL. Deleting an item image removes its Firestore record and requests deletion from ImageKit.

## Access control

The browser signs in through Firebase Authentication with Google. Firestore Rules enforce that the signed-in Google email has an active document in `access_users`. The rules source is `firestore.rules`; publish it from Firebase Console.
