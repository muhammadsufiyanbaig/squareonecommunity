import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const brands = [
    {
      name: "Nike",
      sales: 2345,
      growth: "+12%",
    },
    {
      name: "Adidas",
      sales: 1879,
      growth: "+8%",
    },
    {
      name: "Puma",
      sales: 1456,
      growth: "+5%",
    },
    {
      name: "Reebok",
      sales: 1245,
      growth: "+3%",
    },
    {
      name: "Under Armour",
      sales: 1100,
      growth: "+2%",
    },
  ]
  
  export function TopBrands() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Brand</TableHead>
            <TableHead>Sales</TableHead>
            <TableHead>Growth</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brands.map((brand) => (
            <TableRow key={brand.name}>
              <TableCell className="font-medium">{brand.name}</TableCell>
              <TableCell>{brand.sales}</TableCell>
              <TableCell>{brand.growth}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }
  
  