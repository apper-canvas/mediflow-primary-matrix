import { useAuth } from "@/layouts/Root";
import { useSelector } from "react-redux";
import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

function Header({ setSidebarOpen }) {
  const { logout } = useAuth()
  const { user } = useSelector(state => state.user)

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    if (user?.emailAddress) {
      return user.emailAddress.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-sm border-b border-gray-200">
      <button
        type="button"
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <ApperIcon name="Menu" className="h-6 w-6" />
      </button>
      
      <div className="flex-1 px-4 flex justify-between items-center">
        <div className="flex-1 flex">
          <h2 className="text-xl font-semibold text-gray-900 hidden sm:block">
            Hospital Management System
          </h2>
        </div>
        
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="relative p-2"
          >
            <ApperIcon name="Bell" className="h-5 w-5" />
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          </Button>
          
          <div className="relative flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center space-x-2 p-2"
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
                {getInitials()}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700">
                {user?.firstName || user?.emailAddress || 'User'}
              </span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-1 p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="LogOut" className="h-5 w-5" />
              <span className="hidden md:block text-sm font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header