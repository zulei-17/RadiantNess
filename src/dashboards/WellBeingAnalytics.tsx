import React from "react";
import { motion } from "motion/react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, Cell
} from "recharts";
import { 
  TrendingUp, TrendingDown, Users, Heart, Shield, 
  AlertCircle, Info, Activity, Smile, Frown, Meh 
} from "lucide-react";
import { cn } from "../lib/utils";

const moodData = [
  { name: "Mon", mood: 75, stress: 20 },
  { name: "Tue", mood: 68, stress: 25 },
  { name: "Wed", mood: 82, stress: 15 },
  { name: "Thu", mood: 60, stress: 40 },
  { name: "Fri", mood: 70, stress: 30 },
  { name: "Sat", mood: 85, stress: 10 },
  { name: "Sun", mood: 90, stress: 5 },
];

const categoryData = [
  { name: "Stress", value: 35, color: "#F27D26" },
  { name: "Confidence", value: 65, color: "#FF6321" },
  { name: "Social", value: 80, color: "#F27D26" },
];

const activityData = [
  { name: "8am", users: 12 },
  { name: "10am", users: 45 },
  { name: "12pm", users: 30 },
  { name: "2pm", users: 55 },
  { name: "4pm", users: 80 },
  { name: "6pm", users: 40 },
  { name: "8pm", users: 25 },
];

export default function WellBeingAnalytics() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Insight Card */}
      <section className="bg-orange-50 border border-orange-100 rounded-[32px] p-6 flex gap-4 items-start shadow-sm">
        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
          <AlertCircle size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="font-serif text-lg text-orange-900">Weekly Insight</h3>
          <p className="text-sm text-orange-800/70 leading-relaxed">
            Student stress levels increased by <span className="font-bold">12%</span> this Thursday. 
            Consider scheduling a group check-in or a mindfulness session tomorrow morning.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-200/50 px-2 py-1 rounded-full text-orange-700">
              Action Recommended
            </span>
          </div>
        </div>
      </section>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smile size={20} />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
              <TrendingUp size={12} />
              +5%
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif text-radiant-ink">74%</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Avg. Mood Score</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Frown size={20} />
            </div>
            <div className="flex items-center gap-1 text-orange-500 text-[10px] font-bold">
              <TrendingUp size={12} />
              +12%
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif text-radiant-ink">35%</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Stressed Students</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Activity size={20} />
            </div>
            <div className="flex items-center gap-1 text-green-500 text-[10px] font-bold">
              <TrendingUp size={12} />
              +18%
            </div>
          </div>
          <div>
            <span className="text-3xl font-serif text-radiant-ink">142</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Active Users Today</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend */}
        <section className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-serif">Mood & Stress Trends</h3>
            <select className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-transparent border-none focus:ring-0 cursor-pointer">
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodData}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F27D26" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#F27D26" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontSize: '12px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="mood" 
                  stroke="#F27D26" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorMood)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="stress" 
                  stroke="#9ca3af" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 pt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-radiant-pink" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Mood</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-300" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Stress</span>
            </div>
          </div>
        </section>

        {/* Category Breakdown */}
        <section className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-6">
          <h3 className="text-xl font-serif">Well-being Breakdown</h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#1f2937', fontWeight: 500 }}
                  width={100}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={32}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-gray-400 italic text-center">
            Confidence and Social well-being are trending upwards this month.
          </p>
        </section>
      </div>

      {/* Activity Levels */}
      <section className="bg-white p-8 rounded-[32px] border border-black/5 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-serif">App Activity Levels</h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Live Activity</span>
          </div>
        </div>
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: '#f9fafb' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="users" fill="#F27D26" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
