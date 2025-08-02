import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUpCircle, ArrowDownCircle, MessageSquare, Clock } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

const statusConfig = {
  open: { color: 'border-orange-200 text-orange-700 bg-orange-50', label: 'Open' },
  in_progress: { color: 'border-blue-200 text-blue-700 bg-blue-50', label: 'In Progress' },
  resolved: { color: 'border-green-200 text-green-700 bg-green-50', label: 'Resolved' },
  closed: { color: 'border-slate-200 text-slate-700 bg-slate-50', label: 'Closed' }
};

const priorityConfig = {
  low: { color: 'text-slate-500', icon: null },
  medium: { color: 'text-yellow-600', icon: Clock },
  high: { color: 'text-orange-600', icon: ArrowUpCircle },
  urgent: { color: 'text-red-600', icon: ArrowUpCircle }
};

export default function RecentTickets({ tickets, isLoading, userRole }) {
  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Recent Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
 