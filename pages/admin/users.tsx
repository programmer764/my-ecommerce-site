import { useEffect, useState } from 'react'
import Layout from '@/components/Layout'

interface User {
  _id: string
  email: string
  role: string
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('все')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.append('email', search.trim())
      if (roleFilter !== 'все') params.append('role', roleFilter)
      const res = await fetch('/api/users?' + params.toString(), {
        credentials: 'include'
      })
      const data = await res.json()
      setUsers(data)
    } catch (e) {
      console.error('❌ Ошибка загрузки пользователей', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [search, roleFilter])

  const handleRoleChange = async (id: string, newRole: string) => {
    await fetch('/api/users', {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role: newRole })
    })
    fetchUsers()
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">👥 Пользователи</h1>

        <div className="flex gap-4 mb-4">
          <input
            placeholder="Поиск по email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-64"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="все">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="admin">Админ</option>
            <option value="manager">Менеджер</option>
          </select>
        </div>

        {loading ? (
          <p>Загрузка...</p>
        ) : users.length === 0 ? (
          <p>Нет пользователей</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Email</th>
                <th className="border px-3 py-2">Роль</th>
                <th className="border px-3 py-2">Дата регистрации</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border px-3 py-2">{user.email}</td>
                  <td className="border px-3 py-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className="border p-1 rounded"
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                      <option value="manager">manager</option>
                    </select>
                  </td>
                  <td className="border px-3 py-2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  )
}
