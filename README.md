# Notes Management App

A React Native app that allows multiple users to create, edit, delete, and manage notes offline. Each user can only see their own notes. Notes can include images, and all data is stored locally using AsyncStorage. The app also supports search, sorting, and user authentication.

---

## **Features**

### Authentication 

- Sign Up and Login screens
- Local user storage with unique username and password/PIN
- Multiple users on the same device
- Logout and switch accounts

### Notes Management

- Create, edit, delete notes
- Notes include:
  - Title
  - Description
  -  image (camera)
- Notes stored per user in AsyncStorage

### Image Support

- Add images from gallery
- Capture images from camera
- Images persist after app restart

### Search and Sort

- Search notes by title or body text
- Sort by:
  - Last Updated (newest → oldest / oldest → newest)
  - Title (A → Z / Z → A)
- Search and sort work together

---

## **Technologies & Libraries Used**

- **React Native** (Expo)
- **Expo Route** (Expo)
- **AsyncStorage** for local storage
- **Expo Image Picker** for camera & gallery access
- **JavaScript / TypeScript** fundamentals

---


