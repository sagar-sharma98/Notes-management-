import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "@nm_users";
const NOTES_KEY = "@nm_notes"; // store object: { username: [notes...] }
const LOGGEDIN_KEY = "@nm_loggedin";

export async function getUsers(): Promise<any[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}
export async function saveUsers(users: any[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function saveLoggedInUser(username: string) {
  await AsyncStorage.setItem(LOGGEDIN_KEY, username);
}
export async function getLoggedInUser(): Promise<string | null> {
  return AsyncStorage.getItem(LOGGEDIN_KEY);
}
export async function logout() {
  await AsyncStorage.removeItem(LOGGEDIN_KEY);
}

export async function getNotesStore(): Promise<Record<string, any[]>> {
  const raw = await AsyncStorage.getItem(NOTES_KEY);
  return raw ? JSON.parse(raw) : {};
}
export async function saveNotesStore(store: Record<string, any[]>) {
  await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(store));
}

export async function getNotesByUser(username: string) {
  const store = await getNotesStore();
  return store[username] ?? [];
}
export async function addNoteForUser(username: string, note: any) {
  const store = await getNotesStore();
  store[username] = store[username] ?? [];
  store[username].push(note);
  await saveNotesStore(store);
}
export async function getNoteById(username: string, id: string) {
  const notes = await getNotesByUser(username);
  return notes.find((n) => n.id === id);
}
export async function updateNoteForUser(username: string, updated: any) {
  const store = await getNotesStore();
  store[username] = (store[username] ?? []).map((n) =>
    n.id === updated.id ? updated : n
  );
  await saveNotesStore(store);
}
export async function deleteNote(username: string, id: string) {
  const store = await getNotesStore();
  store[username] = (store[username] ?? []).filter((n) => n.id !== id);
  await saveNotesStore(store);
}
