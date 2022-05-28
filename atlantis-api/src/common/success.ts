export const createSuccess = <T>(result: T) => ({
  type: 'success',
  data: result,
})
