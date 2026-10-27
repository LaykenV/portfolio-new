import Image from 'next/image'

export function WritingIdentity() {
  return (
    <>
      <Image
        src="/portrait.jpeg"
        alt=""
        width={28}
        height={28}
        draggable={false}
        className="rounded-full border border-[var(--border)] object-cover"
      />
      <span className="site-brand-name">Layken Varholdt</span>
    </>
  )
}
