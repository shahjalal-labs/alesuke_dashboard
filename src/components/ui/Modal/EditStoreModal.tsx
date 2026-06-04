"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin } from "lucide-react";

interface EditStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeData?: {
    id: number;
    rank: number;
    storeName: string;
    retailer: string;
    storeNumber: string;
    address: string;
    driveTime: string;
    geofenceRadius?: string;
    color?: string;
  };
}

export function EditStoreModal({
  isOpen,
  onClose,
  storeData,
}: EditStoreModalProps) {
  const [formData, setFormData] = useState({
    storeName: storeData?.storeName || "",
    retailer: storeData?.retailer || "",
    storeNumber: storeData?.storeNumber || "",
    address: storeData?.address || "",
    geofenceRadius: storeData?.geofenceRadius || "",
    color: storeData?.color || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Store updated:", formData);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDelete = () => {
    console.log("Store deleted");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-900">
            Edit Store
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Store Name */}
            <div className="space-y-2">
              <Label
                htmlFor="storeName"
                className="text-sm font-medium text-gray-700"
              >
                Store Name
              </Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) =>
                  setFormData({ ...formData, storeName: e.target.value })
                }
                className="bg-gray-50 border-gray-200"
              />
            </div>

            {/* Retailer */}
            <div className="space-y-2">
              <Label
                htmlFor="retailer"
                className="text-sm font-medium text-gray-700"
              >
                Retailer
              </Label>
              <Select
                value={formData.retailer}
                onValueChange={(value) =>
                  setFormData({ ...formData, retailer: value })
                }
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select retailer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Field">Field</SelectItem>
                  <SelectItem value="Costco">Costco</SelectItem>
                  <SelectItem value="Target">Target</SelectItem>
                  <SelectItem value="Walmart">Walmart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Store Number */}
            <div className="space-y-2">
              <Label
                htmlFor="storeNumber"
                className="text-sm font-medium text-gray-700"
              >
                Store Number
              </Label>
              <Input
                id="storeNumber"
                value={formData.storeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, storeNumber: e.target.value })
                }
                className="bg-gray-50 border-gray-200"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Address
              </Label>
              <div className="relative">
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="bg-gray-50 border-gray-200 pl-10"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Geofence Radius */}
            <div className="space-y-2">
              <Label
                htmlFor="geofenceRadius"
                className="text-sm font-medium text-gray-700"
              >
                Geofence Radius
              </Label>
              <Input
                id="geofenceRadius"
                value={formData.geofenceRadius}
                onChange={(e) =>
                  setFormData({ ...formData, geofenceRadius: e.target.value })
                }
                className="bg-gray-50 border-gray-200"
              />
            </div>

            {/* Choose Color */}
            <div className="space-y-2">
              <Label
                htmlFor="color"
                className="text-sm font-medium text-gray-700"
              >
                Choose Color
              </Label>
              <Select
                value={formData.color}
                onValueChange={(value) =>
                  setFormData({ ...formData, color: value })
                }
              >
                <SelectTrigger className="bg-gray-50 border-gray-200">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Green">Green</SelectItem>
                  <SelectItem value="Blue">Blue</SelectItem>
                  <SelectItem value="Red">Red</SelectItem>
                  <SelectItem value="Yellow">Yellow</SelectItem>
                  <SelectItem value="Purple">Purple</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium"
              >
                Save
              </Button>
            </div>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-600 border-0"
            >
              Delete Store
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
