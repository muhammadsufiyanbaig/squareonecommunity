"use client"

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"
import { getMonthlyDealCounts, getBrands } from "@/lib/index"

export function Overview() {
  const [data, setData] = useState<{ name: string, total: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const brands = await getBrands();
      if (brands) {
        const allDeals = brands.flatMap(brand => brand.deals);
        // console.log(allDeals.map(deal => deal.redeem));
        const monthlyDealCounts = getMonthlyDealCounts(allDeals);
        setData(monthlyDealCounts);
      }
    };
    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={true}
          axisLine={true}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#FF0000"
          strokeWidth={2}
          dot={{ r: 4 }}
          isAnimationActive={true}
          animationDuration={800}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
