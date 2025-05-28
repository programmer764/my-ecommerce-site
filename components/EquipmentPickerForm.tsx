import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2 } from "lucide-react"

export default function EquipmentForm() {
  const [task, setTask] = useState('cold')
  const [price, setPrice] = useState('under20')
  const [areaFrom, setAreaFrom] = useState('')
  const [areaTo, setAreaTo] = useState('')
  const [phone, setPhone] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/submit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, price, areaFrom, areaTo, phone }),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const err = await res.json()
        alert(err.message || 'Error')
      }
    } catch (e) {
      console.error(e)
      alert('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`bg-white rounded-xl p-6 max-w-sm w-full mx-auto relative transition-opacity ${submitted ? 'opacity-50 pointer-events-none' : ''}`}>
      {submitted && (
        <div className="absolute inset-0 bg-white bg-opacity-90 z-10 flex flex-col justify-center items-center">
          <CheckCircle2 size={48} className="text-green-600 mb-2" />
          <p className="text-lg font-semibold text-green-700">Заявка принята</p>
        </div>
      )}

      <div className="flex items-start gap-3 mb-4">
        <img src="/icons/expert.jpg" alt="Expert" className="w-40 h-40" />
        <div>
          <h2 className="text-lg font-semibold text-black leading-tight">Эксперт подберёт оборудование за 40 мин</h2>
          <p className="text-sm text-gray-600 mt-1">Подберем оборудование за 40 минут! Хотите проверить?</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="font-medium text-sm mb-1">Задача</p>
        <ToggleGroup type="single" value={task} onValueChange={setTask} className="flex gap-2">
          <ToggleGroupItem value="cold">❄ Холод</ToggleGroupItem>
          <ToggleGroupItem value="heat">☀ Обогрев</ToggleGroupItem>
          <ToggleGroupItem value="both">❄☀ Холод/обогрев</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="mb-4">
        <p className="font-medium text-sm mb-1">Цена, руб</p>
        <RadioGroup value={price} onValueChange={setPrice} className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="under20" id="price1" />
            <label htmlFor="price1" className="text-sm">до 20 тыс. р.</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="20to50" id="price2" />
            <label htmlFor="price2" className="text-sm">от 20 до 50 тыс. р.</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unknown" id="price3" />
            <label htmlFor="price3" className="text-sm">Я не знаю</label>
          </div>
        </RadioGroup>
      </div>

      <div className="mb-4">
        <p className="font-medium text-sm mb-1">Площадь помещения, м²</p>
        <div className="flex gap-2">
          <Input placeholder="от 10" type="number" min={1} value={areaFrom} onChange={e => setAreaFrom(e.target.value)} />
          <Input placeholder="до 1500" type="number" min={1} value={areaTo} onChange={e => setAreaTo(e.target.value)} />
        </div>
      </div>

      <div className="mb-4">
        <Input placeholder="Введите ваш телефон" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>

      <Button
        variant="outline"
        className="w-full text-blue-700 border-blue-500 hover:bg-blue-50"
        onClick={handleSubmit}
        disabled={loading || submitted}
      >
        {loading ? 'Отправка...' : 'Заказать подбор'}
      </Button>
    </div>
  )
}
