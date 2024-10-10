export const formatViews = (views: number): string => {
	return new Intl.NumberFormat("en", { notation: "compact", compactDisplay: "short" }).format(
		views,
	);
};
