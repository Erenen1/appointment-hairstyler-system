"use client";

import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { Service } from "../types";

interface ServicesChartProps {
    filteredServices: Service[];
    chartData: {
        data: Record<string, unknown>;
        options: Record<string, unknown>;
    };
}

export const ServicesChart = ({ filteredServices, chartData }: ServicesChartProps) => {
    return (
        <Card title="Servis Dağılımı (Fiyat Bazlı)">
            <div className="flex gap-6 items-stretch">
                <div className="w-1/2">
                    <div style={{ height: 360 }} className="overflow-auto border rounded">
                        <ul className="text-sm divide-y">
                            {filteredServices.map((s) => (
                                <li key={s.id} className="flex items-center justify-between px-3 py-2">
                                    <span className="truncate mr-2">{s.title}</span>
                                    <span className="font-medium">{Number(s.price).toFixed(0)}₺</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="w-1/2">
                    <div style={{ height: 360 }} className="flex items-start justify-center">
                        <Chart type="doughnut" data={chartData.data} options={chartData.options} style={{ height: '320px', width: '320px' }} />
                    </div>
                </div>
            </div>
        </Card>
    );
};
