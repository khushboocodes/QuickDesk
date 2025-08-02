
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowUp, 
  ArrowDown, 
  MessageSquare,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

const statusConfig = {
  open: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Open' },
  in_progress: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'In Progress' },
  resolved: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Resolved' },
  closed: { color: 'bg-slate-100 text-slate-800 border-slate-200', label: 'Closed' }
};

export default function TicketCard({ ticket, category }) {
  const commentCount = ticket.comments?.length || Math.floor(Math.random() * 20); // Placeholder

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-xl shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Votes */}
        <div className="flex sm:flex-col items-center gap-2 text-slate-600">
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <ArrowUp className="w-5 h-5 hover:text-emerald-500 cursor-pointer" />
          </motion.div>
          <span className="font-bold text-lg">{ticket.upvotes || 0}</span>
          <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
            <ArrowDown className="w-5 h-5 hover:text-red-500 cursor-pointer" />
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <Link to={createPageUrl(`TicketDetail?id=${ticket.id}`)}>
            <h2 className="text-xl font-bold text-slate-900 hover:text-emerald-700 transition-colors truncate">
              {ticket.title}
            </h2>
          </Link>
          <div className="flex items-center flex-wrap gap-2 mt-2">
            {category && (
              <Badge 
                style={{ 
                  backgroundColor: `${category.color}20`,
                  color: category.color,
                  borderColor: `${category.color}40`
                }}
                className="font-semibold"
              >
                {category.name}
              </Badge>
            )}
            <Badge variant="outline" className={statusConfig[ticket.status].color}>
              {statusConfig[ticket.status].label}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {ticket.reporter_email ? ticket.reporter_email[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <span>
                Posted by {ticket.reporter_email?.split('@')[0] || 'a user'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatDistanceToNow(new Date(ticket.created_date), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Comments Count */}
        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4 text-center w-full sm:w-24">
          <span className="text-2xl font-bold text-emerald-600">{commentCount}</span>
          <span className="text-sm text-slate-500">Replies</span>
          <MessageSquare className="w-5 h-5 text-slate-400 mt-1" />
        </div>
      </div>
    </div>
  );
}
