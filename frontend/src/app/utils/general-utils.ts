export function decodeError(err: Object): any {
  if ('error_description' in err) {
    return err['error_description']
  }
  if ('error' in err) {
    return err['error']
  }
  return err
}
