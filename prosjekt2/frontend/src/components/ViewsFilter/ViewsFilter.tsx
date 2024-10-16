import { useState } from "react";
import "./ViewsFilter.css";
import ReactSlider from "react-slider";
import { formatViews } from "../../utils/FormatViews";

function ViewsFilter() {
    const [minViews, setMinViews] = useState(0);
    const [maxViews, setMaxViews] = useState(10000000);

    return (
        <section className="filterContainer">
            <h2>Views</h2>
            <div className="slider">
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="thumb"
                    trackClassName="track"
                    min={0}
                    max={10000000}
                    value={[minViews, maxViews]}
                    onChange={(values) => {
                        setMinViews(values[0]);
                        setMaxViews(values[1]);
                    }}
                    renderThumb={(props) => (
                        <div {...props} />
                    )}
                />
                <div className="viewValues">
                    <span>Min: {formatViews(minViews)}</span>
                    <span>Max: {formatViews(maxViews)}</span>
                </div>
            </div>
        </section>
    )
};

export default ViewsFilter;