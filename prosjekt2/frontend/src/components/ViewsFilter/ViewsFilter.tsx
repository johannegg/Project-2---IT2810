import "./ViewsFilter.css";
import ReactSlider from "react-slider";
import { formatViews } from "../../utils/FormatViews";
import { FaFilter } from "react-icons/fa";
import { useReactiveVar } from "@apollo/client";
import { minViewsVar, maxViewsVar } from "../../apollo/cache";
import { useEffect } from "react";

interface ViewsFilterProps {
  clearFilters: boolean;
  onViewsChange: (minViews: number, maxViews: number) => void;
}

export function ViewsFilter({ onViewsChange, clearFilters }: ViewsFilterProps) {
  const minViews = useReactiveVar(minViewsVar);
  const maxViews = useReactiveVar(maxViewsVar);

  useEffect(() => {
    const initialMinViews = Number(sessionStorage.getItem("minViews")) || 0;
    const initialMaxViews = Number(sessionStorage.getItem("maxViews")) || 3000000;
    
    minViewsVar(initialMinViews);
    maxViewsVar(initialMaxViews);
    
    onViewsChange(initialMinViews, initialMaxViews);
  }, [onViewsChange]);

  useEffect(() => {
    if (clearFilters) {
      minViewsVar(0);
      maxViewsVar(3000000);
      onViewsChange(0, 3000000);
    }
  }, [clearFilters, onViewsChange]);

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
          renderThumb={({ key, ...rest }) => <div {...rest} key={key} />}
        />
        <div className="viewValues">
          <span>
            {formatViews(minViews)} - {formatViews(maxViews)}
          </span>
        </div>
      </div>
    </section>
  );
}
