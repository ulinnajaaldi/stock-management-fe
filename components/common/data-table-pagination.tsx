import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  handleChangeLimit: (value: string) => void;
  handleToNextPage?: () => void;
  handleToPrevPage?: () => void;
}

const DataTablePagination: React.FC<DataTablePaginationProps> = (props) => {
  const { meta, handleChangeLimit, handleToNextPage, handleToPrevPage } = props;

  return (
    <div className="flex flex-col items-end justify-between px-2 md:flex-row md:items-center">
      <div className="flex flex-col items-center gap-x-6 gap-y-2 md:flex-row md:gap-y-0 lg:gap-x-8">
        <div className="flex items-center gap-2">
          <p className="shrink-0 text-sm font-medium">Rows per page</p>
          <Select value={`${meta.limit}`} onValueChange={handleChangeLimit}>
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={meta.limit} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {meta.page} of {meta.totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleToPrevPage}
            disabled={meta.hasPrev === false}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={handleToNextPage}
            disabled={meta.hasNext === false}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTablePagination;
