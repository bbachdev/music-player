import { Store } from "@tauri-apps/plugin-store";

const CONFIG_STORE_NAME = 'config.dat'

export const store = new Store(CONFIG_STORE_NAME)