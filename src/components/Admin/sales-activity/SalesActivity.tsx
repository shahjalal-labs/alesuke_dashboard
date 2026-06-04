import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
} from "lucide-react";

const SalesActivity = () => {
  // Sample user data matching the design
  const users = [
    {
      name: "Roberts Albert",
      email: "crusader@yahoo.com",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Cristian",
      maritalStatus: "Single",
      status: "Active",
    },
    {
      name: "Jacob Jones",
      email: "mccurley@yahoo.ca",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Hindu",
      maritalStatus: "Married",
      status: "Active",
    },
    {
      name: "Brooklyn Simmons",
      email: "elflord@mac.com",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Cristian",
      maritalStatus: "Single",
      status: "Inactive",
    },
    {
      name: "Marvin McKinney",
      email: "pkplex@optonline.net",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Muslim",
      maritalStatus: "Single",
      status: "Active",
    },
    {
      name: "Savannah Nguyen",
      email: "plover@aol.com",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Muslim",
      maritalStatus: "Single",
      status: "Inactive",
    },
    {
      name: "Albert Flores",
      email: "fwitness@yahoo.ca",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Muslim",
      maritalStatus: "Single",
      status: "Inactive",
    },
    {
      name: "Courtney Henry",
      email: "jginspace@mac.com",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Muslim",
      maritalStatus: "Single",
      status: "Active",
    },
    {
      name: "Theresa Webb",
      email: "smallpaul@me.com",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Muslim",
      maritalStatus: "Single",
      status: "Inactive",
    },
    {
      name: "Floyd Miles",
      email: "amichalo@msn.com",
      country: "Singapore",
      nickname: "Robert12",
      religion: "Muslim",
      maritalStatus: "Single",
      status: "Inactive",
    },
  ];

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8">
      <div className="">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Essential Will Subscriber Card */}
          <div className="bg-[#36B8401A] rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Essential Will Subscriber</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                10,056
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Unlimited Legacy Subscriber Card */}
          <div className="bg-[#FAAD141A] rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Unlimited Legacy Subscriber</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-800">
                4,056
              </p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>

          
        </div>

        {/* Subscription List */}
       <div className="bg-white rounded-xl shadow-md overflow-hidden mt-10">
        <h1 className="text-xl font-bold text-gray-800 py-8 pl-4">Subscription List</h1>
         <div className="">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.country}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.nickname}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {user.religion}
                    </td>
                   
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 bg-white border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="relative ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to{" "}
                  <span className="font-medium">9</span> of{" "}
                  <span className="font-medium">3,960</span> results
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    440
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
       </div>
      </div>
    </div>
  );
};

export default SalesActivity;
