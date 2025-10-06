import { createProdMockServer } from 'vite-plugin-mock'
import appModule from './app'

export function setupProdMockServer() {
  createProdMockServer([...appModule])
}
