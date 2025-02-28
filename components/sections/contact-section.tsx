import { forwardRef } from "react"

const ContactSection = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section
      ref={ref}
      id="contact"
      className="min-h-screen flex flex-col items-center justify-center"
    >
      {/* ... existing code ... */}
    </section>
  )
})

ContactSection.displayName = "ContactSection"

export default ContactSection 