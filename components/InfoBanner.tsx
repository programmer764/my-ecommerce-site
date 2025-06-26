import { Handshake, FileText, Hourglass } from 'lucide-react'

const items = [
  {
    icon: <Handshake className="text-blue-500 w-8 h-8" />,
    title: 'Официальный дилер',
  },
  {
    icon: <FileText className="text-blue-500 w-8 h-8" />,
    title: 'Гарантийное обслуживание',
  },
  {
    icon: <Hourglass className="text-blue-500 w-8 h-8" />,
    title: '7 лет на рынке\nклиматического оборудования',
  },
]

export default function InfoBanner() {
  return (
    <div className="h-full flex justify-around items-center px-6 py-4 bg-gradient-to-r from-blue-50 to-white">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-3 text-center max-w-[160px]">
          <div>{item.icon}</div>
          <div className="text-sm font-medium text-slate-800 whitespace-pre-line">
            {item.title}
          </div>
        </div>
      ))}
    </div>
  )
}
