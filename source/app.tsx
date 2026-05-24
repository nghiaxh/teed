import React, {useState, useCallback} from 'react';
import {Text, Box, useStdout} from 'ink';
import TextInput from 'ink-text-input';
import {aggregateNews} from './feeds/aggregator.js';
import {loadFeeds, addFeed, removeFeed} from './config.js';
import type {Article} from './feeds/rss.js';

const COMMANDS_LIST = `
  /list              Xem danh sach feeds
  /add <url>         Them feed moi
  /remove <url|*>    Xoa feed
  /exit              Thoat chuong trinh
`;

export function relativeTime(dateStr: string): string {
	if (!dateStr) return '';
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const minutes = Math.floor(diffMs / 60000);
	if (minutes < 1) return 'Vua xong';
	if (minutes < 60) return `${minutes} phut`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} gio`;
	const days = Math.floor(hours / 24);
	if (days < 30) return `${days} ngay`;
	return date.toLocaleDateString('vi-VN');
}

export function truncate(str: string, maxLen: number): string {
	if (!str || maxLen <= 0) return '';
	if (str.length <= maxLen) return str;
	return str.slice(0, maxLen - 1) + '\u2026';
}

const ArticleRow = ({
	article,
	index,
	width,
}: {
	article: Article;
	index: number;
	width: number;
}) => {
	const titleMax = Math.max(width - 6, 20);
	const linkMax = Math.max(width - 4, 20);

	return (
		<Box flexDirection="column" marginY={0}>
			<Box>
				<Text bold color="yellow">
					{'  '}[{index + 1}]
				</Text>
				<Text bold wrap="truncate">
					{' '}
					{truncate(article.title, titleMax)}
				</Text>
			</Box>
			<Text dimColor>
				{'    '}
				{article.source}
				{article.date ? ` · ${relativeTime(article.date)}` : ''}
			</Text>
			<Text color="cyan" wrap="truncate">
				{'    '}
				{truncate(article.link, linkMax)}
			</Text>
		</Box>
	);
};

const App = () => {
	const [input, setInput] = useState('');
	const [feeds, setFeeds] = useState<string[]>(() => loadFeeds());
	const [articles, setArticles] = useState<Article[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [message, setMessage] = useState('');
	const [searched, setSearched] = useState(false);

	const {stdout} = useStdout();
	const columns = stdout?.columns ?? 80;
	const rows = stdout?.rows ?? 24;
	const contentMaxHeight = rows - 2;

	const handleSubmit = useCallback(
		async (value: string) => {
			const trimmed = value.trim();
			if (!trimmed) {
				setInput('');
				return;
			}

			if (trimmed.startsWith('/')) {
				const parts = trimmed.slice(1).split(/\s+/);
				const cmd = parts[0]?.toLowerCase() ?? '';
				setError('');
				setArticles([]);
				setSearched(false);
				setLoading(false);

				if (cmd === 'exit') {
					process.exit(0);
				} else if (cmd === 'help') {
					setMessage(COMMANDS_LIST);
				} else if (cmd === 'list') {
					const maxShow = 20;
					const shown = feeds.slice(0, maxShow);
					let msg = `Feeds (${feeds.length}):\n${shown
						.map((f, i) => `${i + 1}. ${f}`)
						.join('\n')}`;
					if (feeds.length > maxShow) {
						msg += `\n... va ${feeds.length - maxShow} feed khac.`;
					}

					setMessage(msg);
				} else if (cmd === 'add' && parts[1]) {
					const newFeeds = addFeed(parts[1]);
					setFeeds(newFeeds);
					setMessage(`Da them: ${parts[1]}`);
				} else if (cmd === 'remove') {
					const target = parts[1];
					if (!target) {
						setMessage('Can URL hoac * de xoa tat ca.');
					} else {
						const newFeeds = removeFeed(target);
						setFeeds(newFeeds);
						setMessage(
							target === '*'
								? 'Da xoa tat ca feed tuy chinh.'
								: `Da xoa: ${target}`,
						);
					}
				} else {
					setMessage('Lenh khong hop le.');
				}

				setInput('');
				return;
			}

			setMessage('');
			setError('');
			setArticles([]);
			setLoading(true);
			setSearched(true);
			try {
				const result = await aggregateNews(trimmed, 5, feeds);
				setArticles(result);
			} catch (e) {
				setError(
					e instanceof Error ? e.message : 'Loi khong xac dinh',
				);
			} finally {
				setLoading(false);
				setInput('');
			}
		},
		[feeds],
	);

	const showCommands = input.startsWith('/');

	return (
		<Box height={rows} flexDirection="column">
			<Box
				flexGrow={1}
				height={contentMaxHeight}
				overflow="hidden"
				flexDirection="column"
			>
				{showCommands && (
					<Box flexDirection="column">
						<Text>{COMMANDS_LIST}</Text>
					</Box>
				)}

				{!showCommands && message && (
					<Box flexDirection="column">
						<Text>{message}</Text>
					</Box>
				)}

				{!showCommands &&
					searched &&
					!loading &&
					articles.length === 0 &&
					!error && <Text>Khong tim thay bai nao.</Text>}

				{!showCommands &&
					articles.length > 0 &&
					articles.map((a, i) => (
						<ArticleRow
							key={a.link || String(i)}
							article={a}
							index={i}
							width={columns}
						/>
					))}

				{!showCommands && loading && (
					<Text color="yellow" bold>
						Dang tim kiem...
					</Text>
				)}

				{!showCommands && error && (
					<Box flexDirection="column">
						<Text color="red">{error}</Text>
						<Text dimColor> Thu lai bang tu khoa khac.</Text>
					</Box>
				)}
			</Box>

			<Box flexShrink={0} marginLeft={1}>
				<Text bold>{'>'}</Text>
				<TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
			</Box>
		</Box>
	);
};

export default App;
