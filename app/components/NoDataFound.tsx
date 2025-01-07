import React from "react";
import { GrDocumentMissing } from "react-icons/gr";

const NoDataFound = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-4 text-gray-500 min-h-[60vh]">
        <div>
          <GrDocumentMissing className="h-24 w-24" />
        </div>
        <p>No data found</p>
      </div>
    </div>
  );
};

export default NoDataFound;
