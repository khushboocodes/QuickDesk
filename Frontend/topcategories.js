import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/entities/Category";
import { Progress } from "@/components/ui/progress";

export default function TopCategories({ tickets, isLoading }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoryData = await Category.list();
      setCategories(categoryData);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const getCategoryStats = () => {
    if (tickets.length === 0) return [];

    const categoryCount = {};
    tickets.forEach(ticket => {
      const categoryId = ticket.category_id || 'uncategorized';
      categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
    });

    const totalTickets = tickets.length;
    
    return Object.entries(categoryCount)
      .map(([categoryId, count]) => {
        const category = categories.find(c => c.id === categoryId);
        return {
          id: categoryId,
          name: category?.name || 'Uncategorized',
          count,
          percentage: Math.round((count / totalTickets) * 100),
          color: category?.color || '#64748b'
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900">Top Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-12 bg-slate-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const categoryStats = getCategoryStats();

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-slate-200/60 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-900">Top Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryStats.map((category, index) => (
            <div key={category.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="font-medium text-slate-900">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600">{category.count}</span>
                  <Badge variant="outline" className="text-xs">
                    {category.percentage}%
                  </Badge>
                </div>
              </div>
              <Progress 
                value={category.percentage} 
                className="h-2"
                style={{ 
                  '--progress-background': category.color 
                }}
              />
            </div>
          ))}
          {categoryStats.length === 0 && (
            <p className="text-center text-slate-500 py-4">
              No category data available
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
