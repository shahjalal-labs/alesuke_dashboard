"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { useState, useEffect } from "react"
import Pagination from "@/components/ui/Pagination"
import UserManagementTable from "@/components/table/UserManagementTable"
import { useGetAllUserListQuery } from "@/redux/api/admin/dashboarApi"
import SimpleLoader from "@/components/ui/SimpleLoader"
import SendCouponModal from "./SendCouponModal"

// ----------------- Define the type -----------------
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  proffesion: string | null
  profileImage: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

interface UserResponse {
  success: boolean
  message: string
  result: {
    meta: {
      page: number
      limit: number
      total: number
      totalPage: number
    }
    result: User[]
  }
}

const professionOptions = [
  "All",
  "Student",
  "Teacher",
  "Office worker",
  "Factory",
  "Business owner",
  "Freelancer",
  "Lawyer",
  "Farmer",
  "Retired",
]

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedProfession, setSelectedProfession] = useState("All")
  const [isSendCouponModalOpen, setIsSendCouponModalOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const { data: usersListData, isLoading, error } = useGetAllUserListQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchQuery || "",
    profession: selectedProfession !== "All" ? selectedProfession : "",
  })

  useEffect(() => {
    if (usersListData?.success) {
      const response = usersListData as UserResponse
      setUsers(response.result.result)
      setTotalItems(response.result.meta.total)
    }
  }, [usersListData])

  // Filter by profession on client side if needed
  const filteredData = users.filter((user) => {
    const matchesProfession =
      selectedProfession === "All" || 
      (user.proffesion && user.proffesion === selectedProfession)
    return matchesProfession
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleProfessionFilter = (profession: string) => {
    setSelectedProfession(profession)
    setIsFilterOpen(false)
    setCurrentPage(1)
  }

  const handleUserSelectionChange = (userIds: string[]) => {
    setSelectedUsers(userIds)
  }

  if (isLoading) {
    return <SimpleLoader/>
  }

  if (error) {
    return <div className="p-6">Error loading users.</div>
  }

  return (
    <div>
      <div className="py-8 bg-white rounded-[16px]">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 px-4 relative">
          <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, or profession"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 w-64 border-gray-200 rounded-lg focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Filter Button */}
            <div className="relative">
              <Button
                variant="outline"
                className="px-4 py-2 border-gray-200 rounded-lg hover:bg-gray-50 bg-transparent"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4 mr-2" />
                {selectedProfession === "All" ? "Filter" : selectedProfession}
              </Button>

              {/* Dropdown */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  {professionOptions.map((profession) => (
                    <div
                      key={profession}
                      className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                        selectedProfession === profession ? "bg-gray-100 font-medium" : ""
                      }`}
                      onClick={() => handleProfessionFilter(profession)}
                    >
                      {profession}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Send Coupon Button */}
            <Button 
              className="px-6 py-5 rounded-[40px] bg-primary text-white text-[18px] font-medium"
              onClick={() => setIsSendCouponModalOpen(true)}
              disabled={selectedUsers.length === 0}
            >
              <span className="mr-2">📧</span>
              Send Coupon
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white overflow-hidden">
          <UserManagementTable 
            users={filteredData} 
            onUserSelectionChange={handleUserSelectionChange}
          />
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 px-4">
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
          onItemsPerPageChange={(newItemsPerPage) => {
            setItemsPerPage(newItemsPerPage)
            setCurrentPage(1)
          }}
          itemsPerPageOptions={[10, 20, 50, 100]}
        />
      </div>

      {/* Send Coupon Modal */}
      <SendCouponModal 
        isOpen={isSendCouponModalOpen}
        onClose={() => setIsSendCouponModalOpen(false)}
        selectedUserIds={selectedUsers}
      />
    </div>
  )
}