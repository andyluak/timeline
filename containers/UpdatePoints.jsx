import React from "react";
import UpdatePoint from "containers/UpdatePoint";

function UpdatePoints({ updatePoints }) {
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
    <div className="flex flex-col gap-6">
      {hasFeatures && (
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold tracking-body">Features</h3>
          <ul className="flex flex-col gap-1">
            {updatePointsByType.FEATURE.map((point,i) => (
              <UpdatePoint point={point} order={i} />
            ))}
          </ul>
        </div>
      )}
      {hasBugFixes && (
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold tracking-body">Bug Fixes</h3>
          <ul>
            {updatePointsByType.BUG_FIX.map((point, i) => (
              <li key={i}>{`${i + 1}.${point.description}`}</li>
            ))}
          </ul>
        </div>
      )}
      {hasImprovements && (
        <div className="flex flex-col gap-2">
          <h3 className="text-2xl font-bold tracking-body">Improvements</h3>
          <ul>
            {updatePointsByType.IMPROVEMENT.map((point,i) => (
              <li key={point.id}>{`${i + 1}.${point.description}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UpdatePoints;
