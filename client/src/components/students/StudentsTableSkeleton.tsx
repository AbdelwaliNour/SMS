import { AnimatedSkeleton } from "@/components/ui/animated-skeleton";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentsTableSkeleton() {
  // Create an array of skeleton rows
  const skeletonRows = Array.from({ length: 5 }).map((_, index) => (
    <TableRow key={index}>
      <TableCell>
        <AnimatedSkeleton className="h-4 w-24" variant="statistic" />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <AnimatedSkeleton className="h-8 w-8 rounded-full" variant="statistic" />
          <AnimatedSkeleton className="h-4 w-28" variant="statistic" />
        </div>
      </TableCell>
      <TableCell>
        <AnimatedSkeleton className="h-4 w-24" variant="statistic" />
      </TableCell>
      <TableCell>
        <AnimatedSkeleton className="h-4 w-20" variant="statistic" />
      </TableCell>
      <TableCell>
        <AnimatedSkeleton className="h-4 w-28" variant="statistic" />
      </TableCell>
      <TableCell>
        <AnimatedSkeleton className="h-4 w-20" variant="statistic" />
      </TableCell>
      <TableCell>
        <AnimatedSkeleton className="h-4 w-20" variant="statistic" />
      </TableCell>
      <TableCell>
        <AnimatedSkeleton className="h-8 w-20" variant="statistic" />
      </TableCell>
    </TableRow>
  ));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>
            <AnimatedSkeleton className="h-6 w-32" variant="statistic" />
          </CardTitle>
          <AnimatedSkeleton className="h-9 w-28" variant="statistic" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <AnimatedSkeleton className="h-4 w-16" variant="statistic" />
                </TableHead>
                <TableHead>
                  <AnimatedSkeleton className="h-4 w-20" variant="statistic" />
                </TableHead>
                <TableHead>
                  <AnimatedSkeleton className="h-4 w-20" variant="statistic" />
                </TableHead>
                <TableHead>
                  <AnimatedSkeleton className="h-4 w-16" variant="statistic" />
                </TableHead>
                <TableHead>
                  <AnimatedSkeleton className="h-4 w-24" variant="statistic" />
                </TableHead>
                <TableHead>
                  <AnimatedSkeleton className="h-4 w-20" variant="statistic" />
                </TableHead>
                <TableHead>
                  <AnimatedSkeleton className="h-4 w-20" variant="statistic" />
                </TableHead>
                <TableHead>
                  <AnimatedSkeleton className="h-4 w-16" variant="statistic" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {skeletonRows}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <AnimatedSkeleton className="h-9 w-9 rounded" variant="statistic" />
          <AnimatedSkeleton className="h-9 w-9 rounded" variant="statistic" />
          <AnimatedSkeleton className="h-9 w-9 rounded" variant="statistic" />
          <AnimatedSkeleton className="h-9 w-9 rounded" variant="statistic" />
        </div>
      </CardContent>
    </Card>
  );
}