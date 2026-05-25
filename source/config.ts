import {readFileSync, writeFileSync, existsSync, unlinkSync} from 'fs';
import {homedir} from 'os';
import {join} from 'path';
import {DEFAULT_RSS_FEEDS} from './feeds/rss.js';

const CONFIG_PATH = join(homedir(), '.teed_feeds.json');

export function loadFeeds(): string[] {
	if (!existsSync(CONFIG_PATH)) return DEFAULT_RSS_FEEDS;
	try {
		const data = readFileSync(CONFIG_PATH, 'utf8');
		const arr = JSON.parse(data);
		return Array.isArray(arr) && arr.length > 0 ? arr : DEFAULT_RSS_FEEDS;
	} catch {
		return DEFAULT_RSS_FEEDS;
	}
}

function saveFeeds(feeds: string[]): void {
	writeFileSync(CONFIG_PATH, JSON.stringify(feeds, null, 2), 'utf8');
}

export function addFeed(url: string): string[] {
	const feeds = loadFeeds();
	if (!feeds.includes(url)) {
		feeds.push(url);
		saveFeeds(feeds);
	}
	return feeds;
}

const SETTINGS_PATH = join(homedir(), '.teed_settings.json');

export interface Settings {
	limit: number;
}

const DEFAULT_SETTINGS: Settings = {
	limit: 5,
};

export function loadSettings(): Settings {
	if (!existsSync(SETTINGS_PATH)) return DEFAULT_SETTINGS;
	try {
		const data = readFileSync(SETTINGS_PATH, 'utf8');
		return {...DEFAULT_SETTINGS, ...JSON.parse(data)};
	} catch {
		return DEFAULT_SETTINGS;
	}
}

export function saveSettings(settings: Settings): void {
	writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8');
}

export function removeFeed(target: string): string[] {
	if (target === '*') {
		if (existsSync(CONFIG_PATH)) unlinkSync(CONFIG_PATH);
		return DEFAULT_RSS_FEEDS;
	}
	let feeds = loadFeeds();
	feeds = feeds.filter(f => f !== target);
	saveFeeds(feeds);
	return feeds.length > 0 ? feeds : DEFAULT_RSS_FEEDS;
}
