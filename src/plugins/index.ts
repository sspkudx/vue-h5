import { router } from '@/router';
import { pinia } from '@/store';
import type { Plugin } from 'vue';

export const plugins = Object.freeze<Plugin[]>([router, pinia]);
