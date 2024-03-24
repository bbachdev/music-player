import { Store } from "@tauri-apps/plugin-store";

const CONFIG_STORE_NAME = 'config.dat'

export function getStore() {
  return new Store(CONFIG_STORE_NAME)
}