import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface ApplicationFiltersProps {
    searchTerm: string;
    statusFilter: string;
    onSearchChange: (value: string) => void;
    onStatusChange: (value: string) => void;
}

const ApplicationFilters: React.FC<ApplicationFiltersProps> = ({
    searchTerm,
    statusFilter,
    onSearchChange,
    onStatusChange
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search applications..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select
                    value={statusFilter}
                    onValueChange={onStatusChange}
                >
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="review">In Review</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="disbursed">Disbursed</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default ApplicationFilters;