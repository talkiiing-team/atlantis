export const createError = <T>(message: string, data?: T) => ({
  type: 'error',
  error: { message, data },
})
