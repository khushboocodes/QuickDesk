import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function StatsCards({ title, value, icon: Icon, gradient, trend }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-r ${gradient} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
        <CardHeader className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                {title}
              </p>
              <div className="text-3xl font-bold text-slate-900">
                {value}
              </div>
            </div>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          </div>
          {trend && (
            <div className="pt-3">
              <p className="text-sm text-slate-600">{trend}</p>
            </div>
          )}
        </CardHeader>
      </Card>
    </motion.div>
  );
}