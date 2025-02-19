import "./ViewsFilter.css";
import ReactSlider from "react-slider";
import { formatViews } from "../../utils/FormatViews";
import { FaFilter } from "react-icons/fa";
import { useReactiveVar } from "@apollo/client";
import { minViewsVar, maxViewsVar, clearFiltersVar } from "../../apollo/cache";
import { useEffect } from "react";

interface ViewsFilterProps {
	onViewsChange: (minViews: number, maxViews: number) => void;
}

// Component in the sidebar to filter on an interval of views
export function ViewsFilter({ onViewsChange }: ViewsFilterProps) {
	const minViews = useReactiveVar(minViewsVar);
	const maxViews = useReactiveVar(maxViewsVar);
	const clearFilters = useReactiveVar(clearFiltersVar);

	useEffect(() => {
		const initialMinViews = Number(sessionStorage.getItem("minViews")) || 0;
		const initialMaxViews = Number(sessionStorage.getItem("maxViews")) || 1000000;

		minViewsVar(initialMinViews);
		maxViewsVar(initialMaxViews);

		onViewsChange(initialMinViews, initialMaxViews);
	}, [onViewsChange]);

	// Setting the views to default if "Clear filter" button is clicked
	useEffect(() => {
		if (clearFilters) {
			if (minViews !== 0 || maxViews !== 1000000) {
				minViewsVar(0);
				maxViewsVar(1000000);

				sessionStorage.setItem("minViews", "0");
				sessionStorage.setItem("maxViews", "1000000");

				onViewsChange(0, 1000000);
			}
			clearFiltersVar(false);
		}
	}, [clearFilters, minViews, maxViews, onViewsChange]);

	const handleSliderChange = (values: number[]) => {
		const [newMinViews, newMaxViews] = values;
		minViewsVar(newMinViews);
		maxViewsVar(newMaxViews);
	};

	const handleAfterSliderChange = (values: number[]) => {
		const [newMinViews, newMaxViews] = values;
		onViewsChange(newMinViews, newMaxViews);

		sessionStorage.setItem("minViews", String(newMinViews));
		sessionStorage.setItem("maxViews", String(newMaxViews));
	};

	return (
		<section className="filterContainer">
			<section className="filterHeader">
				<FaFilter className="filterSortIcon" aria-label="Filter icon" />
				<h2>Views</h2>
			</section>
			<div className="slider" tabIndex={-1}>
				{/* Using the react-slider component */}
				<ReactSlider
					className="horizontal-slider"
					thumbClassName="thumb"
					trackClassName="track"
					min={0}
					max={1000000}
					value={[minViews, maxViews]}
					onChange={handleSliderChange}
					onAfterChange={handleAfterSliderChange}
					ariaLabel={["Minimum views slider", "Maximum views slider"]}
					renderThumb={({ key, ...rest }) => (
						<div {...rest} key={key} tabIndex={-1} className="thumb" />
					)}
				/>
				<div className="viewValues">
					<span aria-label={`Views range: ${formatViews(minViews)} to ${formatViews(maxViews)}`}>
						{formatViews(minViews)} - {formatViews(maxViews)}
					</span>
				</div>
			</div>
		</section>
	);
}
