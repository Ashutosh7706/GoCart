"use client";

import {

    ResponsiveContainer,

    BarChart,

    Bar,

    CartesianGrid,

    XAxis,

    YAxis,

    Tooltip,

} from "recharts";

export default function OrdersChart({ data }) {

    return (

       <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 shadow-sm">

            <h2 className="text-xl font-semibold mb-5">

                Orders (Last 12 Months)

            </h2>
<div className="h-[300px] sm:h-[360px] lg:h-[450px] xl:h-[520px] 2xl:h-[620px] w-full">
            <ResponsiveContainer
                width="100%"
                height="100%"
            >
                
                <BarChart data={data}>

                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="month" />

                    <YAxis />

                    <Tooltip />

                    <Bar
                        dataKey="orders"
                        fill="#2563eb"
                    />

                </BarChart>

            </ResponsiveContainer>
</div>
        </div>

    );

}