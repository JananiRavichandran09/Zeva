import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/app/AuthProvider'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormValues) {
    setServerError('')
    try {
      await login(data.email, data.password)
      navigate('/')
    } catch (err: any) {
      setServerError(err.message || 'Something went wrong')
    }
  }

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Left: branding */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] p-12 lg:flex">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-sm text-center text-white"
        >
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
            <Sparkles size={28} />
          </span>
          <h2 className="mt-6 text-3xl font-bold">Welcome back</h2>
          <p className="mt-3 text-white/80">
            Pick up where you left off. Zeva keeps everything organized while
            you're away.
          </p>
        </motion.div>
      </div>

      {/* Right: form */}
      <div className="flex w-full flex-1 items-center justify-center px-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-fg">Sign in</h1>
          <p className="mt-1 text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand hover:underline">
              Create one
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            {serverError && (
              <div className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400">
                {serverError}
              </div>
            )}

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

            <div>
              <div className="mb-1 flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-fg">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-brand hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-line bg-surface px-4 pr-11 text-sm text-fg placeholder:text-muted transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-fg"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl bg-brand font-semibold text-brand-fg shadow-md shadow-brand/30 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
