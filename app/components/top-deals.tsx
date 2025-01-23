import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBrandStore } from "@/lib/base";
import { getTopDeals } from "@/lib/index";

export function TopDeals() {
  const brands = useBrandStore((state) => state.brands);
  const topDeals = getTopDeals(brands);

  const calculateDaysLeft = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Deal</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Validity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topDeals.map((deal) => {
          const daysLeft = calculateDaysLeft(deal.endDate);
          return (
            <TableRow key={deal.dealid}>
              <TableCell className="font-medium">{deal.title}</TableCell>
              <TableCell>{deal.tagline}</TableCell>
              <TableCell>{daysLeft > 0 ? `${daysLeft} days left` : "Expired"}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

