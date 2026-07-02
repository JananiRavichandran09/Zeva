import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit() {
    // No backend yet — simulate the request so the flow works end-to-end.
    await new Promise((resolve) => setTimeout(resolve, 600))
    setSent(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="mb-8 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] text-white shadow-lg shadow-[#6c63ff]/30">
            <Sparkles size={20} />
          </span>
          <span className="text-xl font-bold tracking-tight text-fg">Zeva</span>
        </div>

        {sent ? (
          <div className="text-center">
            <CheckCircle2 size={48} className="mx-auto text-accent" />
            <h2 className="mt-4 text-xl font-bold text-fg">Check your email</h2>
            <p className="mt-2 text-sm text-muted">
              If an account with that email exists, we've sent a password reset
              link. Check your inbox.
            </p>
            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-brand hover:underline"
            >
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-fg">Forgot password</h1>
            <p className="mt-1 text-sm text-muted">
              Enter the email associated with your account and we'll send a
              reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div>
                <label htmlFor="email" className="mb-1 block text-sm font-medium text-fg">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-sm text-fg placeholder:text-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-brand font-semibold text-brand-fg shadow-md shadow-brand/30 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send reset link'}
              </button>
            </form>

            <Link
              to="/login"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-fg"
            >
              <ArrowLeft size={14} /> Back to sign in
            </Link>
          </>
        )}
      </motion.div>
    </div>
  )
}
