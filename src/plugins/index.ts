import { App } from 'vue'
import { setupTailwindcss } from './tailwindcss'
import setupPinia from './pinia'

export function setupPlugins(app: App) {
  setupTailwindcss()
  setupPinia(app)
}