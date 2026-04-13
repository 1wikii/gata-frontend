import React from "react";
import { User, UserRole } from "@/types/users";
import { Edit2, Trash2, CheckCircle, XCircle } from "lucide-react";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isLoading?: boolean;
}

const getRoleBadgeStyle = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "bg-red-100 text-red-800";
    case "lecturer":
      return "bg-blue-100 text-blue-800";
    case "student":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleLabel = (role: UserRole) => {
  switch (role) {
    case "admin":
      return "Admin";
    case "lecturer":
      return "Dosen";
    case "student":
      return "Mahasiswa";
    default:
      return role;
  }
};

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  onEdit,
  onDelete,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <div className="flex items-center justify-center py-8">
          <p className="text-gray-500">Tidak ada data user</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Role
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              NIP/NIM
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Initials
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              {/* Role */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeStyle(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>
              </td>

              {/* NIP/NIM */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">
                  {user.nip || user.nim || "-"}
                </div>
              </td>

              {/* Email */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-600">{user.email}</div>
              </td>

              {/* Name */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
              </td>

              {/* Initials */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded w-fit">
                  {user.initials || "-"}
                </div>
              </td>

              {/* Actions */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(user)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                  title="Edit user"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(user)}
                  className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete user"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
