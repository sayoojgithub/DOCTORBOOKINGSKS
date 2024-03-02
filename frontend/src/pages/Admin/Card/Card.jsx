import React from "react";

const Card = ({ data }) => {
  return (
    <div className="w-full md:w-1/2 p-4">
      <div className="bg-white p-4 shadow-md rounded-md text-center">
        <h2 className="text-lg font-bold mb-4">{data.title} :</h2>
        <p className="text-gray-700 font-bold text-2xl">{data.count}</p>
      </div>
    </div>
  );
};

export default Card;