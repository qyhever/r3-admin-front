import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
// import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import prettier from 'eslint-plugin-prettier/recommended'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    rules: {
      'vue/multi-word-component-names': 0,
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 3,
          },
          multiline: {
            max: 1,
          },
        },
      ],
      'vue/no-v-html': 0,
      'no-inner-declarations': 0,
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  // skipFormatting,
  prettier,
)
