export const getMetaTags = (
	title: string,
	description: string,
	url: string,
	imageURL: string = 'https://ink0.inkverse.co/general/inkverse-brandmark-white.png'
) => {
	return [
		{ title },
		{ name: "description", content: description },

		{ name: 'twitter:card', content: 'summary_large_image' },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		{ name: 'twitter:image', content: imageURL },
		{ name: 'twitter:image:src', content: imageURL },

		{ property: 'og:title', content: title },
		{ property: 'og:type', content: 'website' },
		{ property: 'og:url', content: url },
		{ property: 'og:image', content: imageURL },
		{ property: 'og:description', content: description },
		{ property: 'og:site_name', content: 'Inkverse Webtoons & Webcomics' },
	];
};
