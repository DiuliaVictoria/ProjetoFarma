import { Sparkles } from 'lucide-react'

function ComingSoon({ title, description }) {
  return (
    <section className="coming-soon card">
      <span className="coming-soon__icon"><Sparkles size={21} /></span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
      <span className="coming-soon__label">Em breve</span>
    </section>
  )
}

export default ComingSoon
