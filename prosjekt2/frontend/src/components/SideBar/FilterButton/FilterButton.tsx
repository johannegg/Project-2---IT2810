import { FaFilter, FaSort } from "react-icons/fa";
import "./FilterButton.css";

type filterButtonProps = {
	onClick: () => void;
};
export function FilterButton({ onClick }: filterButtonProps) {
	return (
		<button className="filterButton" onClick={onClick} type="button">
			<FaFilter className="filterSortIcon" /> <span className="buttonText">Filter /</span>{" "}
			<FaSort className="filterSortIcon" /> <span className="buttonText">Sort</span>
		</button>
	);
}
