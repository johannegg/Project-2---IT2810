import { useEffect, useState } from "react";
import "./ViewsFilter.css";
import ReactSlider from "react-slider";
import { formatViews } from "../../utils/FormatViews";
import { FaFilter } from "react-icons/fa";

interface ViewsFilterProps {
	onViewsChange: (minViews: number, maxViews: number) => void;
}

export function ViewsFilter({ onViewsChange }: ViewsFilterProps) {
	const [minViews, setMinViews] = useState(0);
	const [maxViews, setMaxViews] = useState(3000000);

	useEffect(() => {
		const savedMinViews = JSON.parse(sessionStorage.getItem("minViews") || "0"); // 0 og 3000000 er hardkodet
		const savedMaxViews = JSON.parse(sessionStorage.getItem("maxViews") || "3000000");
		setMinViews(savedMinViews);
		setMaxViews(savedMaxViews);
	}, []);

	// Updating state while user is dragging the slider
	const handleSliderChange = (values: number[]) => {
		const [newMinViews, newMaxViews] = values;
		setMinViews(newMinViews);
		setMaxViews(newMaxViews);
	};

	// Called when user releases the slider
	const handleAfterSliderChange = (values: number[]) => {
		const [newMinViews, newMaxViews] = values;
		onViewsChange(newMinViews, newMaxViews);
		sessionStorage.setItem("minViews", JSON.stringify(newMinViews));
		sessionStorage.setItem("maxViews", JSON.stringify(newMaxViews));
	};

	return (
		<section className="filterContainer">
			<section className="filterHeader">
				<FaFilter className="filterSortIcon" />
				<h2>Views</h2>
			</section>
			<div className="slider">
				<ReactSlider
					className="horizontal-slider"
					thumbClassName="thumb"
					trackClassName="track"
					min={0}
					max={3000000}
					value={[minViews, maxViews]}
					onChange={handleSliderChange}
					onAfterChange={handleAfterSliderChange}
					renderThumb={(props) => <div {...props} />}
				/>
				<div className="viewValues">
					<span>{formatViews(minViews)} - {formatViews(maxViews)}</span>
				</div>
			</div>
		</section>
	);
}
