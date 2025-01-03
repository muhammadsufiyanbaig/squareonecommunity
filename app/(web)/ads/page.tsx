"use client";

import axiosInstance from "@/app/axiosInstanse";
import React, { useEffect } from "react";
import { useAdStore } from "@/lib/base";

const page = () => {
  const { ads, setAds } = useAdStore();

  useEffect(() => {
    const fetchAds = async () => {
      const req = await axiosInstance.get("/ad/get");
      setAds(req.data.data);
    };
    fetchAds();
  }, [setAds]);

  return (
    <div className="p-4">
      {ads.map((ad) => (
        <div key={ad.id}>
          <img src={ad.banner} alt="Ad Banner" />
          <p>Brand ID: {ad.brandid}</p>
          <p>Created By: {ad.createdby}</p>
          <p>Deal ID: {ad.dealid}</p>
          <p>Start Date: {new Date(ad.startat).toLocaleDateString()}</p>
          <p>End Date: {new Date(ad.endat).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
};

export default page;