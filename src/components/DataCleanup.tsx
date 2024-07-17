import React from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import AddDropdowns from "./AddDropdowns";

const DataCleanup = () => {
  const { setStep, selectedColumns, filters } = useAppContext();
  return (
    <div>
      <h2>Veri Ayıklaması</h2>
      {selectedColumns?.[0]?.column && selectedColumns?.[1]?.column && (
        <AddDropdowns
          input={selectedColumns?.[0]?.column}
          value={selectedColumns?.[1]?.column}
        />
      )}
      <div className="flex justify-end">
        <Button
          className="max-w-32"
          disabled={filters.length < 1}
          onClick={() => setStep(4)}
        >
          İlerle
        </Button>
      </div>
    </div>
  );
};

export default DataCleanup;
