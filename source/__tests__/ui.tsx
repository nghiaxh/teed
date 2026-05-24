import React from 'react';
import test from 'ava';
import {render} from 'ink-testing-library';
import App, {relativeTime, truncate} from '../app.js';

test('app renders without crashing', t => {
	const {lastFrame} = render(<App />);
	t.truthy(lastFrame());
	t.is(typeof lastFrame(), 'string');
});

test('app shows input prompt (> character)', t => {
	const {lastFrame} = render(<App />);
	const frame = lastFrame();
	t.true(typeof frame === 'string');
	t.regex(frame!, />/);
});

test('relativeTime returns empty for empty input', t => {
	t.is(relativeTime(''), '');
});

test('relativeTime returns formatted string for valid date', t => {
	const result = relativeTime(new Date().toISOString());
	t.truthy(result);
	t.is(typeof result, 'string');
});

test('truncate returns short string unchanged', t => {
	t.is(truncate('hello', 10), 'hello');
});

test('truncate adds ellipsis for long string', t => {
	const result = truncate('hello world this is long', 10);
	t.is(result.length, 10);
	t.true(result.endsWith('\u2026'));
});

test('truncate returns empty for empty input', t => {
	t.is(truncate('', 10), '');
	t.is(truncate('', 0), '');
});
