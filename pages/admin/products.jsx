import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [selectAllAcrossPages, setSelectAllAcrossPages] = useState(false)
  const [form, setForm] = useState({
    name: '', price: '', quantity: 1,
    category: '', link: '', image: '',
    characteristics: [{ name: '', value: '' }]
  })

  const limit = 15
  const fetchProducts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      params.set('sortBy', sortBy)
      params.set('sortDir', sortDir)
      params.set('page', String(page))
  
      const res = await fetch(`/api/products/adminapi?${params}`)
      const { products, totalCount } = await res.json()
      setProducts(products)
      setTotalPages(Math.ceil(totalCount / limit))
    } catch (e) {
      console.error(e)
      setError('Ошибка загрузки')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchProducts()
  }, [search, sortBy, sortDir, page])
  
  // В runBulk:
  const runBulk = async (operation) => {
    if (!selectedIds.length) return alert('Выберите товары')
    const name = prompt('Название характеристики')
    if (!name) return
  
    let value = ''
    if (operation !== 'remove') {
      value = prompt('Значение')
      if (value === null) return
    }
  
    await fetch('/api/products/adminapi', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ids: selectedIds,
        charName: name,
        ...(operation !== 'remove' ? { charValue: value } : {}),
        operation
      })
    })
  
    setSelectedIds([])
    await fetchProducts()
  }
  

  const resetForm = () => {
    setEditingId(null)
    setForm({
      name: '', price: '', quantity: 1,
      category: '', link: '', image: '',
      characteristics: [{ name: '', value: '' }]
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()
  
    const url = editingId
      ? `/api/products/adminapi?id=${editingId}`
      : `/api/products/adminapi`
    const method = editingId ? 'PUT' : 'POST'
  
    const payload = {
      ...form,
      price: parseFloat(form.price),
      characteristics: form.characteristics.filter(c => c.name && c.value)
    }
  
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  
    if (res.ok) {
      resetForm()
      setPage(1)
      await fetchProducts() // 🔄 ДОБАВЬ ЭТО: мягкое обновление таблицы
    } else {
      setError('Ошибка сохранения')
    }
  }
  

  const handleEdit = p => {
    setEditingId(p._id)
    setForm({
      name: p.name,
      price: String(p.price),
      quantity: p.quantity,
      category: p.category,
      link: p.link,
      image: p.image,
      characteristics: p.characteristics.length
        ? p.characteristics
        : [{ name: '', value: '' }]
    })
  }

  const handleDelete = async id => {
    if (!confirm('Удалить?')) return
  
    await fetch(`/api/products/adminapi?id=${id}`, { method: 'DELETE' })
    
    setPage(1)
    await fetchProducts() // 🔄 Мягко обновить список товаров
  }
  

  const toggleSelectAll = async () => {
    if (selectAllAcrossPages) {
      setSelectedIds([])
      setSelectAllAcrossPages(false)
    } else {
      // Получим все id товаров по текущим фильтрам
      const params = new URLSearchParams()
      if (search.trim()) params.set('search', search.trim())
      params.set('sortBy', sortBy)
      params.set('sortDir', sortDir)
      params.set('all', 'true') // кастомный параметр
  
      const res = await fetch(`/api/products/adminapi?${params}`)
      const { products } = await res.json()
  
      const allIds = products.map(p => p._id)
      setSelectedIds(allIds)
      setSelectAllAcrossPages(true)
    }
  }
  

  const toggleSelect = id => {
    setSelectedIds(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  }

  

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Администрирование товаров</h1>

        <form onSubmit={handleSubmit} className="mb-8 border p-4 rounded space-y-4">
          <h2 className="font-semibold">{editingId ? 'Редактировать' : 'Добавить'} товар</h2>
          {error && <p className="text-red-500">{error}</p>}
          <input placeholder="Название" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full p-2 border rounded" />
          <div className="flex gap-4">
            <input type="number" required placeholder="Цена" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="flex-1 p-2 border rounded" />
            <input type="number" placeholder="Кол-во" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))} className="w-32 p-2 border rounded" />
          </div>
          <input placeholder="Категория" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full p-2 border rounded" />
          <input placeholder="Ссылка" value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} className="w-full p-2 border rounded" />
          <input placeholder="URL картинки" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="w-full p-2 border rounded" />
          <div>
            <h3 className="font-semibold mb-2">Характеристики</h3>
            {form.characteristics.map((c, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input placeholder="Название" value={c.name} onChange={e => {
                  const ch = [...form.characteristics]; ch[i].name = e.target.value
                  setForm(f => ({ ...f, characteristics: ch }))
                }} className="flex-1 p-2 border rounded" />
                <input placeholder="Значение" value={c.value} onChange={e => {
                  const ch = [...form.characteristics]; ch[i].value = e.target.value
                  setForm(f => ({ ...f, characteristics: ch }))
                }} className="flex-1 p-2 border rounded" />
                <button type="button" onClick={() => {
                  const ch = [...form.characteristics]; ch.splice(i, 1)
                  setForm(f => ({ ...f, characteristics: ch }))
                }} className="text-red-500">✕</button>
              </div>
            ))}
            <button type="button" onClick={() => {
              setForm(f => ({ ...f, characteristics: [...f.characteristics, { name: '', value: '' }] }))
            }} className="text-blue-600 underline">+ Добавить характеристику</button>
          </div>
          <div className="flex gap-4">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? 'Сохранить' : 'Добавить'}</button>
            {editingId && (
              <button type="button" onClick={() => resetForm()} className="px-4 py-2 border rounded">Отмена</button>
            )}
          </div>
        </form>

        <div className="flex flex-wrap gap-4 mb-4">
          <input placeholder="Поиск..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} className="border p-2 rounded w-64" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="name">Название</option>
            <option value="price">Цена</option>
          </select>
          <select value={sortDir} onChange={e => setSortDir(e.target.value)} className="border p-2 rounded">
            <option value="asc">▲ возр.</option>
            <option value="desc">▼ убыв.</option>
          </select>
          <button onClick={() => { setSearch(''); setSortBy('name'); setSortDir('asc'); setPage(1) }} className="px-4 py-2 border rounded">Сбросить</button>
          <button onClick={() => runBulk('add')} disabled={!selectedIds.length} className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50">Добавить характеристику</button>
          <button onClick={() => runBulk('update')} disabled={!selectedIds.length} className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50">Изменить характеристику</button>
          <button onClick={() => runBulk('remove')} disabled={!selectedIds.length}  className="bg-red-500 text-white px-4 py-2 rounded disabled:opacity-50">  Удалить характеристику</button>

        </div>

        {loading ? <p>Загрузка…</p> : (
          <table className="w-full text-sm border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2"><input type="checkbox" onChange={toggleSelectAll} checked={products.length > 0 && products.every(p => selectedIds.includes(p._id))} /></th>
                <th className="border px-4 py-2">Название</th>
                <th className="border px-4 py-2">Цена</th>
                <th className="border px-4 py-2">Кол-во</th>
                <th className="border px-4 py-2">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2"><input type="checkbox" checked={selectedIds.includes(p._id)} onChange={() => toggleSelect(p._id)} /></td>
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{p.price} ₽</td>
                  <td className="border px-4 py-2">{p.quantity}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-600 hover:underline">Измнить</button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:underline">Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex justify-center items-center gap-2">
          <button disabled={page <= 1} onClick={() => setPage(v => v - 1)} className="px-3 py-1 border rounded disabled:opacity-50">‹</button>
          <span>{page} из {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(v => v + 1)} className="px-3 py-1 border rounded disabled:opacity-50">›</button>
        </div>
      </div>
    </Layout>
  )
}
