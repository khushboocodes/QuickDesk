import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { User, MessageCircle } from 'lucide-react';

export default function CommentThread({ comments }) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-16 bg-white/80 rounded-xl shadow-lg border border-slate-200/60">
        <MessageCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-700">No replies yet</h3>
        <p className="text-slate-500">Be the first one to reply to this ticket.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {comments.map((comment, index) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={`
              ${comment.is_internal 
                ? 'bg-yellow-50 border-yellow-200' 
                : 'bg-white/80 backdrop-blur-sm border-slate-200/60'}
              shadow-lg
            `}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback>{comment.author_name ? comment.author_name[0] : 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900">
                        {comment.author_name || comment.author_email.split('@')[0]}
                      </div>
                      <div className="text-xs text-slate-500">
                        {formatDistanceToNow(new Date(comment.created_date), { addSuffix: true })}
                      </div>
                    </div>
                    {comment.is_internal && (
                      <div className="text-xs font-semibold text-yellow-800 bg-yellow-200 px-2 py-0.5 rounded-full inline-block my-2">
                        Internal Note
                      </div>
                    )}
                    <div className="prose prose-sm max-w-none mt-2 text-slate-800"
                      dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, '<br/>') }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}