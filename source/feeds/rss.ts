import Parser from 'rss-parser';
import {decode} from 'html-entities';

const parser = new Parser({timeout: 8000});

export interface Article {
	title: string;
	link: string;
	snippet: string;
	source: string;
	date: string;
}

export const DEFAULT_RSS_FEEDS: string[] = [
	// ==================== VNEXPRESS ====================
	'https://vnexpress.net/rss/tin-xem-nhieu.rss',
	'https://vnexpress.net/rss/tin-moi-nhat.rss',
	'https://vnexpress.net/rss/vne-go.rss',
	'https://vnexpress.net/rss/spotlight.rss',
	'https://vnexpress.net/rss/thoi-su.rss',
	'https://vnexpress.net/rss/the-gioi.rss',
	'https://vnexpress.net/rss/kinh-doanh.rss',
	'https://vnexpress.net/rss/khoa-hoc.rss',
	'https://vnexpress.net/rss/giai-tri.rss',
	'https://vnexpress.net/rss/the-thao.rss',
	'https://vnexpress.net/rss/phap-luat.rss',
	'https://vnexpress.net/rss/giao-duc.rss',
	'https://vnexpress.net/rss/suc-khoe.rss',
	'https://vnexpress.net/rss/du-lich.rss',
	'https://vnexpress.net/rss/so-hoa.rss',
	'https://vnexpress.net/rss/oto-xe-may.rss',

	// ==================== TUỔI TRẺ ====================
	'https://tuoitre.vn/rss/tin-moi-nhat.rss',
	'https://tuoitre.vn/rss/thoi-su.rss',
	'https://tuoitre.vn/rss/the-gioi.rss',
	'https://tuoitre.vn/rss/phap-luat.rss',
	'https://tuoitre.vn/rss/kinh-doanh.rss',
	'https://tuoitre.vn/rss/nhip-song-so.rss',
	'https://tuoitre.vn/rss/the-thao.rss',
	'https://tuoitre.vn/rss/giao-duc.rss',
	'https://tuoitre.vn/rss/suc-khoe.rss',
	'https://tuoitre.vn/rss/du-lich.rss',
	'https://tuoitre.vn/rss/van-hoa.rss',
	'https://tuoitre.vn/rss/giai-tri.rss',
	'https://tuoitre.vn/rss/khoa-hoc.rss',
	'https://tuoitre.vn/rss/xe.rss',

	// ==================== THANH NIÊN ====================
	'https://thanhnien.vn/rss/home.rss',
	'https://thanhnien.vn/rss/thoi-su.rss',
	'https://thanhnien.vn/rss/the-gioi.rss',
	'https://thanhnien.vn/rss/kinh-te.rss',
	'https://thanhnien.vn/rss/cong-nghe.rss',
	'https://thanhnien.vn/rss/the-thao.rss',
	'https://thanhnien.vn/rss/giao-duc.rss',
	'https://thanhnien.vn/rss/suc-khoe.rss',
	'https://thanhnien.vn/rss/du-lich.rss',
	'https://thanhnien.vn/rss/van-hoa.rss',
	'https://thanhnien.vn/rss/giai-tri.rss',
	'https://thanhnien.vn/rss/gioi-tre.rss',
	'https://thanhnien.vn/rss/xe.rss',

	// ==================== 24H ====================
	'https://www.24h.com.vn/upload/rss/tintuctrongngay.rss',
	'https://www.24h.com.vn/upload/rss/bongda.rss',
	'https://www.24h.com.vn/upload/rss/anninhhinhsu.rss',
	'https://www.24h.com.vn/upload/rss/thoitrang.rss',
	'https://www.24h.com.vn/upload/rss/taichinhbatdongsan.rss',
	'https://www.24h.com.vn/upload/rss/amthuc.rss',
	'https://www.24h.com.vn/upload/rss/phim.rss',
	'https://www.24h.com.vn/upload/rss/giaoducduhoc.rss',
	'https://www.24h.com.vn/upload/rss/bantrecuocsong.rss',
	'https://www.24h.com.vn/upload/rss/thethao.rss',
	'https://www.24h.com.vn/upload/rss/congnghethongtin.rss',
	'https://www.24h.com.vn/upload/rss/oto.rss',
	'https://www.24h.com.vn/upload/rss/thitruongtieudung.rss',
	'https://www.24h.com.vn/upload/rss/suckhoedoisong.rss',
	'https://www.24h.com.vn/upload/rss/cuoi24h.rss',

	// ==================== INFONET (VIETNAMNET) ====================
	'https://infonet.vietnamnet.vn/rss/doi-song.rss',
	'https://infonet.vietnamnet.vn/rss/thi-truong.rss',
	'https://infonet.vietnamnet.vn/rss/the-gioi.rss',
	'https://infonet.vietnamnet.vn/rss/gia-dinh.rss',
	'https://infonet.vietnamnet.vn/rss/gioi-tre.rss',
	'https://infonet.vietnamnet.vn/rss/khoe-dep.rss',
	'https://infonet.vietnamnet.vn/rss/chuyen-la.rss',
	'https://infonet.vietnamnet.vn/rss/quan-su.rss',
];

function removeVietnameseTones(str: string): string {
	return str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/đ/g, 'd')
		.replace(/Đ/g, 'D')
		.toLowerCase();
}

const STOP_WORDS = new Set([
	'hom',
	'nay',
	'mai',
	'cua',
	'va',
	'la',
	'thi',
	'co',
	'nhung',
	'cac',
	'mot',
	'hai',
	'ba',
	'bon',
	'nam',
	'sau',
	'bay',
	'tam',
	'chin',
	'muoi',
	'duoc',
	'cho',
	'voi',
	'ra',
	'len',
	'xuong',
	'di',
	'den',
	'o',
	'tai',
	'vi',
	'nho',
	'hon',
	'nhat',
	'rat',
	'se',
	'da',
	'dang',
	'khong',
	've',
	'tren',
	'duoi',
	'giua',
	'truoc',
	'sau',
	'nua',
	'cung',
	'chi',
	'con',
	'moi',
	'qua',
	'lai',
	'bi',
	'do',
	'ma',
	'nen',
	'hoac',
	'co',
	'the',
	'nhung',
	'co',
	'co',
	'de',
	'anh',
	'chi',
	'em',
	'toi',
	'ban',
	'nguoi',
	'tren',
	'duoi',
	'vao',
	'ra',
	'tu',
	'den',
	'voi',
	've',
	'cua',
]);

// Tách từ khoá thành các token có nghĩa (không dấu, không phải từ dừng, độ dài >= 2)
export function extractKeywords(keyword: string): string[] {
	const noTone = removeVietnameseTones(keyword.trim());
	return noTone
		.split(/\s+/)
		.filter(token => token.length >= 2 && !STOP_WORDS.has(token));
}

export async function fetchRSSFeeds(
	keyword: string,
	customFeeds?: string[],
): Promise<Article[]> {
	const feeds = customFeeds?.length ? customFeeds : DEFAULT_RSS_FEEDS;
	const results = await Promise.allSettled(
		feeds.map(url => fetchOneFeed(url, keyword)),
	);

	return results.flatMap(r => {
		if (r.status === 'rejected') {
			if (process.env['DEBUG'])
				console.error('[fetchRSSFeeds] Promise rejected:', r.reason);
			return [];
		}
		return r.value;
	});
}

// Tìm kiếm theo danh sách từ khoá (match ít nhất 1 từ)
export async function fetchRSSFeedsByWords(
	keywords: string[],
	customFeeds?: string[],
): Promise<Article[]> {
	const feeds = customFeeds?.length ? customFeeds : DEFAULT_RSS_FEEDS;
	const results = await Promise.allSettled(
		feeds.map(url => fetchOneFeedByWords(url, keywords)),
	);

	return results.flatMap(r => {
		if (r.status === 'rejected') {
			if (process.env['DEBUG'])
				console.error('[fetchRSSFeedsByWords] Promise rejected:', r.reason);
			return [];
		}
		return r.value;
	});
}

async function fetchOneFeed(url: string, kw: string): Promise<Article[]> {
	try {
		const feed = await parser.parseURL(url);
		const kwNoTone = removeVietnameseTones(kw.trim());

		const articles = (feed.items ?? [])
			.filter(item => {
				if (!kw.trim()) return true;
				const titleNoTone = removeVietnameseTones(item.title ?? '');
				const snippetNoTone = removeVietnameseTones(
					item.contentSnippet ?? item.summary ?? '',
				);
				return (
					titleNoTone.includes(kwNoTone) || snippetNoTone.includes(kwNoTone)
				);
			})
			.map(item => ({
				title: decode(item.title ?? '(Không có tiêu đề)'),
				link: item.link ?? '',
				snippet: decode(
					(item.contentSnippet ?? item.summary ?? '').slice(0, 250),
				),
				source: feed.title ?? new URL(url).hostname,
				date: item.pubDate ?? item.isoDate ?? '',
			}));

		if (process.env['DEBUG']) {
			console.error(`[DEBUG] ${url} -> ${articles.length} articles`);
		}
		return articles;
	} catch (e) {
		console.error(
			`Lỗi khi fetch feed ${url}:`,
			e instanceof Error ? e.message : e,
		);
		return [];
	}
}

async function fetchOneFeedByWords(
	url: string,
	keywords: string[],
): Promise<Article[]> {
	try {
		const feed = await parser.parseURL(url);
		const kwNoTones = keywords
			.map(k => removeVietnameseTones(k))
			.filter(Boolean);

		if (kwNoTones.length === 0) return [];

		const articles = (feed.items ?? [])
			.filter(item => {
				const titleNoTone = removeVietnameseTones(item.title ?? '');
				const snippetNoTone = removeVietnameseTones(
					item.contentSnippet ?? item.summary ?? '',
				);
				// Chỉ cần 1 từ khoá xuất hiện là đủ
				return kwNoTones.some(
					kw => titleNoTone.includes(kw) || snippetNoTone.includes(kw),
				);
			})
			.map(item => ({
				title: decode(item.title ?? '(Không có tiêu đề)'),
				link: item.link ?? '',
				snippet: decode(
					(item.contentSnippet ?? item.summary ?? '').slice(0, 250),
				),
				source: feed.title ?? new URL(url).hostname,
				date: item.pubDate ?? item.isoDate ?? '',
			}));

		if (process.env['DEBUG']) {
			console.error(`[DEBUG] ${url} -> ${articles.length} articles (by words)`);
		}
		return articles;
	} catch (e) {
		console.error(
			`Lỗi khi fetch feed ${url}:`,
			e instanceof Error ? e.message : e,
		);
		return [];
	}
}
