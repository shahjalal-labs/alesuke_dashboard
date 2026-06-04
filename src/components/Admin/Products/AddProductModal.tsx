/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  useAddProductMutation,
  useGetAllProductCategoriesQuery,
} from "@/redux/api/admin/productApi";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

interface Specification {
  key: string;
  value: string;
}

interface SpecificationGroup {
  groupName: string;
  specifications: Specification[];
}

interface ImageUpload {
  file?: File;
  preview: string;
  uploading: boolean;
}

interface ProductVariant {
  color: string;
  quantity: number;
  size?: string;
}

interface ProductFormData {
  productCategory: string;
  productName: string;
  images: ImageUpload[];
  price: number;
  productQuantity: number;
  variants: ProductVariant[];
  specificationGroups: SpecificationGroup[];
  brand: string;
  availability: string;
  shortDescription: string;
  longDescription: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
}: AddProductModalProps) {
  const [activeTab, setActiveTab] = useState("specifications");

  const { data: allProductCategoryData, isLoading: isCategoryLoading } =
    useGetAllProductCategoriesQuery({});

  const categories = allProductCategoryData?.result || [];

  const { register, control, handleSubmit, watch, setValue, reset } =
    useForm<ProductFormData>({
      defaultValues: {
        productCategory: "",
        productName: "",
        images: [],
        price: 0,
        productQuantity: 0,
        variants: [],
        brand: "FreemanZ",
        availability: "InStock",
        // shortDescription: "",
        longDescription: "",
        specificationGroups: [
          {
            groupName: "technicalSpecification",
            specifications: [{ key: "", value: "" }],
          },
          {
            groupName: "physicalSpecification",
            specifications: [{ key: "", value: "" }],
          },
          {
            groupName: "warrantyInformation",
            specifications: [{ key: "", value: "" }],
          },
        ],
      },
    });

  const [addProductFn, { isLoading }] = useAddProductMutation();

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImageField,
  } = useFieldArray({ control, name: "images" });

  const {
    fields: variantFields,
    append: appendVariant,
    remove: removeVariant,
  } = useFieldArray({ control, name: "variants" });

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;
    const currentImages = watch("images");
    const updatedImages = [...currentImages];
    updatedImages[index] = { ...updatedImages[index], uploading: true };
    setValue("images", updatedImages);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const previewUrl = URL.createObjectURL(file);
    updatedImages[index] = { file, preview: previewUrl, uploading: false };
    setValue("images", updatedImages);
  };

  const removeImage = (index: number) => {
    if (imageFields.length > 1) {
      removeImageField(index);
    } else {
      const currentImages = watch("images");
      const updatedImages = [...currentImages];
      updatedImages[index] = { preview: "", uploading: false };
      setValue("images", updatedImages);
    }
  };

  const addImageSlot = () => {
    appendImage({ preview: "", uploading: false });
  };

  const addSpecificationToGroup = (groupIndex: number) => {
    const currentGroups = watch("specificationGroups");
    const updatedGroups = [...currentGroups];
    updatedGroups[groupIndex].specifications.push({ key: "", value: "" });
    setValue("specificationGroups", updatedGroups);
  };

  const removeSpecificationFromGroup = (
    groupIndex: number,
    specIndex: number,
  ) => {
    const currentGroups = watch("specificationGroups");
    const updatedGroups = [...currentGroups];
    if (updatedGroups[groupIndex].specifications.length > 1) {
      updatedGroups[groupIndex].specifications.splice(specIndex, 1);
      setValue("specificationGroups", updatedGroups);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData = new FormData();

      // Convert specification groups to the desired format
      const specificationsPayload: Record<string, Record<string, string>> = {};

      data.specificationGroups.forEach((group) => {
        if (group.groupName) {
          const groupSpecs: Record<string, string> = {};

          group.specifications.forEach((spec) => {
            if (spec.key && spec.value) {
              groupSpecs[spec.key] = spec.value;
            }
          });

          if (Object.keys(groupSpecs).length > 0) {
            specificationsPayload[group.groupName] = groupSpecs;
          }
        }
      });

      // Basic product fields as JSON with specifications included
      const variantsPayload = data.variants
        .filter((variant) => variant.color?.trim())
        .map((variant) => {
          const payloadVariant: ProductVariant = {
            color: variant.color.trim(),
            quantity: Number.isFinite(Number(variant.quantity))
              ? Number(variant.quantity)
              : 0,
          };

          if (variant.size?.trim()) {
            payloadVariant.size = variant.size.trim();
          }

          return payloadVariant;
        });

      const hasVariantData = variantsPayload.length > 0;

      const productPayload = {
        name: data.productName,
        productCategory: data.productCategory,
        price: Number(data.price),
        quantity: hasVariantData ? 0 : Number(data.productQuantity) || 0,
        brand: data.brand,
        availability: data.availability,
        // shortDescription: data.shortDescription,
        // longDescription: data.longDescription,
        description: data.longDescription,
        ...specificationsPayload,
      };

      const payload = {
        product: productPayload,
        varients: variantsPayload,
      };

      // ✅ Append JSON payload
      formData.append("bodyData", JSON.stringify(payload));

      // ✅ Append actual image files (not just URLs)
      data.images.forEach((image, index) => {
        if (image.file) {
          formData.append("productImages", image.file);
        }
      });

      await addProductFn(formData).unwrap();

      onClose();
      reset();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <ScrollArea className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold">Add Product</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category & Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Product Category</Label>
              <Select
                onValueChange={(value) => setValue("productCategory", value)}
                value={watch("productCategory")}
              >
                <SelectTrigger className="py-6">
                  <SelectValue placeholder="Select Product Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input
                className="py-6 rounded-xl"
                {...register("productName", { required: true })}
                placeholder="Product name"
              />
            </div>
          </div>

          {/* Brand & Availability */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand</Label>
              <Input
                className="py-6 rounded-xl  cursor-not-allowed"
                {...register("brand")}
                value={watch("brand")}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Availability</Label>
              <Select
                onValueChange={(value) => setValue("availability", value)}
                value={watch("availability")}
              >
                <SelectTrigger className="py-6">
                  <SelectValue placeholder="Select Availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="InStock">In Stock</SelectItem>
                  <SelectItem value="OutOfStock">Out of Stock</SelectItem>
                  <SelectItem value="PreOrder">Pre-Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="space-y-2">
              <Label className="">Product Quantity</Label>
              <Input
                className="py-6 rounded-xl"
                {...register("productQuantity", {
                  valueAsNumber: true,
                })}
                type="number"
                placeholder="100"
              />
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Image</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addImageSlot}
                className="text-blue-500 border-blue-500 hover:bg-blue-50 bg-transparent"
              >
                + Add Image
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {imageFields.map((field, index) => {
                const imageData = watch(`images.${index}`);
                return (
                  <div key={field.id} className="relative">
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer min-h-[160px] flex items-center justify-center bg-gray-50"
                      onClick={() => {
                        if (!imageData?.preview && !imageData?.uploading) {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = "image/*";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement)
                              .files?.[0];
                            if (file) handleImageUpload(index, file);
                          };
                          input.click();
                        }
                      }}
                    >
                      {imageData?.preview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={imageData.preview}
                            alt={`Preview ${index + 1}`}
                            width={160}
                            height={160}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : imageData?.uploading ? (
                        <p className="text-sm text-gray-500">Uploading...</p>
                      ) : (
                        <Plus
                          className="w-12 h-12 text-gray-400"
                          strokeWidth={1.5}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price</Label>
              <Input
                className="py-6 rounded-xl"
                {...register("price", { required: true })}
                type="number"
                step="0.01"
                placeholder="Type here"
              />
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4 border border-[#CBD5E1] rounded-xl p-5">
            <div className="flex items-center justify-between">
              <h1 className="text-[18px] font-semibold text-default">
                Variants
              </h1>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendVariant({ color: "", quantity: 0, size: "" })
                }
              >
                + Add Variant
              </Button>
            </div>

            {variantFields.map((field, variantIndex) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end"
              >
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input
                    className="py-6 rounded-xl"
                    {...register(`variants.${variantIndex}.color` as const)}
                    placeholder="color code"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    className="py-6 rounded-xl"
                    {...register(`variants.${variantIndex}.quantity` as const, {
                      valueAsNumber: true,
                    })}
                    type="number"
                    placeholder="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Size (Optional)</Label>
                  <div className="flex gap-2">
                    <Input
                      className="py-6 rounded-xl"
                      {...register(`variants.${variantIndex}.size` as const)}
                      placeholder="XL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => removeVariant(variantIndex)}
                      className="rounded-[99px] font-medium"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="w-full">
            <div className="flex items-center gap-10 mb-4">
              <button
                type="button"
                className={`py-2 font-medium ${
                  activeTab === "specifications"
                    ? " text-default font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("specifications")}
              >
                Specifications
              </button>
              <button
                type="button"
                className={`py-2 font-medium ${
                  activeTab === "description"
                    ? "text-default font-semibold"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
            </div>

            {activeTab === "specifications" && (
              <div className="space-y-4 border border-[#CBD5E1] rounded-xl p-5">
                <h1 className="text-[18px] font-semibold text-default">
                  Specifications
                </h1>

                {watch("specificationGroups").map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="rounded-lg space-y-4 border p-4"
                  >
                    <p className="text-default font-medium">
                      Specification Group Name
                    </p>
                    <div className="flex items-center justify-between gap-5">
                      <Input
                        className="py-6 rounded-xl"
                        {...register(
                          `specificationGroups.${groupIndex}.groupName` as const,
                        )}
                        placeholder="Group Name (e.g., Technical, Physical, Warranty)"
                        value={group.groupName}
                        readOnly // Make group names read-only since they are fixed
                      />
                      <div className="w-32">
                        {" "}
                        {/* Placeholder for alignment */}{" "}
                      </div>
                    </div>

                    {group.specifications?.map((spec, specIndex) => (
                      <div
                        key={specIndex}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
                      >
                        <Input
                          className="py-6 rounded-xl"
                          {...register(
                            `specificationGroups.${groupIndex}.specifications.${specIndex}.key` as const,
                          )}
                          placeholder="Key (e.g., Processor, RAM, Storage)"
                        />
                        <div className="flex gap-2">
                          <Input
                            className="py-6 rounded-xl"
                            {...register(
                              `specificationGroups.${groupIndex}.specifications.${specIndex}.value` as const,
                            )}
                            placeholder="Value (e.g., Intel i7, 16GB, 1TB SSD)"
                          />
                          {specIndex === group.specifications.length - 1 ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              onClick={() =>
                                addSpecificationToGroup(groupIndex)
                              }
                              className="rounded-[99px] font-medium"
                            >
                              + Add
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="lg"
                              onClick={() =>
                                removeSpecificationFromGroup(
                                  groupIndex,
                                  specIndex,
                                )
                              }
                              className="rounded-[99px] font-medium"
                            >
                              - Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "description" && (
              <div className="border border-[#CBD5E1] p-4 rounded-xl flex items-center gap-5">
                {/* <div className=" w-1/2">
                  <Label className="text-default font-semibold">
                    Short Description
                  </Label>
                  <Textarea
                    {...register("shortDescription")}
                    placeholder="Brief description of the product"
                    className="min-h-[200px] active:outline-none  mt-2"
                  />
                </div> */}

                <div className=" w-full">
                  <Label className="text-default font-semibold">
                    Description
                  </Label>
                  <Textarea
                    {...register("longDescription")}
                    placeholder="Detailed description of the product"
                    className="min-h-[200px] active:outline-none  mt-2"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              size={"lg"}
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-[99px]"
            >
              Cancel
            </Button>
            <Button
              size={"lg"}
              type="submit"
              className="bg-primary rounded-[99px] text-white"
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
}
