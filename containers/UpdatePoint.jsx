import React from "react";

function UpdatePoint({ point, order }) {
  return <li>{`${order + 1}.${point.description}`}</li>;
}

export default UpdatePoint;
