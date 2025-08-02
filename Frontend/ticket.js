
import React, { useState, useEffect, useMemo } from "react";
import { Ticket } from "@/entities/Ticket";
import { Category } from "@/entities/Category";
import { User } from "@/entities/User";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { 
  Search, 
  Plus, 
  ArrowUpDown, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  PackageOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";

import TicketCard from "../components/tickets/TicketCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    ownOnly: true,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("-created_date");
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;

  useEffect(() => {
    loadInitialData();
  }, []);
  
  useEffect(() => {
    loadTickets();
  }, [filters, sortBy]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [userData, categoryData, ticketData] = await Promise.all([
        User.me(),
        Category.list(),
        Ticket.list(sortBy)
      ]);
      setUser(userData);
      setCategories(categoryData);
      setTickets(ticketData);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
    setIsLoading(false);
  };
  
  const loadTickets = async () => {
    // This is a client-side filter demonstration.
    // For production, filtering should be done server-side via Ticket.filter()
  };

  const filteredAndSortedTickets = useMemo(() => {
    return tickets
      .filter(ticket => {
        const statusMatch = filters.status === 'all' || ticket.status === filters.status;
        const categoryMatch = filters.category === 'all' || ticket.category_id === filters.category;
        const ownOnlyMatch = !filters.ownOnly || ticket.reporter_email === user?.email;
        const searchMatch = searchTerm === "" || 
                            ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
        return statusMatch && categoryMatch && ownOnlyMatch && searchMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'upvotes') return b.upvotes - a.upvotes;
        if (sortBy === 'comments') return (b.comments?.length || 0) - (a.comments?.length || 0); // Assuming comments are loaded with tickets
        if (sortBy === '-created_date') return new Date(b.created_date) - new Date(a.created_date);
        return 0;
      });
  }, [tickets, filters, searchTerm, sortBy, user]);

  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * ticketsPerPage;
    return filteredAndSortedTickets.slice(startIndex, startIndex + ticketsPerPage);
  }, [filteredAndSortedTickets, currentPage, ticketsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedTickets.length / ticketsPerPage);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setCurrentPage(1);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.5 }}
      className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            My Tickets
          </h1>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search tickets..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link to={createPageUrl("CreateTicket")}>
              <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="w-4 h-4 mr-2" />
                Ask Question
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters and Sorting */}
        <Card className="p-4 mb-6 bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            <Filter className="w-5 h-5 text-slate-500" />
            <h3 className="font-semibold text-slate-700">Filters:</h3>
            
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-grow" />

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5 text-slate-500" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-created_date">Most Recent</SelectItem>
                  <SelectItem value="upvotes">Most Upvoted</SelectItem>
                  <SelectItem value="comments">Most Replied</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Ticket List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-xl" />
            ))
          ) : paginatedTickets.length > 0 ? (
            paginatedTickets.map((ticket, index) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <TicketCard 
                  ticket={ticket} 
                  category={categories.find(c => c.id === ticket.category_id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-20 bg-white/80 rounded-xl shadow-lg border border-slate-200/60">
              <PackageOpen className="w-16 h-16 mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-semibold text-slate-700">No tickets found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or create a new ticket.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 space-x-4">
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-slate-600 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
