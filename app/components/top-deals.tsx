import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const deals = [
    {
      name: "Deal 1",
      discount: "20%",
      validity: "30 days",
    },
    {
      name: "Deal 2",
      discount: "15%",
      validity: "20 days",
    },
    {
      name: "Deal 3",
      discount: "10%",
      validity: "15 days",
    },
    {
      name: "Deal 4",
      discount: "25%",
      validity: "10 days",
    },
    {
      name: "Deal 5",
      discount: "30%",
      validity: "5 days",
    },
  ]
  
  export function TopDeals() {
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
          {deals.map((deal) => (
            <TableRow key={deal.name}>
              <TableCell className="font-medium">{deal.name}</TableCell>
              <TableCell>{deal.discount}</TableCell>
              <TableCell>{deal.validity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  }

