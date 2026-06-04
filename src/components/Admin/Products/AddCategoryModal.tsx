"use client";

import Modal from "@/components/ui/Modal";
import { Loader2 } from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (categoryName: string) => void;
  isLoading: boolean;
  isEditMode?: boolean;
  initialValue?: string;
  title?: string;
}

export default function AddCategoryModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  isEditMode = false,
  initialValue = "",
  title = "Add Category",
}: AddCategoryModalProps) {
  const [categoryName, setCategoryName] = useState(initialValue);

  useEffect(() => {
    if (isOpen) {
      setCategoryName(initialValue);
    }
  }, [isOpen, initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (categoryName.trim() && !isLoading) {
      onSubmit(categoryName.trim());
    }
  };

  const handleCancel = () => {
    setCategoryName("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="categoryName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Product Category
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Type here"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
            autoFocus
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-primary text-primary rounded-[40px] hover:bg-orange-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !categoryName.trim()}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-[40px] hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" size={18} />
                {isEditMode ? "Updating..." : "Submitting..."}
              </div>
            ) : (
              <span>{isEditMode ? "Update" : "Submit"}</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}