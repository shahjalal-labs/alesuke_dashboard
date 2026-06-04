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
  useGetAllProductCategoriesQuery,
  useGetSingleProductDetailsQuery,
  useUpdateProductMutation,
} from "@/redux/api/admin/productApi";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

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
  existingUrl?: string;
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
  variants: ProductVariant[];
  specificationGroups: SpecificationGroup[];
  brand: string;
  availability: string;
  shortDescription: string;
  longDescription: string;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
}

export default function EditProductModal({
  isOpen,
  onClose,
  productId,
}: EditProductModalProps) {
  const [activeTab, setActiveTab] = useState("specifications");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const [updateProductFn, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  const { data: singleProductDetails, isLoading: isProductLoading } =
    useGetSingleProductDetailsQuery(productId!, {
      skip: !productId || !isOpen,
    });

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
        variants: [
          {
            color: "",
            quantity: 0,
            size: "",
          },
        ],
        brand: "",
        availability: "InStock",
        shortDescription: "",
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

  // Find matching category by name
  const findCategoryByName = (categoryName: string) => {
    return categories.find((category: any) => category.name === categoryName);
  };

  // Find matching category by ID
  const findCategoryById = (categoryId: string) => {
    return categories.find((category: any) => category.id === categoryId);
  };

  // Populate form with product data when it loads
  useEffect(() => {
    if (singleProductDetails?.result && categories.length > 0) {
      const product = singleProductDetails.result;
      console.log("product data:", product);
      console.log("available categories:", categories);
      console.log("product category from API:", product.productCategory);

      // Set basic fields
      setValue("productName", product.name);
      setValue("price", product.price);
      setValue("brand", product.brand);
      setValue("availability", product.availability);
      setValue("shortDescription", product.shortDescription);
      setValue("longDescription", product.description);

      // Set variants
      if (
        product.varients &&
        Array.isArray(product.varients) &&
        product.varients.length > 0
      ) {
        const variantsData: ProductVariant[] = product.varients.map(
          (variant: any) => ({
            color: variant.color || "",
            quantity: variant.quantity || 0,
            size: variant.size || "",
          }),
        );
        setValue("variants", variantsData);
      } else {
        // Fallback to single quantity if variants not available
        setValue("variants", [
          {
            color: "",
            quantity: product.quantity || 0,
            size: "",
          },
        ]);
      }

      // Find and set the correct category
      if (product.productCategory) {
        // Try to find category by name first
        const matchedCategory = findCategoryByName(product.productCategory);

        if (matchedCategory) {
          console.log("Found category by name:", matchedCategory);
          setValue("productCategory", matchedCategory.name);
          setSelectedCategoryId(matchedCategory.id);
        } else {
          // If not found by name, try to find by ID or use the raw value
          console.log("Category not found by name, trying other methods...");

          // Check if productCategory might be an ID
          const categoryById = findCategoryById(product.productCategory);
          if (categoryById) {
            setValue("productCategory", categoryById.name);
            setSelectedCategoryId(categoryById.id);
          } else {
            // Use the raw value as fallback
            setValue("productCategory", product.productCategory);
            setSelectedCategoryId("");
          }
        }
      }

      // Set images
      const imageUploads: ImageUpload[] = product.images.map((url: string) => ({
        preview: url,
        uploading: false,
        existingUrl: url,
      }));
      setValue("images", imageUploads);

      // Set specification groups
      const specGroups: SpecificationGroup[] = [
        {
          groupName: "technicalSpecification",
          specifications: product.technicalSpecification
            ? Object.entries(product.technicalSpecification).map(
                ([key, value]) => ({
                  key,
                  value: value as string,
                }),
              )
            : [{ key: "", value: "" }],
        },
        {
          groupName: "physicalSpecification",
          specifications: product.physicalSpecification
            ? Object.entries(product.physicalSpecification).map(
                ([key, value]) => ({
                  key,
                  value: value as string,
                }),
              )
            : [{ key: "", value: "" }],
        },
        {
          groupName: "warrantyInformation",
          specifications: product.warrantyInformation
            ? Object.entries(product.warrantyInformation).map(
                ([key, value]) => ({
                  key,
                  value: value as string,
                }),
              )
            : [{ key: "", value: "" }],
        },
      ];
      setValue("specificationGroups", specGroups);
    }
  }, [singleProductDetails, categories, setValue]);

  const handleCategoryChange = (value: string) => {
    const selectedCategory = categories.find((cat: any) => cat.id === value);
    if (selectedCategory) {
      setValue("productCategory", selectedCategory.name);
      setSelectedCategoryId(selectedCategory.id);
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    if (!file) return;
    const currentImages = watch("images");
    const updatedImages = [...currentImages];
    updatedImages[index] = { ...updatedImages[index], uploading: true, file };
    setValue("images", updatedImages);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const previewUrl = URL.createObjectURL(file);
    updatedImages[index] = {
      ...updatedImages[index],
      preview: previewUrl,
      uploading: false,
    };
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

      // Build variants payload
      const variantsPayload = data.variants
        .filter((variant) => variant.color && Number(variant.quantity) > 0)
        .map((variant) => {
          const payloadVariant: ProductVariant = {
            color: variant.color,
            quantity: Number(variant.quantity),
          };

          if (variant.size) {
            payloadVariant.size = variant.size;
          }

          return payloadVariant;
        });

      // Build payload shape expected by backend
      const productPayload: any = {
        name: data.productName,
        productCategory: data.productCategory,
        price: Number(data.price),
        brand: data.brand,
        availability: data.availability,
        // shortDescription: data.shortDescription,
        description: data.longDescription,
        ...specificationsPayload,
      };

      const payload: any = {
        product: productPayload,
        varients: variantsPayload,
      };

      // ✅ Append JSON payload (without images)
      formData.append("bodyData", JSON.stringify(payload));

      // ✅ Handle ALL images in productImages field (both existing and new)
      data.images.forEach((image) => {
        if (image.file) {
          // New image file - append as File
          formData.append("productImages", image.file);
        } else if (image.existingUrl) {
          // Existing image URL - append as string
          formData.append("productImages", image.existingUrl);
        }
      });

      // If no images are selected, but product had existing images, include them
      if (data.images.length === 0 && singleProductDetails?.result?.images) {
        singleProductDetails.result.images.forEach((url: string) => {
          formData.append("productImages", url);
        });
      }

      // Log for debugging (remove in production)
      console.log("Payload:", payload);
      console.log("All images:", data.images);

      const response = await updateProductFn({
        id: productId,
        data: formData,
      }).unwrap();

      if (response?.success) {
        toast.success("Product updated successfully");
        onClose();
        reset();
      }
    } catch (error: any) {
      console.error("Failed to update product:", error);
      if (error?.data?.message) {
        toast.error(`Failed to update product: ${error.data.message}`);
      } else {
        toast.error("Failed to update product");
      }
    }
  };

  const handleCancel = () => {
    reset();
    setSelectedCategoryId("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <ScrollArea className="bg-white rounded-lg shadow-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold">
            {productId ? "Edit Product" : "Add Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Loading State */}
        {(isProductLoading || isCategoryLoading) && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Debug Info */}
        {/* <div className="text-sm text-gray-500 mb-4 p-2 bg-gray-100 rounded">
          Debug: Current Category: "{watch("productCategory") || "Not set"}" |
          Categories: {categories.length} | Product:{" "}
          {singleProductDetails?.result ? "Loaded" : "Loading"}
        </div> */}

        {/* Form */}
        {!isProductLoading && !isCategoryLoading && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Category & Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product Category</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={selectedCategoryId}
                >
                  <SelectTrigger className="py-6">
                    <SelectValue placeholder="Select Product Category">
                      {watch("productCategory") || "Select Product Category"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
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
                  className="py-6 rounded-xl"
                  {...register("brand")}
                  placeholder="Brand name"
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
                          if (!imageData?.uploading) {
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
                  {...register("price", {
                    required: true,
                    valueAsNumber: true,
                  })}
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
                      {...register(`variants.${variantIndex}.color` as const, {
                        required: true,
                      })}
                      placeholder="color code"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      className="py-6 rounded-xl"
                      {...register(
                        `variants.${variantIndex}.quantity` as const,
                        {
                          required: true,
                          valueAsNumber: true,
                        },
                      )}
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
                        disabled={variantFields.length === 1}
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
                          className="py-6 rounded-xl bg-gray-50 cursor-not-allowed"
                          {...register(
                            `specificationGroups.${groupIndex}.groupName` as const,
                          )}
                          placeholder="Group Name"
                          value={group.groupName}
                          readOnly
                        />
                        <div className="w-32"></div>
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
                  {/* <div className="w-1/2">
                    <Label className="text-default font-semibold">
                      Short Description
                    </Label>
                    <Textarea
                      {...register("shortDescription")}
                      placeholder="Brief description of the product"
                      className="min-h-[200px] active:outline-none mt-2"
                    />
                  </div> */}

                  <div className=" w-full">
                    <Label className="text-default font-semibold">
                      Description
                    </Label>
                    <Textarea
                      {...register("longDescription")}
                      value={watch("longDescription")}
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
                disabled={isUpdating}
              >
                {isUpdating ? "Updating..." : "Update Product"}
              </Button>
            </div>
          </form>
        )}
      </ScrollArea>
    </div>
  );
}
