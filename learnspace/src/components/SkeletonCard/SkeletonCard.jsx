import React from "react";
import { Skeleton } from "@heroui/react";

const SkeletonCard = ({ numberCards = 1 }) => {
  return (
    <>
      {Array.from({ length: numberCards }).map((_, index) => (
        <div
          key={index}
          className="shadow-panel w-full space-y-5 rounded-lg bg-white p-4"
        >
          <Skeleton className="rounded-lg">
            <div className="h-32 rounded-lg bg-default-300"></div>
          </Skeleton>
          <div className="space-y-3">
            <Skeleton className="w-3/5 rounded-lg">
              <div className="h-3 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-4/5 rounded-lg">
              <div className="h-3 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
            <Skeleton className="w-2/5 rounded-lg">
              <div className="h-3 w-full rounded-lg bg-default-200"></div>
            </Skeleton>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
