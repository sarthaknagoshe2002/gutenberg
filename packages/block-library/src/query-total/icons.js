/**
 * WordPress dependencies
 */
import { SVG, Path } from '@wordpress/components';

export const resultsFound = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		aria-hidden="true"
		focusable="false"
	>
		<Path d="M4 11h4v2H4v-2zm6 0h6v2h-6v-2zm8 0h2v2h-2v-2z" />
	</SVG>
);

export const displayingResults = (
	<SVG
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		width="24"
		height="24"
		aria-hidden="true"
		focusable="false"
	>
		<Path d="M4 13h2v-2H4v2zm4 0h10v-2H8v2zm12 0h2v-2h-2v2z" />
	</SVG>
);

export const queryTotal = <span>&#931;</span>;
