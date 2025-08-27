/**
 * Export plugins used by the Vue instance here.
 * You can add your own plugins as needed.
 */

import { router } from '@/router';
import { pinia } from '@/store';
import type { Plugin } from 'vue';

export const plugins = Object.freeze<Plugin[]>([router, pinia]);
