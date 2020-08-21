import axios, { AxiosResponse } from "axios"

export interface MarketData {
  name: string
  time: number
  rate: number
}

export class Price {
  public async current(currency: string = "USD"): Promise<number> {
    try {
      const cur: string = currency.toUpperCase()

      const response: AxiosResponse = await axios.get(
        `https://markets.api.bitcoin.com/rates/convertor?c=BCH&q=${cur}`
      )

      const marketData: MarketData = response.data[cur]

      return marketData.rate
    } catch (error) {
      if (error.response && error.response.data) throw error.response.data
      else throw error
    }
  }
}
