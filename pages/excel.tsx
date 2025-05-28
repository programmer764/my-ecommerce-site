import { useState } from 'react'
import Layout from '@/components/Layout'

export default function AdminExcelPage() {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleExport = () => {
    window.location.href = '/api/products/import' // GET-запрос скачает xlsx
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const buffer = await file.arrayBuffer()
      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(await parseExcelToJson(buffer)),
        credentials: 'include',
      })

      const data = await res.json()
      setMessage(data.message || 'Импорт завершён')
    } catch (err: any) {
      setMessage(err.message || 'Ошибка импорта')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">📊 Excel: экспорт / импорт товаров</h1>

        <div className="space-y-4">
          <button
            onClick={handleExport}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            📥 Скачать Excel
          </button>

          <div>
            <label className="block mb-1 font-medium">📤 Загрузить Excel-файл:</label>
            <input type="file" accept=".xlsx" onChange={handleImport} />
          </div>

          {uploading && <p className="text-blue-600">Загрузка...</p>}
          {message && <p className="text-green-700">{message}</p>}
        </div>
      </div>
    </Layout>
  )
}

async function parseExcelToJson(buffer: ArrayBuffer) {
  const XLSX = await import('xlsx')
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]
  const json = XLSX.utils.sheet_to_json(sheet)
  return json
}
