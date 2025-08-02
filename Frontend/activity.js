import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';

export default function ActivityChart({ tickets }) {
  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = startOfDay(subDays(new Date(), 6 - i));
      const dayTickets = tickets.filter(ticket => 
        startOfDay(new Date(ticket.created_date)).getTime() === date.getTime()
      );
      
      return {
        date: format(date, 'MMM d'),
        tickets: dayTickets.length,
        resolved: dayTickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
      };
    });
    
    return last7Days;
  };

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">7-Day Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748b"
                fontSize={12}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar 
                dataKey="tickets" 
                fill="url(#ticketsGradient)" 
                radius={[4, 4, 0, 0]}
                name="Created"
              />
              <Bar 
                dataKey="resolved" 
                fill="url(#resolvedGradient)" 
                radius={[4, 4, 0, 0]}
                name="Resolved"
              />
              <defs>
                <linearGradient id="ticketsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                </linearGradient>
                <linearGradient id="resolvedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0.3}/>
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}