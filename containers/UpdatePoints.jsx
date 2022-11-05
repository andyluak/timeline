import React from "react";

import UpdatePoint from "containers/UpdatePoint";

function UpdatePoints({ updatePoints, handleUpdateSelection }) {
  const orderUpdatePointsByType = () => {
    const featurePoints = updatePoints.filter(
      (point) => point.type === "FEATURE"
    );
    const bugFixPoints = updatePoints.filter(
      (point) => point.type === "BUG_FIX"
    );
    const improvementPoints = updatePoints.filter(
      (point) => point.type === "IMPROVEMENT"
    );
    return {
      FEATURE: featurePoints,
      BUG_FIX: bugFixPoints,
      IMPROVEMENT: improvementPoints,
    };
  };
  const updatePointsByType = orderUpdatePointsByType();

  const hasFeatures = updatePointsByType.FEATURE.length > 0;
  const hasBugFixes = updatePointsByType.BUG_FIX.length > 0;
  const hasImprovements = updatePointsByType.IMPROVEMENT.length > 0;
  return (
    <div className="flex flex-col items-center gap-6 md:items-start">
      {hasFeatures && (
        <div className="flex w-1/2 flex-col gap-2 md:w-full">
          <h3 className="tracking-body text-2xl font-bold">Features</h3>
          <ul className="flex flex-col gap-1">
            {updatePointsByType.FEATURE.map((point, i) => (
              <UpdatePoint
                key={point.id}
                point={point}
                order={i}
                handleUpdateSelection={handleUpdateSelection}
              />
            ))}
          </ul>
        </div>
      )}
      {hasBugFixes && (
        <div className="flex w-1/2 flex-col gap-2 md:w-full">
          <h3 className="tracking-body text-2xl font-bold">Bug Fixes</h3>
          <ul className="flex flex-col gap-1">
            {updatePointsByType.BUG_FIX.map((point, i) => (
              <UpdatePoint
                key={point.id}
                point={point}
                order={i}
                handleUpdateSelection={handleUpdateSelection}
              />
            ))}
          </ul>
        </div>
      )}
      {hasImprovements && (
        <div className="flex w-1/2 flex-col gap-2 md:w-full">
          <h3 className="tracking-body text-2xl font-bold">Improvements</h3>
          <ul className="flex flex-col gap-1">
            {updatePointsByType.IMPROVEMENT.map((point, i) => (
              <UpdatePoint
                key={point.id}
                point={point}
                order={i}
                handleUpdateSelection={handleUpdateSelection}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UpdatePoints;
