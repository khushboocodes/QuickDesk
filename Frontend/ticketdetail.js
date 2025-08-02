
import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Ticket } from "@/entities/Ticket";
import { Comment } from "@/entities/Comment";
import { Category } from "@/entities/Category";
import { User } from "@/entities/User";
import { createPageUrl } from "@/utils";

import { 
  ArrowLeft,
  Share2,
  Paperclip,
  CheckCircle,
  AlertCircle,
  Clock,
  User as UserIcon,
  Tag
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

import TicketHeader from "../components/ticket_detail/TicketHeader";
import CommentThread from "../components/ticket_detail/CommentThread";
import CommentForm from "../components/ticket_detail/CommentForm";
import TicketSidebar from "../components/ticket_detail/TicketSidebar";

export default function TicketDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [category, setCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getTicketId = () => {
    const params = new URLSearchParams(location.search);
    return params.get('id');
  };

  useEffect(() => {
    const ticketId = getTicketId();
    if (ticketId) {
      loadData(ticketId);
    }
  }, [location.search]);

  const loadData = async (ticketId) => {
    setIsLoading(true);
    try {
      const [ticketData, commentsData, userData, allCategories] = await Promise.all([
        Ticket.get(ticketId),
        Comment.filter({ ticket_id: ticketId }, '-created_date'),
        User.me(),
        Category.list()
      ]);

      setTicket(ticketData);
      setComments(commentsData);
      setUser(userData);
      
      const categoryData = allCategories.find(c => c.id === ticketData.category_id);
      setCategory(categoryData);
    } catch (error) {
      console.error("Error loading ticket details:", error);
    }
    setIsLoading(false);
  };
  
  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };
  
  const handleTicketUpdate = (updatedTicket) => {
    setTicket(updatedTicket);
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // You can add a toast notification here
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
        <p className="text-slate-600 mb-4">The ticket you are looking for does not exist.</p>
        <Button onClick={() => navigate(createPageUrl("Tickets"))}>Go to My Tickets</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tickets
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={copyShareLink}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <TicketHeader 
              ticket={ticket} 
              category={category} 
              user={user}
              onUpdate={handleTicketUpdate}
            />
            
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
              <CardContent className="p-6">
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: ticket.description.replace(/\n/g, '<br/>') }} />
                
                {ticket.attachment_urls && ticket.attachment_urls.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h4 className="font-semibold mb-2">Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {ticket.attachment_urls.map((url, index) => (
                        <a key={index} href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline flex items-center gap-1">
                          <Paperclip className="w-3 h-3" />
                          Attachment {index + 1}
                        </a>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <CommentThread comments={comments} />
            <CommentForm 
              ticketId={ticket.id} 
              user={user} 
              onCommentAdded={handleCommentAdded}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <TicketSidebar 
              ticket={ticket} 
              user={user} 
              category={category}
              onUpdate={handleTicketUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
