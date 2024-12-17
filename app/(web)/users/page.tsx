'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {  ChevronDown, ChevronUp } from 'lucide-react';

interface User {
  id: number;
  name: string;
  profileImage: string;
  whatsappNo: string;
  dateOfBirth: string;
  location: string;
  gender: 'Male' | 'Female' | 'Other';
}

const users: User[] = [
  { id: 1, name: 'Alice Johnson', profileImage: '/placeholder.svg?height=40&width=40', whatsappNo: '+1234567890', dateOfBirth: '1990-05-15', location: 'New York', gender: 'Female' },
  { id: 2, name: 'Bob Smith', profileImage: '/placeholder.svg?height=40&width=40', whatsappNo: '+0987654321', dateOfBirth: '1985-12-10', location: 'Los Angeles', gender: 'Male' },
  { id: 3, name: 'Charlie Brown', profileImage: '/placeholder.svg?height=40&width=40', whatsappNo: '+1122334455', dateOfBirth: '1992-08-22', location: 'Chicago', gender: 'Male' },
  { id: 4, name: 'Diana Ross', profileImage: '/placeholder.svg?height=40&width=40', whatsappNo: '+5544332211', dateOfBirth: '1988-03-30', location: 'Miami', gender: 'Female' },
  { id: 5, name: 'Ethan Hunt', profileImage: '/placeholder.svg?height=40&width=40', whatsappNo: '+6677889900', dateOfBirth: '1995-11-05', location: 'Seattle', gender: 'Male' },
];

export default function UserTable() {
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((user) => !locationFilter || locationFilter === 'all' || user.location === locationFilter)
      .filter((user) => !genderFilter || genderFilter === 'all' || user.gender === genderFilter)
      .sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.name.localeCompare(b.name);
        } else {
          return b.name.localeCompare(a.name);
        }
      });
  }, [searchTerm, locationFilter, genderFilter, sortOrder]);

  const locations = Array.from(new Set(users.map((user) => user.location)));
  const genders = Array.from(new Set(users.map((user) => user.gender)));

  return (
    <div className="space-y-4 px-2 pt-4">

      <div className="flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-[180px] px-2 py-1 border rounded-md"
        />
      <div className='flex gap-4'>
      <Select onValueChange={(value) => setLocationFilter(value || null)}>
          <SelectTrigger className="w-1/2 sm:w-[180px]">
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All locations</SelectItem>
            {locations.map((location) => (
              <SelectItem
                key={location}
                value={location}
                className={locationFilter === location ? '!bg-red-100 hover:!bg-red-200' : ''}
              >
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setGenderFilter(value || null)}>
          <SelectTrigger className="w-1/2 sm:w-[180px]">
            <SelectValue placeholder="Filter by gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All genders</SelectItem>
            {genders.map((gender) => (
              <SelectItem
                key={gender}
                value={gender}
                className={genderFilter === gender ? '!bg-red-100 hover:!bg-red-200' : ''}
              >
                {gender}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      </div>
      <Table>
        <TableHeader className="bg-red-100">
          <TableRow>
            <TableHead>Profile Image</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Name {sortOrder === 'asc' ? <ChevronUp className="inline" /> : <ChevronDown className="inline" />}
            </TableHead>
            <TableHead>WhatsApp No</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Gender</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            filteredAndSortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.profileImage} alt={user.name} />
                    <AvatarFallback>{user.name.split(' ').map((n) => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.whatsappNo}</TableCell>
                <TableCell>{user.dateOfBirth}</TableCell>
                <TableCell>{user.location}</TableCell>
                <TableCell>{user.gender}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
