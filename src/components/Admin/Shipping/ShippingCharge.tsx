"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useGetShippingCostQuery,
  useUpdateShippingCostMutation,
} from "@/redux/api/admin/productApi";
import { useState } from "react";
import { toast } from "sonner";

interface ShippingItem {
  id: string;
  key: string;
  cost: number;
  createdAt: string;
  updatedAt: string;
}

interface ShippingResponse {
  success: boolean;
  message: string;
  result: ShippingItem[];
}

function ShippingCharge() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [costInput, setCostInput] = useState("");
  const [formError, setFormError] = useState("");

  const {
    data: getShippingCost,
    isLoading: isShippingLoading,
    isError: isShippingError,
  } = useGetShippingCostQuery({}) as {
    data?: ShippingResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const [addShippingCostFn, { isLoading: isSubmitting }] =
    useUpdateShippingCostMutation();

  const currentShippingCost = getShippingCost?.result?.[0]?.cost ?? 0;

  const openModal = () => {
    setCostInput(String(currentShippingCost));
    setFormError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsedCost = Number(costInput);

    if (!costInput || Number.isNaN(parsedCost) || parsedCost < 0) {
      setFormError("Please enter a valid shipping cost.");
      return;
    }

    try {
      await addShippingCostFn({ cost: parsedCost }).unwrap();
      closeModal();
      toast.success("Shipping cost updated successfully!");
    } catch {
      setFormError("Failed to update shipping cost. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Shipping Management
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              View and update the global shipping charge.
            </p>
          </div>

          <Button
            onClick={openModal}
            className="rounded-full px-5 text-white"
            size="lg"
          >
            Add Shipping Cost
          </Button>
        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-medium text-slate-600">
            Current Shipping Cost
          </p>
          {isShippingLoading ? (
            <p className="mt-2 text-lg font-semibold text-slate-500">
              Loading...
            </p>
          ) : isShippingError ? (
            <p className="mt-2 text-lg font-semibold text-red-600">
              Failed to load shipping cost
            </p>
          ) : (
            <p className="mt-2 text-3xl font-bold text-slate-900">
              ${currentShippingCost}
            </p>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backedrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-slate-900">
                Add Shipping Cost
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-500 hover:text-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shipping-cost">Shipping Cost</Label>
                <Input
                  id="shipping-cost"
                  type="number"
                  min="0"
                  step="0.01"
                  value={costInput}
                  onChange={(e) => {
                    setCostInput(e.target.value);
                    if (formError) setFormError("");
                  }}
                  placeholder="100"
                />
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="rounded-full text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShippingCharge;
