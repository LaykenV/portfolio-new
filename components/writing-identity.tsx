import Image from 'next/image'

export function WritingIdentity() {
  return (
    <>
      <Image
        src="/portrait.jpeg"
        alt=""
        width={28}
        height={28}
        className="rounded-full border border-[var(--border)] object-cover"
      />
      Layken Varholdt
    </>
  )
}
