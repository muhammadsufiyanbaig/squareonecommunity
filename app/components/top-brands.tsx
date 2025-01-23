import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBrandStore } from "@/lib/base";
import { getTopBrands } from "@/lib/index";

export function TopBrands() {
  const brands = useBrandStore((state) => state.brands);
  const topBrands = getTopBrands(brands);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Brand</TableHead>
          <TableHead>Deals</TableHead>
          <TableHead>Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {topBrands.map((brand) => (
          <TableRow key={brand.brandid}>
            <TableCell className="font-medium">{brand.brandname}</TableCell>
            <TableCell>{brand.deals.length}</TableCell>
            <TableCell>{brand.category}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

