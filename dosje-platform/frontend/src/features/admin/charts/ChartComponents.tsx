"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import {
  SCHEME_DISTRIBUTION_DATA,
  STATE_WISE_PROJECTS_DATA,
  BENEFICIARY_GROWTH_DATA,
  COMPLAINT_TRENDS_DATA,
  INSPECTION_COMPLETION_DATA,
  COMPLIANCE_STATUS_DATA,
  RISK_DISTRIBUTION_DATA,
  FUND_UTILIZATION_DATA,
  ATTENDANCE_TREND_DATA,
} from "@/mock/adminMockData";

const customTooltipStyle = {
  backgroundColor: "rgba(15, 23, 42, 0.95)",
  border: "1px solid rgba(51, 65, 85, 0.6)",
  borderRadius: "8px",
  color: "#F8FAFC",
  fontSize: "12px",
  padding: "8px 12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
};

export const SchemeDistributionChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={SCHEME_DISTRIBUTION_DATA}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={95}
            paddingAngle={3}
            dataKey="value"
          >
            {SCHEME_DISTRIBUTION_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip contentStyle={customTooltipStyle} formatter={(val) => [`${val} Projects`, "Count"]} />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const StateWiseProjectsChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={STATE_WISE_PROJECTS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
          <XAxis dataKey="state" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Bar dataKey="projects" name="Total Projects" fill="#0F4C81" radius={[4, 4, 0, 0]} />
          <Bar dataKey="inspected" name="Inspected" fill="#0D9488" radius={[4, 4, 0, 0]} />
          <Bar dataKey="highRisk" name="High Risk" fill="#DC2626" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BeneficiaryGrowthChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={BENEFICIARY_GROWTH_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorBen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0F4C81" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0F4C81" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorVer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#0D9488" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis
            tick={{ fontSize: 11 }}
            tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={customTooltipStyle}
            formatter={(val) => [(Number(val)).toLocaleString("en-IN"), "Beneficiaries"]}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Area
            type="monotone"
            dataKey="beneficiaries"
            name="Enrolled Citizens"
            stroke="#0F4C81"
            fillOpacity={1}
            fill="url(#colorBen)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="verified"
            name="Aadhaar e-KYC Verified"
            stroke="#0D9488"
            fillOpacity={1}
            fill="url(#colorVer)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ComplaintTrendsChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={COMPLAINT_TRENDS_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Area
            type="monotone"
            dataKey="received"
            name="Grievances Received"
            stroke="#EA580C"
            fill="#EA580C"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="resolved"
            name="Redressed / Closed"
            stroke="#10B981"
            fill="#10B981"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const InspectionCompletionChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={INSPECTION_COMPLETION_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
          <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={customTooltipStyle} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Bar dataKey="target" name="Inspection Target" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" name="Field Audits Done" fill="#0F4C81" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ComplianceStatusChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={COMPLIANCE_STATUS_DATA}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
          >
            {COMPLIANCE_STATUS_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip contentStyle={customTooltipStyle} formatter={(val) => [`${val} Projects`, "Count"]} />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const RiskDistributionChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={RISK_DISTRIBUTION_DATA}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label={({ name, percent }: { name?: string; percent?: number }) =>
              `${name || ""} (${((percent || 0) * 100).toFixed(0)}%)`
            }
          >
            {RISK_DISTRIBUTION_DATA.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip contentStyle={customTooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const FundUtilizationChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={FUND_UTILIZATION_DATA} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
          <XAxis dataKey="scheme" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val}Cr`} />
          <Tooltip
            contentStyle={customTooltipStyle}
            formatter={(val) => [`₹${val} Crores`, "Amount"]}
          />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Bar dataKey="sanctioned" name="Sanctioned Budget" fill="#94A3B8" radius={[4, 4, 0, 0]} />
          <Bar dataKey="released" name="Released via PFMS" fill="#0D9488" radius={[4, 4, 0, 0]} />
          <Bar dataKey="utilized" name="UC Utilized" fill="#0F4C81" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AttendanceTrendChart: React.FC = () => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={ATTENDANCE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#94A3B8" opacity={0.2} />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} domain={[80, 100]} />
          <Tooltip contentStyle={customTooltipStyle} formatter={(val) => [`${val}%`, "Rate"]} />
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Line
            type="monotone"
            dataKey="attendance"
            name="Daily Biometric Attendance %"
            stroke="#10B981"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
