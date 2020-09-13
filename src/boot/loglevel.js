import log from '@/utils/log'

if (process.env.DEV) {
  log.setLevel('debug')
}
