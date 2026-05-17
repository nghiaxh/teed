#!/usr/bin/env node
import {render} from 'ink';
import React from 'react';
import {writeFileSync} from 'fs';
import {Command} from 'commander';
import {DEFAULT_RSS_FEEDS} from './feeds/rss.js';
import {aggregateNews} from './feeds/aggregator.js';
import App from './app.js';

interface ActionOptions {
	limit: string;
	output?: string;
	rssFeeds?: string;
	debug?: boolean;
}

const program = new Command();

program.name('df').description('Daily Feed - tổng hợp tin RSS');
program.argument('[keyword]', 'từ khóa tìm kiếm');

program
	.option('-l, --limit <number>', 'số bài tối đa', '10')
	.option('-o, --output <file>', 'xuất markdown')
	.option('--rss-feeds <urls>', 'feed tùy chỉnh, cách nhau dấu phẩy')
	.option('--debug', 'bật log chi tiết lỗi ra stderr', false)
	.action(async (keyword: string | undefined, opts: ActionOptions) => {
		if (!keyword) {
			program.help();
			return;
		}
		if (opts.debug) process.env['DEBUG'] = '1';

		const feeds = opts.rssFeeds?.split(',').filter(Boolean) ?? [];
		const limit = parseInt(opts.limit, 10);

		let articles: any[] = [];
		let errorMsg: string | undefined;
		try {
			articles = await aggregateNews(keyword, limit, feeds);
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Lỗi không xác định';
		}

		const {unmount} = render(
			<App keyword={keyword} articles={articles} errorMsg={errorMsg} />,
		);

		await new Promise(resolve => setTimeout(resolve, 0));

		if (opts.output && articles.length > 0) {
			const md = articles
				.map(
					(a, i) =>
						`## ${i + 1}. ${a.title}\n- Nguồn: ${a.source}\n- Link: ${
							a.link
						}\n\n${a.snippet}`,
				)
				.join('\n\n---\n\n');
			writeFileSync(opts.output, `# ${keyword}\n\n${md}`, 'utf8');
			console.log(`\nĐã tải file: ${opts.output}`);
		}

		unmount();
		process.exit(errorMsg ? 1 : 0);
	});

program.command('list').action(() => {
	console.log('Danh sách các feed mặc định:');
	DEFAULT_RSS_FEEDS.forEach((url, i) => console.log(`${i + 1}. ${url}`));
	process.exit(0);
});

program.parse(process.argv);
