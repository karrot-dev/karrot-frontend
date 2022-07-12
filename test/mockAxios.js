import MockAdapter from 'axios-mock-adapter'
import axios from '@/base/api/axios'

export const mockAxios = new MockAdapter(axios, { onNoMatch: 'throwException' })
