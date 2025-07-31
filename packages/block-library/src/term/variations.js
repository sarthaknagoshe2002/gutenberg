const variations = [
	{
		name: 'title-link-desc',
		title: 'Title, Description & Link',
		icon: 'editor-paragraph',
		template: [
			[
				'core/term-template',
				{},
				[ [ 'core/term-title' ], [ 'core/term-description' ] ],
			],
		],
	},
	{
		name: 'title-desc',
		title: 'Title & Description',
		icon: 'admin-links',
		template: [
			[
				'core/term-template',
				{},
				[ [ 'core/term-title' ], [ 'core/term-description' ] ],
			],
		],
	},
	{
		name: 'title-link',
		title: 'Title & Link',
		icon: 'edit',
		template: [ [ 'core/term-template', {}, [ [ 'core/term-title' ] ] ] ],
	},
	{
		name: 'image-title-link',
		title: 'Image, Title & Link',
		icon: 'format-image',
		template: [
			[
				'core/term-template',
				{},
				[ [ 'core/term-title' ], [ 'core/image' ] ],
			],
		],
	},
	{
		name: 'image-title-link-desc',
		title: 'Image, Title, Description & Link',
		icon: 'format-gallery',
		template: [
			[
				'core/term-template',
				{},
				[
					[ 'core/image' ],
					[ 'core/term-title' ],
					[ 'core/term-description' ],
				],
			],
		],
	},
];

export default variations;
