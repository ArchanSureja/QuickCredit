
import { cn } from "@/lib/utils";

type ApplicationStatus = "applied" | "review" | "rejected" | "disbursed";

interface StatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusMap: Record<ApplicationStatus, { label: string }> = {
  applied: { label: "Applied" },
  review: { label: "Under Review" },
  rejected: { label: "Rejected" },
  disbursed: { label: "Disbursed" }
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  return (
    <span 
      className={cn(
        "status-badge", 
        `status-badge-${status}`,
        className
      )}
    >
      {statusMap[status].label}
    </span>
  );
};

export default StatusBadge;
