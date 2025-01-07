import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, Users, BookOpen, Clock } from 'lucide-react';
import AddBook from "../pages/AddBook"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    uniqueBooks: 0,
    activeLoans: 0,
    overdueBorrows: 0
  });
  const [borrowings, setBorrowings] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [statsRes, borrowingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/books/stats', { headers }),
          axios.get('http://localhost:5000/api/books/borrowings', { headers })
        ]);

        setStats(statsRes.data);
        setBorrowings(borrowingsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <>
        <div className="container mx-auto px-4 py-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Titles</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueBooks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeLoans}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <Clock className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.overdueBorrows}</div>
          </CardContent>
        </Card>
      </div>

      {/* Borrowings Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Current Borrowings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Book Title</TableHead>
                <TableHead>Borrowed By</TableHead>
                <TableHead>Borrow Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {borrowings.map((borrow) => (
                <TableRow key={borrow._id}>
                  <TableCell>{borrow.book.title}</TableCell>
                  <TableCell>{borrow.user.name}</TableCell>
                  <TableCell>{new Date(borrow.borrowDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(borrow.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      new Date(borrow.dueDate) < new Date() 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {new Date(borrow.dueDate) < new Date() ? 'Overdue' : 'Active'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
    <AddBook/>
    </>
  );
};

export default Dashboard;