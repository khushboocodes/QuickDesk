import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Comment } from "@/entities/Comment";
import { Send } from "lucide-react";

export default function CommentForm({ ticketId, user, onCommentAdded }) {
  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const newComment = {
        ticket_id: ticketId,
        content: content,
        author_email: user.email,
        author_name: user.full_name || user.email.split('@')[0],
        is_internal: isInternal
      };

      const createdComment = await Comment.create(newComment);
      onCommentAdded(createdComment);
      setContent("");
      setIsInternal(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setIsSubmitting(false);
  };

  if (!user) return null;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Add a reply..."
            className="min-h-24"
          />
          <div className="flex justify-between items-center">
            {(user.role === 'admin' || user.role === 'support_agent') && (
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="internal-note" 
                  checked={isInternal}
                  onCheckedChange={setIsInternal}
                />
                <Label htmlFor="internal-note" className="text-sm font-medium text-slate-700">
                  Internal note (visible to agents only)
                </Label>
              </div>
            )}
            <div className="flex-grow" />
            <Button 
              type="submit" 
              disabled={isSubmitting || !content.trim()}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white"
            >
              {isSubmitting ? 'Replying...' : 'Reply'}
              <Send className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}