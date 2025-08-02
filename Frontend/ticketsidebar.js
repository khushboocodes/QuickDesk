import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  User as UserIcon, 
  Tag, 
  Shield,
  Briefcase
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { Ticket } from "@/entities/Ticket";

const priorityConfig = {
  low: { color: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Medium' },
  high: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'High' },
  urgent: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Urgent' }
};

export default function TicketSidebar({ ticket, user, category, onUpdate }) {
  const canManage = user?.role === 'admin' || user?.role === 'support_agent';

  const handleStatusChange = async (newStatus) => {
    if (!canManage) return;
    try {
      const updatedTicket = await Ticket.update(ticket.id, { status: newStatus });
      onUpdate(updatedTicket);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    if (!canManage) return;
    try {
      const updatedTicket = await Ticket.update(ticket.id, { priority: newPriority });
      onUpdate(updatedTicket);
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-700">Status</h4>
          {canManage ? (
            <Select value={ticket.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="outline" className={priorityConfig[ticket.priority].color + " w-full justify-center py-2 text-base"}>
              {ticket.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Badge>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-700">Priority</h4>
          {canManage ? (
            <Select value={ticket.priority} onValueChange={handlePriorityChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="outline" className={priorityConfig[ticket.priority].color + " w-full justify-center py-2 text-base"}>
              {priorityConfig[ticket.priority].label}
            </Badge>
          )}
        </div>

        {/* Reporter */}
        <div className="space-y-2">
          <h4 className="font-semibold text-slate-700">Reported by</h4>
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{ticket.reporter_email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{ticket.reporter_email.split('@')[0]}</p>
              <p className="text-xs text-slate-500">{ticket.reporter_email}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">Created:</span>
            <span className="font-medium">{format(new Date(ticket.created_date), 'MMM d, yyyy')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Last updated:</span>
            <span className="font-medium">{formatDistanceToNow(new Date(ticket.updated_date), { addSuffix: true })}</span>
          </div>
        </div>

        {/* Tags */}
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-700">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {ticket.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}