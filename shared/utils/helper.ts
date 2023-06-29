export const makeSlug = (title: string) => {
	// clear space
	let slug = title.toLowerCase().trim();

	// Remove all special characters
	slug = slug.replace(/[^\w\s]/g, '');

	// Remove space to dash(-)
	slug = slug.replace(/\s+/g, '-');

	// Attach time
	slug = slug.concat('-', new Date().getTime().toString());
	return slug;
};
