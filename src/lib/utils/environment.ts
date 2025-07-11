import { browser } from '$app/environment';

export const isBrowser: boolean = browser;

export const isServer: boolean = !browser;